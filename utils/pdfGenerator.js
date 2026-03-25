import { jsPDF } from 'jspdf';
import { QUESTIONNAIRE_DATA } from '../config/questionnaireData.js';
import { PATTERN_DESCRIPTIONS, SHARED_CONTENT } from '../config/patternDescriptions.js';

// Image paths for each pattern (in public/ folder)
const PATTERN_IMAGES = {
  upper_compression: {
    image1: '/IMAGES/PDF/upper compression not ok.PNG',
    image2: '/IMAGES/PDF/upper compression ok.PNG',
  },
  lower_compression: {
    image1: '/IMAGES/PDF/2nd pfd image 1.png',
    image2: '/IMAGES/PDF/2nd pdf image 2.png',
  },
  lateral_asymmetry: {
    image1: '/IMAGES/PDF/3rd pdf image 1.PNG',
    image2: '/IMAGES/PDF/3rd pdf image 2.PNG',
  },
  thoracic_collapse: {
    image1: '/IMAGES/PDF/4th pdf image 1.png',
    image2: '/IMAGES/PDF/4th pdf image 2.png',
  },
};

// Helper: load an image via browser Image API → Canvas → base64
// This handles URL encoding, spaces in filenames, and CORS automatically
const loadImageAsBase64 = ( url ) => {
  return new Promise( ( resolve ) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement( 'canvas' );
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext( '2d' );
        ctx.drawImage( img, 0, 0 );
        resolve( canvas.toDataURL( 'image/png' ) );
      } catch ( e ) {
        console.warn( 'Canvas conversion failed:', url, e );
        resolve( null );
      }
    };
    img.onerror = ( e ) => {
      console.warn( 'Failed to load image:', url, e );
      resolve( null );
    };
    img.src = encodeURI( url );
  } );
};

// Helper: normalize pattern IDs from kebab-case to snake_case
// The fusion engine produces 'lateral-asymmetry' but our configs use 'lateral_asymmetry'
const normalizePatternId = ( id ) => {
  if ( !id ) return 'upper_compression';
  return id.replace( /-/g, '_' );
};

export const generatePDF = async ( captureData, questionnaireData, patternResults, scores ) => {
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = W - margin * 2;
  let y = 0;

  // ── Helpers ─────────────────────────────────────────────────
  const wrap = ( text, x, yy, maxW, fs = 10 ) => {
    doc.setFontSize( fs );
    const lines = doc.splitTextToSize( text, maxW );
    doc.text( lines, x, yy );
    return yy + lines.length * fs * 0.5;
  };

  const checkPage = ( needed = 30 ) => {
    if ( y > H - needed ) { doc.addPage(); y = 25; }
  };

  const heading = ( text, fs = 16 ) => {
    checkPage( 20 );
    doc.setFontSize( fs );
    doc.setFont( undefined, 'bold' );
    doc.text( text, margin, y );
    y += fs * 0.6;
  };

  const body = ( text, fs = 10 ) => {
    checkPage( 15 );
    doc.setFontSize( fs );
    doc.setFont( undefined, 'normal' );
    y = wrap( text, margin, y, contentW, fs );
    y += 4;
  };

  const bullet = ( text, indent = 28, fs = 10 ) => {
    checkPage( 10 );
    doc.setFontSize( fs );
    doc.setFont( undefined, 'normal' );
    y = wrap( `• ${ text }`, indent, y, W - indent - margin, fs );
    y += 2;
  };

  const separator = () => {
    y += 3;
    doc.setLineWidth( 0.4 );
    doc.setDrawColor( 180 ); doc.line( margin, y, W - margin, y ); doc.setDrawColor( 0 );
    y += 6;
  };

  const currentDate = new Date().toLocaleDateString( 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  } );

  // Get pattern description — normalize ID from kebab-case to snake_case
  const patternId = normalizePatternId( patternResults?.primaryPattern?.id );
  const desc = PATTERN_DESCRIPTIONS[ patternId ] || PATTERN_DESCRIPTIONS.upper_compression;

  // ═══════════════════════════════════════════════════════════
  // PAGE 1 — YOUR PATTERN EXPLAINED
  // ═══════════════════════════════════════════════════════════
  y = 20;

  // Header
  doc.setFontSize( 22 );
  doc.setFont( undefined, 'bold' );
  doc.text( 'BODI KEMISTRI™', W / 2, y, { align: 'center' } );
  y += 8;
  doc.setFontSize( 12 );
  doc.setFont( undefined, 'normal' );
  doc.text( 'BODY SCAN REPORT', W / 2, y, { align: 'center' } );
  y += 6;
  doc.setFontSize( 9 );
  doc.text( `Date: ${ currentDate }`, W / 2, y, { align: 'center' } );
  y += 10;

  separator();

  // Section: YOUR PATTERN EXPLAINED
  doc.setFontSize( 11 );
  doc.setFont( undefined, 'bold' );
  doc.setTextColor( 100 );
  doc.text( 'YOUR PATTERN EXPLAINED', margin, y );
  doc.setTextColor( 0 );
  y += 10;

  // Pattern name
  doc.setFontSize( 20 );
  doc.setFont( undefined, 'bold' );
  doc.text( `Your Primary Pattern:`, margin, y );
  y += 9;
  doc.setFontSize( 22 );
  doc.text( desc.plainName, margin, y );
  y += 10;

  y += 4;

  separator();

  // In Plain English
  heading( 'In Plain English', 13 );
  y += 2;
  body( desc.summary, 11 );
  y += 4;

  // This often feels like
  heading( 'This often feels like:', 12 );
  y += 2;
  desc.feelsLike.forEach( item => bullet( item, 28, 10 ) );
  y += 4;

  // What Your Body Is Trying To Do
  heading( 'What Your Body Is Trying To Do', 13 );
  y += 2;
  desc.whatBodyIsDoing.forEach( paragraph => {
    body( paragraph, 10 );
  } );
  y += 2;

  // When pressure stays high (if applicable)
  if ( desc.whenPressureStaysHigh ) {
    checkPage( 30 );
    doc.setFontSize( 10 );
    doc.setFont( undefined, 'bold' );
    doc.text( 'When pressure stays high:', margin, y );
    y += 6;
    doc.setFont( undefined, 'normal' );
    desc.whenPressureStaysHigh.forEach( item => bullet( item, 28, 10 ) );
    y += 4;
  }

  // Goal statement
  checkPage( 20 );
  doc.setFontSize( 11 );
  doc.setFont( undefined, 'bold' );
  y = wrap( desc.goalStatement, margin, y, contentW, 11 );
  y += 6;

  // ── Visual Diagrams ─────────────────────────────────────────
  if ( desc.diagramLabels ) {
    // Force new page for images — never let them get cut off
    doc.addPage();
    y = 20;
    heading( 'Visual Reference', 14 );
    y += 4;

    const boxW = contentW / 2 - 6;
    const boxH = 80;
    const x1 = margin;
    const x2 = margin + contentW / 2 + 6;
    const imgPaths = PATTERN_IMAGES[ patternId ];

    // Try to load real images for this pattern
    let img1Data = null;
    let img2Data = null;
    if ( imgPaths ) {
      [ img1Data, img2Data ] = await Promise.all( [
        loadImageAsBase64( imgPaths.image1 ),
        loadImageAsBase64( imgPaths.image2 ),
      ] );
    }

    if ( img1Data && img2Data ) {
      // ── Real client-provided images ──────────────────────
      // Image 1: Problem
      const imgH1 = boxH - 12;
      const imgW1 = imgH1 * 0.75; // ~3:4 aspect
      const imgX1 = x1 + ( boxW - imgW1 ) / 2;
      try {
        doc.addImage( img1Data, 'PNG', imgX1, y, imgW1, imgH1 );
      } catch ( e ) {
        console.warn( 'Failed to embed image 1', e );
      }

      // Label 1
      doc.setFontSize( 7 );
      doc.setFont( undefined, 'bold' );
      doc.setTextColor( 180, 60, 40 );
      const lbl1 = doc.splitTextToSize( desc.diagramLabels.image1, boxW - 4 );
      doc.text( lbl1, x1 + boxW / 2, y + boxH - 4, { align: 'center' } );

      // Image 2: Balanced
      const imgH2 = boxH - 12;
      const imgW2 = imgH2 * 0.75;
      const imgX2 = x2 + ( boxW - imgW2 ) / 2;
      try {
        doc.addImage( img2Data, 'PNG', imgX2, y, imgW2, imgH2 );
      } catch ( e ) {
        console.warn( 'Failed to embed image 2', e );
      }

      // Label 2
      doc.setTextColor( 40, 120, 60 );
      const lbl2 = doc.splitTextToSize( desc.diagramLabels.image2, boxW - 4 );
      doc.text( lbl2, x2 + boxW / 2, y + boxH - 4, { align: 'center' } );

    } else {
      // ── Fallback: programmatic diagrams ────────────────────
      const fallbackBoxH = 55;

      // Helper: draw a simple body silhouette
      const drawBody = ( cx, topY, h ) => {
        const headR = h * 0.08;
        const neckY = topY + headR * 2 + 1;
        const shoulderW = h * 0.22;
        const torsoH = h * 0.35;
        const hipW = h * 0.18;
        const legH = h * 0.3;
        doc.setDrawColor( 160 );
        doc.setLineWidth( 0.4 );
        doc.circle( cx, topY + headR, headR );
        doc.line( cx, topY + headR * 2, cx, neckY + 2 );
        doc.line( cx - shoulderW, neckY + 2, cx + shoulderW, neckY + 2 );
        doc.line( cx - shoulderW, neckY + 2, cx - hipW, neckY + 2 + torsoH );
        doc.line( cx + shoulderW, neckY + 2, cx + hipW, neckY + 2 + torsoH );
        doc.line( cx - hipW, neckY + 2 + torsoH, cx + hipW, neckY + 2 + torsoH );
        doc.line( cx - hipW, neckY + 2 + torsoH, cx - hipW * 0.8, neckY + 2 + torsoH + legH );
        doc.line( cx + hipW, neckY + 2 + torsoH, cx + hipW * 0.8, neckY + 2 + torsoH + legH );
        doc.setDrawColor( 210 ); doc.setLineWidth( 0.2 );
        doc.line( cx, neckY + 2, cx, neckY + 2 + torsoH );
        doc.setDrawColor( 160 );
      };
      const drawArrow = ( fx, fy, tx, ty, r, g, b ) => {
        doc.setDrawColor( r, g, b ); doc.setLineWidth( 0.6 );
        doc.line( fx, fy, tx, ty );
        const angle = Math.atan2( ty - fy, tx - fx ); const aLen = 2;
        doc.line( tx, ty, tx - aLen * Math.cos( angle - 0.5 ), ty - aLen * Math.sin( angle - 0.5 ) );
        doc.line( tx, ty, tx - aLen * Math.cos( angle + 0.5 ), ty - aLen * Math.sin( angle + 0.5 ) );
        doc.setDrawColor( 0 );
      };
      const drawZone = ( cx, cy, rw, rh, r, g, b ) => {
        doc.setFillColor( r, g, b );
        doc.ellipse( cx, cy, rw, rh, 'F' );
      };

      // Diagram 1: Pattern
      doc.setDrawColor( 180 ); doc.setFillColor( 252, 250, 248 );
      doc.roundedRect( x1, y, boxW, fallbackBoxH, 2, 2, 'FD' );
      const bodyTopY = y + 5;
      const bodyCx1 = x1 + boxW / 2;
      const bodyH = fallbackBoxH - 18;
      drawBody( bodyCx1, bodyTopY, bodyH );

      if ( patternId === 'lower_compression' ) {
        drawZone( bodyCx1, bodyTopY + bodyH * 0.52, 9, 5, 220, 80, 60 );
        drawArrow( bodyCx1, bodyTopY + bodyH * 0.35, bodyCx1, bodyTopY + bodyH * 0.5, 200, 60, 40 );
      } else if ( patternId === 'lateral_asymmetry' ) {
        drawZone( bodyCx1 - 6, bodyTopY + bodyH * 0.35, 7, 10, 220, 80, 60 );
        drawArrow( bodyCx1 + 6, bodyTopY + bodyH * 0.2, bodyCx1 - 4, bodyTopY + bodyH * 0.3, 200, 60, 40 );
      } else if ( patternId === 'thoracic_collapse' ) {
        drawZone( bodyCx1, bodyTopY + bodyH * 0.3, 5, 6, 150, 150, 170 );
        drawArrow( bodyCx1 - 8, bodyTopY + bodyH * 0.25, bodyCx1 - 4, bodyTopY + bodyH * 0.32, 150, 130, 150 );
      }

      doc.setFontSize( 7 ); doc.setFont( undefined, 'bold' ); doc.setTextColor( 180, 60, 40 );
      const lbl1f = doc.splitTextToSize( desc.diagramLabels.image1, boxW - 8 );
      doc.text( lbl1f, x1 + boxW / 2, y + fallbackBoxH - 4, { align: 'center' } );

      // Diagram 2: Balanced
      doc.setDrawColor( 180 ); doc.setFillColor( 248, 252, 248 );
      doc.roundedRect( x2, y, boxW, fallbackBoxH, 2, 2, 'FD' );
      const bodyCx2 = x2 + boxW / 2;
      drawBody( bodyCx2, bodyTopY, bodyH );
      drawZone( bodyCx2, bodyTopY + bodyH * 0.28, 7, 5, 80, 160, 100 );
      drawZone( bodyCx2, bodyTopY + bodyH * 0.52, 7, 5, 80, 160, 100 );
      drawArrow( bodyCx2, bodyTopY + bodyH * 0.3, bodyCx2 - 10, bodyTopY + bodyH * 0.25, 60, 140, 80 );
      drawArrow( bodyCx2, bodyTopY + bodyH * 0.3, bodyCx2 + 10, bodyTopY + bodyH * 0.25, 60, 140, 80 );
      drawArrow( bodyCx2, bodyTopY + bodyH * 0.6, bodyCx2, bodyTopY + bodyH * 0.75, 60, 140, 80 );

      doc.setTextColor( 40, 120, 60 );
      const lbl2f = doc.splitTextToSize( desc.diagramLabels.image2, boxW - 8 );
      doc.text( lbl2f, x2 + boxW / 2, y + fallbackBoxH - 4, { align: 'center' } );
    }

    doc.setTextColor( 0 );
    doc.setDrawColor( 0 );
    doc.setLineWidth( 0.4 );

    y += boxH + 6;
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 2 — YOUR 3-WEEK STARTING PLAN
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 20;

  doc.setFontSize( 11 );
  doc.setFont( undefined, 'bold' );
  doc.setTextColor( 100 );
  doc.text( 'YOUR 3-WEEK STARTING PLAN', margin, y );
  doc.setTextColor( 0 );
  y += 12;

  [ 'week1', 'week2', 'week3' ].forEach( ( wk, i ) => {
    const week = desc.weeklyPlan[ wk ];
    checkPage( 50 );

  // Week header
    doc.setFontSize( 14 );
    doc.setFont( undefined, 'bold' );
    doc.text( `Week ${ i + 1 } — ${ week.title }`, margin, y );
    y += 8;

    // Exercise name
    doc.setFontSize( 11 );
    doc.setFont( undefined, 'bold' );
    doc.text( `Exercise: ${ week.exercise }`, margin + 4, y );
    y += 7;

    // Steps
    doc.setFont( undefined, 'normal' );
    doc.setFontSize( 10 );
    week.steps.forEach( step => {
      bullet( step, 30, 10 );
    } );
    y += 3;

    // Video link
    if ( week.videoUrl ) {
      doc.setFontSize( 9 );
      doc.setFont( undefined, 'bold' );
      doc.text( 'Video Reference:', margin + 4, y );
      y += 5;
      doc.setFont( undefined, 'normal' );
      doc.setTextColor( 40, 80, 160 );
      doc.textWithLink( week.videoUrl, margin + 4, y, { url: week.videoUrl } );
      doc.setTextColor( 0 );
      y += 7;
    }

    // Goal (if present)
    if ( week.goal ) {
      doc.setFontSize( 10 );
      doc.setFont( undefined, 'italic' );
      doc.setTextColor( 80 );
      y = wrap( `Goal: ${ week.goal }`, margin + 4, y, contentW - 8, 10 );
      doc.setTextColor( 0 );
      doc.setFont( undefined, 'normal' );
      y += 4;
    }

    // Spacing between weeks
    y += 6;
    if ( i < 2 ) {
      doc.setDrawColor( 220 );
      doc.setLineWidth( 0.3 );
      doc.line( margin + 4, y, W - margin - 4, y );
      doc.setDrawColor( 0 );
      y += 8;
    }
  } );

  // Expected Shift
  if ( desc.expectedShift ) {
    y += 4;
    checkPage( 20 );
    doc.setFontSize( 11 );
    doc.setFont( undefined, 'bold' );
    doc.text( 'Expected Shift:', margin, y );
    y += 6;
    doc.setFontSize( 10 );
    doc.setFont( undefined, 'italic' );
    doc.text( desc.expectedShift, margin + 4, y );
    y += 10;
  }

  // Important Reminder
  separator();
  checkPage( 40 );
  heading( 'Important Reminder', 12 );
  y += 2;
  body( SHARED_CONTENT.importantReminder, 10 );
  y += 6;

  // If You Want Guidance
  heading( 'If You Want Guidance', 12 );
  y += 2;
  body( SHARED_CONTENT.guidanceCTA.intro, 10 );
  SHARED_CONTENT.guidanceCTA.bullets.forEach( item => bullet( item, 28, 10 ) );
  y += 4;
  doc.setFontSize( 11 );
  doc.setFont( undefined, 'bold' );
  doc.text( SHARED_CONTENT.guidanceCTA.closing, margin, y );
  y += 10;

  // ═══════════════════════════════════════════════════════════
  // PAGE 3 — DETAILED METRICS + CAPTURE EVIDENCE (APPENDIX)
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 20;

  doc.setFontSize( 11 );
  doc.setFont(undefined, 'bold');
  doc.setTextColor( 100 );
  doc.text( 'APPENDIX — DETAILED METRICS & CAPTURE EVIDENCE', margin, y );
  doc.setTextColor( 0 );
  y += 12;

  // Pattern Classification
  if ( patternResults && patternResults.primaryPattern ) {
    heading( 'Pattern Classification', 14 );
    y += 2;
    doc.setFontSize( 11 );
    doc.setFont( undefined, 'normal' );
    // Use plain name from PATTERN_DESCRIPTIONS, not the internal fusion name
    const primaryPlainName = desc.plainName || patternResults.primaryPattern.name;
    doc.text( `Primary: ${ primaryPlainName } — Severity: ${ patternResults.primaryPattern.severity.toUpperCase() }`, margin + 4, y );
    y += 7;

    if ( patternResults.secondaryPattern ) {
      const secId = normalizePatternId( patternResults.secondaryPattern.id );
      const secDesc = PATTERN_DESCRIPTIONS[ secId ];
      const secondaryPlainName = secDesc ? secDesc.plainName : patternResults.secondaryPattern.name;
      doc.text( `Secondary: ${ secondaryPlainName }`, margin + 4, y );
      y += 7;
    }
    y += 6;
  }

  separator();

  // Face Metrics — names only, no values (client request)
  heading( 'Face Metrics', 14 );
  y += 2;
  doc.setFontSize( 10 );
  doc.setFont( undefined, 'normal' );
  doc.text( 'Eye Symmetry', margin + 4, y ); y += 6;
  doc.text( 'Jaw Line', margin + 4, y ); y += 6;
  doc.text( 'Head Tilt', margin + 4, y ); y += 6;
  doc.text( 'Nostril Asymmetry', margin + 4, y ); y += 10;

  // Body Metrics — names only, no values (client request)
  heading( 'Body Metrics', 14 );
  y += 2;
  doc.setFontSize( 10 );
  doc.setFont( undefined, 'normal' );
  doc.text( 'Shoulder Asymmetry', margin + 4, y ); y += 6;
  doc.text( 'Forward Head Posture', margin + 4, y ); y += 6;
  doc.text( 'Pelvic Tilt', margin + 4, y ); y += 6;
  doc.text( 'Knee Angle', margin + 4, y ); y += 6;
  doc.text( 'Foot Arch', margin + 4, y ); y += 10;

  separator();

  // ── Capture Evidence — force new page so all 4 images are never cut off ──
  doc.addPage();
  y = 20;
  heading( 'Capture Evidence', 14 );
  y += 4;

  const gridMargin = 15;
  const gridGap = 5;
  const colWidth = ( W - gridMargin * 2 - gridGap ) / 2;

  // Calculate image height so both rows + labels fit within one page
  // Available vertical space: page height minus top (y) minus bottom margin minus label rows
  const labelH = 14; // px reserved below each image for caption + metrics
  const availableH = H - y - 15; // 15 = bottom margin
  const imgH = ( availableH - labelH * 2 - gridGap ) / 2; // 2 rows, account for 2 label blocks + gap
  const imgW = colWidth;

  // Updated captions and metric labels — names only, no values
  const gridStages = [
    { image: captureData.stage1?.image, label: '1  Face (Front)', metrics: 'Eye Symmetry  •  Jaw Line  •  Head Tilt' },
    { image: captureData.stage2?.image, label: '2  Body (Front)', metrics: 'Shoulder Asymmetry' },
    { image: captureData.stage3?.image, label: '3  Upper Body (Side)', metrics: 'Forward Head Posture' },
    { image: captureData.stage4?.image, label: '4  Full Body (Side)', metrics: 'Pelvic Tilt  •  Foot Arch' },
  ];

  const gridStartY = y;
  gridStages.forEach( ( stage, i ) => {
    const col = i % 2;
    const row = Math.floor( i / 2 );
    const x = gridMargin + col * ( colWidth + gridGap );
    const gy = gridStartY + row * ( imgH + labelH );

    if ( stage.image ) {
      try {
        doc.addImage( stage.image, 'JPEG', x, gy, imgW, imgH );
      } catch ( err ) {
        doc.setFillColor( 220, 220, 220 );
        doc.rect( x, gy, imgW, imgH, 'F' );
        doc.setFontSize( 10 );
        doc.setFont( undefined, 'normal' );
        doc.text( 'Image Error', x + imgW / 2, gy + imgH / 2, { align: 'center' } );
      }
    } else {
      doc.setFillColor( 220, 220, 220 );
      doc.rect( x, gy, imgW, imgH, 'F' );
      doc.setFontSize( 10 );
      doc.setFont( undefined, 'normal' );
      doc.text( 'No Capture', x + imgW / 2, gy + imgH / 2, { align: 'center' } );
    }

    // Caption (bold, slightly larger)
    doc.setFontSize( 8 );
    doc.setFont( undefined, 'bold' );
    doc.setTextColor( 40 );
    doc.text( stage.label, x, gy + imgH + 5 );

    // Metric names (normal, sage-ish colour)
    doc.setFontSize( 7 );
    doc.setFont( undefined, 'normal' );
    doc.setTextColor( 60, 100, 80 );
    doc.text( stage.metrics, x, gy + imgH + 10 );
    doc.setTextColor( 0 );
  } );

  // ═══════════════════════════════════════════════════════════
  // PAGE 5+ — QUESTIONNAIRE RESPONSES
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 20;

  heading( 'Questionnaire Responses', 16 );
  y += 4;

  if ( questionnaireData && questionnaireData.answers && QUESTIONNAIRE_DATA ) {
    doc.setFontSize( 9 );
    doc.setFont( undefined, 'normal' );

    questionnaireData.answers.forEach( ( answer, index ) => {
      if ( !answer ) return;
      const questionObj = QUESTIONNAIRE_DATA[ index ];
      if ( !questionObj ) return;

      const qNum = index + 1;
      const selectedOption = questionObj.options.find( opt => opt.label === answer );

      checkPage( 20 );

      doc.setFont( undefined, 'bold' );
      const questionLines = doc.splitTextToSize( `Q${ qNum }: ${ questionObj.question }`, contentW );
      doc.text( questionLines, margin, y );
      y += questionLines.length * 4;

      doc.setFont( undefined, 'normal' );
      if ( selectedOption ) {
        const answerLines = doc.splitTextToSize( `Answer: ${ answer } - ${ selectedOption.text }`, contentW );
        doc.text( answerLines, margin + 10, y );
        y += answerLines.length * 4 + 3;
      } else {
        doc.text( `Answer: ${ answer }`, margin + 10, y );
        y += 7;
      }
    } );

    // Questionnaire pattern scores
    if ( questionnaireData.normalizedScores ) {
      y += 8;
      checkPage( 40 );
      heading( 'Questionnaire Pattern Scores', 13 );
      y += 2;
      doc.setFontSize( 10 );
      doc.setFont( undefined, 'normal' );
      doc.text( `Forward Compression: ${ questionnaireData.normalizedScores.upperCompression.toFixed( 1 ) }%`, margin + 4, y ); y += 6;
      doc.text( `Back Bracing: ${ questionnaireData.normalizedScores.lowerCompression.toFixed( 1 ) }%`, margin + 4, y ); y += 6;
      doc.text( `Collapse: ${ questionnaireData.normalizedScores.thoracicCollapse.toFixed( 1 ) }%`, margin + 4, y ); y += 6;
      doc.text( `Lateral Shift: ${ questionnaireData.normalizedScores.lateralAsymmetry.toFixed( 1 ) }%`, margin + 4, y ); y += 8;
    }
  }

  // Footer on last page
  y = H - 15;
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.setTextColor( 120 );
  doc.text( 'This report is for informational purposes only and does not constitute medical advice.', W / 2, y, { align: 'center' } );
  y += 4;
  doc.text( 'Consult with a healthcare professional for personalized medical guidance.', W / 2, y, { align: 'center' } );
  doc.setTextColor( 0 );

  // Save PDF
  doc.save(`Bodi-Kemistri-Report-${currentDate.replace(/\s/g, '-')}.pdf`);
};