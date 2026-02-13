import { calculateQuestionnaireScores } from './utils/questionnaireScoring.js';
import { QUESTIONNAIRE_DATA } from './config/questionnaireData.js';

console.log('=== VERIFYING YOUR QUESTIONNAIRE SCORE ===\n');

// Your actual answers from the PDF
const yourAnswers = [
  'A', // Q1: Lock up — Jaw clenches, shoulders rise, breath stops
  'B', // Q2: Crash hard — Collapse on the couch, can't do anything
  'B', // Q3: I crave it but can't access it — Tired but wired
  'A', // Q4: Feel frustrated — That doesn't work for me
  'B', // Q5: Starts high, crashes hard — Morning energy ↑ afternoon collapse
  'C', // Q6: Go numb — Can't access the feeling
  'B', // Q7: Fall asleep exhausted, wake up wired — Broken sleep
  'A', // Q8: Stay on alert — Scanning, monitoring, performing
  'C', // Q9: Trustworthy — I listen to it and it guides me
  'B', // Q10: Lower back, hips, or knees
  'A', // Q11: My head/neck jutts forward, shoulders hunch
  'B', // Q12: I hold my breath or sigh frequently
  'D', // Q13: One-sided pain patterns
  'A', // Q14: I don't notice them much / balanced
  'B', // Q15: Bending forward or touching my toes
  'B', // Q16: Somewhat
  'C', // Q17: Comfortable and natural
  'A', // Q18: My heels lift, can't go deep
  'B', // Q19: Sometimes clumsy or uncoordinated
  'B'  // Q20: Actually feel calm — Not just fake it
];

console.log('Your Answers:', yourAnswers);
console.log('');

// Calculate scores
const result = calculateQuestionnaireScores(yourAnswers);

console.log('=== RAW SCORES ===');
console.log('Upper Compression:', result.rawScores.upperCompression);
console.log('Lower Compression:', result.rawScores.lowerCompression);
console.log('Thoracic Collapse:', result.rawScores.thoracicCollapse);
console.log('Lateral Asymmetry:', result.rawScores.lateralAsymmetry);
console.log('Total Raw Points:', result.metadata.totalRawPoints);
console.log('');

console.log('=== NORMALIZED SCORES (0-100) ===');
console.log('Upper Compression:', result.normalizedScores.upperCompression.toFixed(2) + '%');
console.log('Lower Compression:', result.normalizedScores.lowerCompression.toFixed(2) + '%');
console.log('Thoracic Collapse:', result.normalizedScores.thoracicCollapse.toFixed(2) + '%');
console.log('Lateral Asymmetry:', result.normalizedScores.lateralAsymmetry.toFixed(2) + '%');
console.log('');

console.log('=== AVERAGE QUESTIONNAIRE SCORE ===');
const avgScore = (
  result.normalizedScores.upperCompression +
  result.normalizedScores.lowerCompression +
  result.normalizedScores.thoracicCollapse +
  result.normalizedScores.lateralAsymmetry
) / 4;
console.log('Average:', avgScore.toFixed(2) + '%');
console.log('');

console.log('=== NORMALIZATION FORMULA ===');
console.log('Formula: ((rawScore + 10) / 60) × 100');
console.log('');
console.log('Example for Upper Compression:');
console.log(`  Raw Score: ${result.rawScores.upperCompression}`);
console.log(`  Step 1: ${result.rawScores.upperCompression} + 10 = ${result.rawScores.upperCompression + 10}`);
console.log(`  Step 2: ${result.rawScores.upperCompression + 10} / 60 = ${(result.rawScores.upperCompression + 10) / 60}`);
console.log(`  Step 3: ${(result.rawScores.upperCompression + 10) / 60} × 100 = ${((result.rawScores.upperCompression + 10) / 60) * 100}`);
console.log(`  Final (clamped 0-100): ${result.normalizedScores.upperCompression.toFixed(2)}%`);
console.log('');

console.log('=== DETAILED BREAKDOWN ===');
yourAnswers.forEach((answer, index) => {
  const question = QUESTIONNAIRE_DATA[index];
  const selectedOption = question.options.find(opt => opt.label === answer);
  
  console.log(`Q${index + 1}: ${question.question}`);
  console.log(`  Answer: ${answer} - ${selectedOption.text}`);
  console.log(`  Points: UC=${selectedOption.scoring.upperCompression}, LC=${selectedOption.scoring.lowerCompression}, TC=${selectedOption.scoring.thoracicCollapse}, LA=${selectedOption.scoring.lateralAsymmetry}`);
  console.log('');
});

console.log('=== VERIFICATION COMPLETE ===');