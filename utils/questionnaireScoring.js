import { QUESTIONNAIRE_DATA, PATTERN_KEYS } from '../config/questionnaireData.js';

/**
 * Calculate questionnaire scores for somatic pattern classification
 * 
 * @param {Array<string>} answers - Array of 20 answers (e.g., ['A', 'B', 'C', ...])
 * @returns {Object} Contains rawScores, normalizedScores, and metadata
 */
export function calculateQuestionnaireScores(answers) {
  // Validate input
  if (!answers || answers.length !== 20) {
    throw new Error('Questionnaire requires exactly 20 answers');
  }

  // Step 1: Calculate Raw Scores
  const rawScores = {
    upperCompression: 0,
    lowerCompression: 0,
    thoracicCollapse: 0,
    lateralAsymmetry: 0
  };

  // Iterate through each answer and accumulate points
  answers.forEach((answer, index) => {
    if (!answer) return; // Skip unanswered questions

    const question = QUESTIONNAIRE_DATA[index];
    const selectedOption = question.options.find(opt => opt.label === answer);

    if (!selectedOption) {
      console.warn(`Invalid answer "${answer}" for question ${index + 1}`);
      return;
    }

    // Add points from this answer to each pattern
    const scoring = selectedOption.scoring;
    PATTERN_KEYS.forEach(pattern => {
      if (scoring[pattern] !== undefined) {
        rawScores[pattern] += scoring[pattern];
      }
    });
  });

  // Step 2: Normalize to 0-100 Scale
  // Formula: ((rawScore + 10) / 60) × 100
  // +10 offset accounts for negative values (min ~-10)
  // /60 normalizes range (max ~50-60 points)
  const normalizedScores = {};
  PATTERN_KEYS.forEach(pattern => {
    const normalized = ((rawScores[pattern] + 10) / 60) * 100;
    // Clamp between 0 and 100
    normalizedScores[pattern] = Math.max(0, Math.min(100, normalized));
  });

  // Calculate metadata
  const totalRawPoints = PATTERN_KEYS.reduce((sum, pattern) => sum + rawScores[pattern], 0);
  const answeredCount = answers.filter(a => a !== null && a !== undefined).length;

  return {
    rawScores,
    normalizedScores,
    metadata: {
      totalQuestions: 20,
      answeredCount,
      totalRawPoints,
      completionPercentage: (answeredCount / 20) * 100
    }
  };
}

/**
 * Apply 20% weight to questionnaire scores for final pattern fusion
 * 
 * @param {Object} normalizedScores - Normalized questionnaire scores (0-100)
 * @returns {Object} Weighted scores (0-20 range)
 */
export function applyQuestionnaireWeight(normalizedScores) {
  const QUESTIONNAIRE_WEIGHT = 0.20;
  const weightedScores = {};

  PATTERN_KEYS.forEach(pattern => {
    weightedScores[pattern] = normalizedScores[pattern] * QUESTIONNAIRE_WEIGHT;
  });

  return weightedScores;
}

/**
 * Fuse scores from all three modalities: Body (50%), Face (30%), Questionnaire (20%)
 * 
 * @param {Object} bodyScores - Body assessment scores (0-100)
 * @param {Object} faceScores - Face assessment scores (0-100)
 * @param {Object} questionnaireScores - Questionnaire normalized scores (0-100)
 * @returns {Object} Final fused scores and pattern classification
 */
export function fusePatternScores(bodyScores, faceScores, questionnaireScores) {
  const BODY_WEIGHT = 0.50;
  const FACE_WEIGHT = 0.30;
  const QUESTIONNAIRE_WEIGHT = 0.20;

  const finalScores = {};
  const modalityContributions = {
    body: {},
    face: {},
    questionnaire: {}
  };

  // Calculate weighted fusion for each pattern
  PATTERN_KEYS.forEach(pattern => {
    const bodyContribution = (bodyScores[pattern] || 0) * BODY_WEIGHT;
    const faceContribution = (faceScores[pattern] || 0) * FACE_WEIGHT;
    const questionnaireContribution = (questionnaireScores[pattern] || 0) * QUESTIONNAIRE_WEIGHT;

    finalScores[pattern] = bodyContribution + faceContribution + questionnaireContribution;

    // Store individual contributions for transparency
    modalityContributions.body[pattern] = bodyContribution;
    modalityContributions.face[pattern] = faceContribution;
    modalityContributions.questionnaire[pattern] = questionnaireContribution;
  });

  // Identify primary and secondary patterns
  const sortedPatterns = PATTERN_KEYS
    .map(pattern => ({ pattern, score: finalScores[pattern] }))
    .sort((a, b) => b.score - a.score);

  const primaryPattern = sortedPatterns[0];
  const secondaryPattern = sortedPatterns[1];

  // Secondary pattern only counts if >40%
  const hasSecondary = secondaryPattern.score > 40;

  return {
    finalScores,
    modalityContributions,
    primaryPattern: {
      name: primaryPattern.pattern,
      score: primaryPattern.score
    },
    secondaryPattern: hasSecondary ? {
      name: secondaryPattern.pattern,
      score: secondaryPattern.score
    } : null,
    allPatterns: sortedPatterns
  };
}

/**
 * Calculate confidence band based on modality agreement
 * 
 * @param {Object} bodyScores - Body assessment scores
 * @param {Object} faceScores - Face assessment scores  
 * @param {Object} questionnaireScores - Questionnaire scores
 * @param {Object} fusedResult - Result from fusePatternScores
 * @returns {Object} Confidence level and reasoning
 */
export function calculateConfidenceBand(bodyScores, faceScores, questionnaireScores, fusedResult) {
  const { primaryPattern, secondaryPattern, finalScores } = fusedResult;
  const primaryScore = primaryPattern.score;
  const secondaryScore = secondaryPattern ? secondaryPattern.score : 0;
  const gap = primaryScore - secondaryScore;

  // Check modality agreement on primary pattern
  const primaryPatternName = primaryPattern.name;
  const bodyPrimary = bodyScores[primaryPatternName] || 0;
  const facePrimary = faceScores[primaryPatternName] || 0;
  const questionnairePrimary = questionnaireScores[primaryPatternName] || 0;

  // Calculate variance across modalities
  const scores = [bodyPrimary, facePrimary, questionnairePrimary];
  const mean = scores.reduce((sum, s) => sum + s, 0) / 3;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / 3;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / mean) * 100;

  // Check if all modalities agree within threshold
  const agreementThreshold15 = 15;
  const agreementThreshold25 = 25;
  
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const scoreRange = maxScore - minScore;

  let modalitiesInAgreement = 0;
  if (scoreRange <= agreementThreshold15) {
    modalitiesInAgreement = 3; // All agree
  } else if (scoreRange <= agreementThreshold25) {
    modalitiesInAgreement = 2; // Two agree
  } else {
    modalitiesInAgreement = 1; // High disagreement
  }

  // Determine confidence level
  let confidence = 'LOW';
  let reasoning = [];

  // HIGH CONFIDENCE (75-100%)
  if (
    primaryScore > 70 &&
    gap > 30 &&
    modalitiesInAgreement === 3
  ) {
    confidence = 'HIGH';
    reasoning.push('Primary pattern score >70%');
    reasoning.push(`Strong gap between primary and secondary (${gap.toFixed(1)} points)`);
    reasoning.push('All three modalities agree within 15%');
  }
  // MEDIUM CONFIDENCE (50-74%)
  else if (
    primaryScore >= 50 && primaryScore <= 70 &&
    gap >= 15 && gap <= 30 &&
    modalitiesInAgreement >= 2
  ) {
    confidence = 'MEDIUM';
    reasoning.push(`Primary pattern score ${primaryScore.toFixed(1)}% (50-70% range)`);
    reasoning.push(`Moderate gap (${gap.toFixed(1)} points)`);
    reasoning.push('Two or more modalities in agreement');
  }
  // LOW CONFIDENCE (<50%)
  else {
    confidence = 'LOW';
    if (primaryScore < 50) {
      reasoning.push(`Primary pattern score only ${primaryScore.toFixed(1)}%`);
    }
    if (gap < 15) {
      reasoning.push(`Small gap between patterns (${gap.toFixed(1)} points)`);
    }
    if (modalitiesInAgreement < 2) {
      reasoning.push('High variance across modalities');
    }
  }

  return {
    level: confidence,
    percentage: confidence === 'HIGH' ? 85 : confidence === 'MEDIUM' ? 65 : 35,
    reasoning,
    metrics: {
      primaryScore: primaryScore.toFixed(1),
      gap: gap.toFixed(1),
      modalityAgreement: modalitiesInAgreement,
      coefficientOfVariation: coefficientOfVariation.toFixed(1),
      scoreRange: scoreRange.toFixed(1)
    }
  };
}

/**
 * Test function to verify scoring calculations
 */
export function testQuestionnaireScoring() {
  console.log('=== QUESTIONNAIRE SCORING TEST ===\n');

  // Test Case 1: All Upper Compression answers
  const allUpperAnswers = ['A', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'A', 'A', 'A', 'B', 'A', 'C', 'A', 'C', 'C', 'D', 'A', 'A'];
  const result1 = calculateQuestionnaireScores(allUpperAnswers);
  console.log('Test 1 - Upper Compression Dominant:');
  console.log('Raw Scores:', result1.rawScores);
  console.log('Normalized Scores:', result1.normalizedScores);
  console.log('');

  // Test Case 2: Balanced answers
  const balancedAnswers = ['C', 'D', 'C', 'C', 'A', 'B', 'C', 'C', 'C', 'A', 'A', 'A', 'A', 'A', 'A', 'C', 'C', 'D', 'A', 'C'];
  const result2 = calculateQuestionnaireScores(balancedAnswers);
  console.log('Test 2 - Balanced Answers:');
  console.log('Raw Scores:', result2.rawScores);
  console.log('Normalized Scores:', result2.normalizedScores);
  console.log('');

  // Test Case 3: Pattern fusion
  const bodyScores = { upperCompression: 75, lowerCompression: 45, thoracicCollapse: 30, lateralAsymmetry: 25 };
  const faceScores = { upperCompression: 70, lowerCompression: 40, thoracicCollapse: 35, lateralAsymmetry: 20 };
  const fusedResult = fusePatternScores(bodyScores, faceScores, result1.normalizedScores);
  console.log('Test 3 - Pattern Fusion:');
  console.log('Final Scores:', fusedResult.finalScores);
  console.log('Primary Pattern:', fusedResult.primaryPattern);
  console.log('Secondary Pattern:', fusedResult.secondaryPattern);
  console.log('');

  // Test Case 4: Confidence calculation
  const confidence = calculateConfidenceBand(bodyScores, faceScores, result1.normalizedScores, fusedResult);
  console.log('Test 4 - Confidence Band:');
  console.log('Level:', confidence.level);
  console.log('Reasoning:', confidence.reasoning);
  console.log('Metrics:', confidence.metrics);
}