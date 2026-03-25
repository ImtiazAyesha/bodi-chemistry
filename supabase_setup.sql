-- ============================================================
-- Bodi Kemistri — Supabase Database Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Table 1: scans (visible/reportable data) ─────────────────
CREATE TABLE IF NOT EXISTS scans (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                TIMESTAMPTZ DEFAULT now(),
  contact_email             TEXT,
  scan_date                 TIMESTAMPTZ DEFAULT now(),

  -- Pattern results
  primary_pattern           TEXT,
  primary_pattern_severity  TEXT,
  secondary_pattern         TEXT,

  -- Questionnaire pattern scores (%)
  forward_compression_score NUMERIC,
  back_bracing_score        NUMERIC,
  collapse_score            NUMERIC,
  lateral_shift_score       NUMERIC,

  -- Storage links
  pdf_url                   TEXT,
  image_face_front          TEXT,
  image_body_front          TEXT,
  image_upper_body_side     TEXT,
  image_full_body_side      TEXT
);

-- ── Table 2: scan_metrics (internal — never shown to clients) ─
CREATE TABLE IF NOT EXISTS scan_metrics (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id           UUID REFERENCES scans(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ DEFAULT now(),

  -- Face metrics
  eye_symmetry      NUMERIC,
  jaw_shift         NUMERIC,
  head_tilt         NUMERIC,
  nostril_asymmetry NUMERIC,

  -- Body metrics
  shoulder_height   NUMERIC,
  fhp_angle         NUMERIC,
  pelvic_tilt       NUMERIC,
  knee_angle        NUMERIC,
  foot_arch_ratio   NUMERIC,

  -- Composite scores
  face_score        NUMERIC,
  body_score        NUMERIC,
  questionnaire_score NUMERIC,
  overall_score     NUMERIC
);

-- ── Storage Buckets ───────────────────────────────────────────
-- Run these separately in the Supabase Storage UI, or via API:
-- Bucket 1: "scan-images"   (Public: true)
-- Bucket 2: "scan-pdfs"     (Public: true)

-- ── Row Level Security (RLS) — allow inserts from frontend ────
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_metrics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (frontend uses anon key)
CREATE POLICY "Allow anon insert on scans"
  ON scans FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon insert on scan_metrics"
  ON scan_metrics FOR INSERT TO anon WITH CHECK (true);

-- Allow service role full access (for admin/dashboard use)
CREATE POLICY "Allow service role full access on scans"
  ON scans FOR ALL TO service_role USING (true);

CREATE POLICY "Allow service role full access on scan_metrics"
  ON scan_metrics FOR ALL TO service_role USING (true);
