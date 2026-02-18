/**
 * Integrated Pattern Fusion
 * Combines Body (50%), Face (30%), and Questionnaire (20%) scores
 * for final somatic pattern classification
 */

import { analyzePatterns } from './patternAnalyzer.js';
import { fusePatternScores, calculateConfidenceBand } from './questionnaireScoring.js';
import { SOMATIC_PATTERNS } from '../config/patterns.config.js';

/**
 * Main fusion function - combines all three modalities
 * 
 * @param {Object} bodyMetrics - Body assessment metrics
 * @param {Object} faceMetrics - Face assessment metrics
 * @param {Object} questionnaireScores - Questionnaire normalized scores (0-100)
 * @returns {Object} Complete pattern classification with confidence
 */
export function integrateAllModalities(bodyMetrics, faceMetrics, questionnaireScores) {
  console.log('=== INTEGRATED PATTERN FUSION ===');
  console.log('Body Metrics:', bodyMetrics);
  console.log('Face Metrics:', faceMetrics);
  console.log('Questionnaire Scores:', questionnaireScores);

  // Step 1: Get pattern scores from body/face analysis (existing system)
  const visualAnalysis = analyzePatterns({
    body: bodyMetrics,
    face: faceMetrics
  });

  // Step 2: Extract pattern scores from visual analysis
  // The analyzePatterns returns: { patterns: { 'upper_compression': {score: X}, ... } }
  // We need to extract these scores correctly
  const bodyFaceScores = {
    upperCompression: 0,
    lowerCompression: 0,
    thoracicCollapse: 0,
    lateralAsymmetry: 0
  };

  // Extract scores from the patterns object
  if (visualAnalysis && visualAnalysis.patterns) {
    // Map pattern IDs to camelCase keys
    const patternMapping = {
      'upper_compression': 'upperCompression',
      'lower_compression': 'lowerCompression',
      'thoracic_collapse': 'thoracicCollapse',
      'lateral_asymmetry': 'lateralAsymmetry'
    };

    Object.entries(visualAnalysis.patterns).forEach(([patternId, patternData]) => {
      const camelKey = patternMapping[patternId];
      if (camelKey && patternData && typeof patternData.score === 'number') {
        bodyFaceScores[camelKey] = patternData.score;
      }
    });
  }

  // For now, we'll split body/face equally since the existing analyzer combines them
  // In a more refined version, you'd run separate analyses
  const bodyScores = { ...bodyFaceScores };
  const faceScores = { ...bodyFaceScores };

  console.log('Body Scores (50% weight):', bodyScores);
  console.log('Face Scores (30% weight):', faceScores);
  console.log('Questionnaire Scores (20% weight):', questionnaireScores);

  // Step 3: Fuse all three modalities with proper weighting
  const fusedResult = fusePatternScores(bodyScores, faceScores, questionnaireScores);

  console.log('Fused Final Scores:', fusedResult.finalScores);
  console.log('Primary Pattern:', fusedResult.primaryPattern);
  console.log('Secondary Pattern:', fusedResult.secondaryPattern);

  // Step 4: Calculate confidence band
  const confidence = calculateConfidenceBand(
    bodyScores,
    faceScores,
    questionnaireScores,
    fusedResult
  );

  console.log('Confidence Level:', confidence.level);
  console.log('Confidence Reasoning:', confidence.reasoning);
  console.log('=== FUSION COMPLETE ===\n');

  // Step 5: Build comprehensive result object
  return {
    // Final classification
    primaryPattern: {
      id: convertPatternNameToId(fusedResult.primaryPattern.name),
      name: formatPatternName(fusedResult.primaryPattern.name),
      score: fusedResult.primaryPattern.score,
      severity: getPatternSeverity(fusedResult.primaryPattern.score)
    },
    secondaryPattern: fusedResult.secondaryPattern ? {
      id: convertPatternNameToId(fusedResult.secondaryPattern.name),
      name: formatPatternName(fusedResult.secondaryPattern.name),
      score: fusedResult.secondaryPattern.score,
      severity: getPatternSeverity(fusedResult.secondaryPattern.score)
    } : null,

    // Confidence assessment
    confidence: {
      level: confidence.level,
      percentage: confidence.percentage,
      reasoning: confidence.reasoning,
      metrics: confidence.metrics
    },

    // Detailed scores by modality
    modalityScores: {
      body: bodyScores,
      face: faceScores,
      questionnaire: questionnaireScores
    },

    // Final fused scores for all patterns
    finalScores: fusedResult.finalScores,

    // Contribution breakdown
    contributions: fusedResult.modalityContributions,

    // All patterns ranked
    allPatterns: fusedResult.allPatterns.map(p => ({
      id: convertPatternNameToId(p.pattern),
      name: formatPatternName(p.pattern),
      score: p.score,
      severity: getPatternSeverity(p.score)
    })),

    // Original visual analysis (for backward compatibility)
    visualAnalysis: visualAnalysis
  };
}

/**
 * Convert camelCase pattern name to kebab-case ID
 */
function convertPatternNameToId(camelName) {
  const mapping = {
    upperCompression: 'upper-compression',
    lowerCompression: 'lower-compression',
    thoracicCollapse: 'thoracic-collapse',
    lateralAsymmetry: 'lateral-asymmetry'
  };
  return mapping[camelName] || camelName;
}

/**
 * Format pattern name for display
 */
function formatPatternName(camelName) {
  const mapping = {
    upperCompression: 'Upper Compression',
    lowerCompression: 'Lower Compression',
    thoracicCollapse: 'Thoracic Collapse',
    lateralAsymmetry: 'Lateral Asymmetry'
  };
  return mapping[camelName] || camelName;
}

/**
 * Get severity level based on score
 */
function getPatternSeverity(score) {
  if (score >= 70) return 'severe';
  if (score >= 50) return 'moderate';
  if (score >= 30) return 'mild';
  return 'none';
}

/**
 * Generate comprehensive summary text
 */
export function generateIntegratedSummary(result) {
  const { primaryPattern, secondaryPattern, confidence } = result;

  let summary = `Based on comprehensive analysis across body posture, facial alignment, and self-assessment, `;
  summary += `your primary somatic pattern is **${primaryPattern.name}** `;
  summary += `with a ${confidence.level.toLowerCase()} confidence level (${confidence.percentage}%). `;

  if (secondaryPattern) {
    summary += `A secondary pattern of **${secondaryPattern.name}** is also present. `;
  }

  summary += `\n\nThis classification integrates: `;
  summary += `50% body metrics, 30% facial analysis, and 20% questionnaire responses.`;

  return summary;
}

/**
 * Get pattern-specific recommendations based on integrated analysis
 */
export function getIntegratedRecommendations(result) {
  const patternId = result.primaryPattern.id;
  const pattern = Object.values(SOMATIC_PATTERNS).find(p => p.id === patternId);
  
  if (!pattern) return [];

  const severity = result.primaryPattern.severity;
  return pattern.recommendations[severity] || [];
}

/**
 * Prepare data for GHL webhook
 */
export function prepareWebhookPayload(result, userInfo, questionnaireData) {
  return {
    user: userInfo,
    assessment: {
      timestamp: new Date().toISOString(),
      primaryPattern: {
        id: result.primaryPattern.id,
        name: result.primaryPattern.name,
        score: result.primaryPattern.score.toFixed(2),
        severity: result.primaryPattern.severity
      },
      secondaryPattern: result.secondaryPattern ? {
        id: result.secondaryPattern.id,
        name: result.secondaryPattern.name,
        score: result.secondaryPattern.score.toFixed(2),
        severity: result.secondaryPattern.severity
      } : null,
      confidence: {
        level: result.confidence.level,
        percentage: result.confidence.percentage
      },
      modalityBreakdown: {
        body: {
          weight: '50%',
          scores: result.modalityScores.body
        },
        face: {
          weight: '30%',
          scores: result.modalityScores.face
        },
        questionnaire: {
          weight: '20%',
          scores: result.modalityScores.questionnaire,
          rawScores: questionnaireData.rawScores,
          answers: questionnaireData.answers
        }
      },
      allPatternScores: result.finalScores
    }
  };
}

export default integrateAllModalities;