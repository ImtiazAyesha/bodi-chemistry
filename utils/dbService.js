import { supabase } from './supabaseClient.js';

/**
 * Uploads a base64 data URL to a Supabase Storage bucket.
 * Returns the public URL or null on failure.
 */
const uploadBase64 = async (bucket, path, base64DataUrl, contentType = 'image/jpeg') => {
  try {
    // Convert data URL to Blob
    const res = await fetch(base64DataUrl);
    const blob = await res.blob();

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, { contentType, upsert: true });

    if (error) {
      console.warn(`Storage upload failed [${path}]:`, error.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (err) {
    console.warn(`uploadBase64 error [${path}]:`, err);
    return null;
  }
};

/**
 * saveScan — called after the PDF is generated.
 *
 * Uploads:
 *   • 4 captured images  → scan-images bucket
 *   • Generated PDF blob → scan-pdfs bucket
 *
 * Inserts:
 *   • scans table        — visible / reportable data
 *   • scan_metrics table — internal numeric data (hidden from clients)
 *
 * @param {object} captureData      — stage1..stage4 images + metrics
 * @param {object} questionnaireData — normalizedScores + answers
 * @param {object} patternResults   — primaryPattern, secondaryPattern
 * @param {object} scores           — total, face, body, questionnaire
 * @param {string} contactEmail     — optional, collected elsewhere
 * @returns {object} { scanId, pdfUrl } or { error }
 */
export const saveScan = async (captureData, questionnaireData, patternResults, scores, contactEmail = '') => {
  try {
    const scanId = crypto.randomUUID();
    const timestamp = Date.now();

    // ── 1. Upload 4 captured images ─────────────────────────────
    const imageUrls = {};
    const stageMap = {
      stage1: 'face_front',
      stage2: 'body_front',
      stage3: 'upper_body_side',
      stage4: 'full_body_side',
    };

    await Promise.all(
      Object.entries(stageMap).map(async ([stageKey, label]) => {
        const img = captureData[stageKey]?.image;
        if (!img) return;
        const path = `${scanId}/${label}_${timestamp}.jpg`;
        imageUrls[label] = await uploadBase64('scan-images', path, img, 'image/jpeg');
      })
    );

    // ── 2. INSERT scan record ────────────────────────────────────
    const primaryPattern = patternResults?.primaryPattern?.name || '';
    const primarySeverity = patternResults?.primaryPattern?.severity || '';
    const secondaryPattern = patternResults?.secondaryPattern?.name || null;
    const qs = questionnaireData?.normalizedScores || {};

    const { data: scanRow, error: scanError } = await supabase
      .from('scans')
      .insert({
        id: scanId,
        contact_email: contactEmail,
        scan_date: new Date().toISOString(),
        primary_pattern: primaryPattern,
        primary_pattern_severity: primarySeverity,
        secondary_pattern: secondaryPattern,
        forward_compression_score: qs.upperCompression ?? null,
        back_bracing_score: qs.lowerCompression ?? null,
        collapse_score: qs.thoracicCollapse ?? null,
        lateral_shift_score: qs.lateralAsymmetry ?? null,
        pdf_url: null, // updated below after PDF upload
        image_face_front: imageUrls.face_front || null,
        image_body_front: imageUrls.body_front || null,
        image_upper_body_side: imageUrls.upper_body_side || null,
        image_full_body_side: imageUrls.full_body_side || null,
      })
      .select()
      .single();

    if (scanError) {
      console.error('Failed to insert scan record:', scanError.message);
      return { error: scanError.message };
    }

    // ── 3. INSERT internal metrics (hidden from clients) ─────────
    const s1 = captureData.stage1?.metrics || {};
    const s2 = captureData.stage2?.metrics || {};
    const s3 = captureData.stage3?.metrics || {};
    const s4 = captureData.stage4?.metrics || {};

    const { error: metricsError } = await supabase
      .from('scan_metrics')
      .insert({
        scan_id: scanId,
        eye_symmetry: s1.eyeSym ?? null,
        jaw_shift: s1.jawShift ?? null,
        head_tilt: s1.headTilt ?? null,
        nostril_asymmetry: s1.nostrilAsym ?? null,
        shoulder_height: s2.shoulderHeight ?? null,
        fhp_angle: s3.fhpAngle ?? null,
        pelvic_tilt: s4.pelvicTilt ?? null,
        knee_angle: s4.kneeAngle ?? null,
        foot_arch_ratio: s4.footArchRatio ?? null,
        face_score: scores?.face ?? null,
        body_score: scores?.body ?? null,
        questionnaire_score: scores?.questionnaire ?? null,
        overall_score: scores?.total ?? null,
      });

    if (metricsError) {
      console.warn('Failed to insert scan metrics:', metricsError.message);
      // Non-fatal — scan record is already saved
    }

    console.log('✅ Scan saved to Supabase:', scanId);
    return { scanId, pdfUrl: null };

  } catch (err) {
    console.error('saveScan unexpected error:', err);
    return { error: err.message };
  }
};

/**
 * updateScanPdfUrl — called after the PDF blob is uploaded to storage.
 * Patches the pdf_url column on the existing scan row.
 */
export const updateScanPdfUrl = async (scanId, pdfUrl) => {
  const { error } = await supabase
    .from('scans')
    .update({ pdf_url: pdfUrl })
    .eq('id', scanId);

  if (error) console.warn('Failed to update pdf_url:', error.message);
};
