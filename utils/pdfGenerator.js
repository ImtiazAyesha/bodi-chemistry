import { jsPDF } from 'jspdf';

export const generatePDF = (captureData, questionnaireAnswers, scores) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Helper function to add text with word wrap
  const addText = (text, x, y, maxWidth, fontSize = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.5);
  };

  // Header
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('BODI KEMISTRI', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  doc.setFontSize(18);
  doc.text('ASSESSMENT REPORT', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Date: ${currentDate}`, 20, yPos);
  yPos += 10;

  // Separator line
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // SCORES SECTION
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('ASSESSMENT SCORES', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Face Score: ${scores.face}/100`, 30, yPos);
  yPos += 7;
  doc.text(`Body Score: ${scores.body}/100`, 30, yPos);
  yPos += 7;
  doc.text(`Questionnaire Score: ${Math.round(scores.questionnaire)}/100`, 30, yPos);
  yPos += 10;

  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text(`TOTAL SCORE: ${scores.total}/100`, 30, yPos);
  yPos += 15;

  // Separator
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // FACE METRICS
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('FACE METRICS', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Eye Height Symmetry: ${captureData.stage1.metrics.eyeSym}`, 30, yPos);
  yPos += 6;
  doc.text(`Jaw Midline Shift: ${captureData.stage1.metrics.jawShift}`, 30, yPos);
  yPos += 6;
  doc.text(`Head Tilt: ${captureData.stage1.metrics.headTilt}°`, 30, yPos);
  yPos += 6;
  doc.text(`Nostril Asymmetry: ${captureData.stage1.metrics.nostrilAsym}`, 30, yPos);
  yPos += 12;

  // BODY METRICS
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('BODY METRICS', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Shoulder Height: ${captureData.stage2.metrics.shoulderHeight}`, 30, yPos);
  yPos += 6;
  doc.text(`Forward Head Posture Angle: ${captureData.stage3.metrics.fhpAngle}°`, 30, yPos);
  yPos += 6;
  doc.text(`Pelvic Tilt: ${captureData.stage4.metrics.pelvicTilt}°`, 30, yPos);
  yPos += 6;
  doc.text(`Knee Angle: ${captureData.stage4.metrics.kneeAngle}°`, 30, yPos);
  yPos += 6;
  doc.text(`Foot Arch Ratio: ${captureData.stage4.metrics.footArchRatio}`, 30, yPos);
  yPos += 15;

  // New page for questionnaire
  doc.addPage();
  yPos = 20;

  // QUESTIONNAIRE RESPONSES
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('QUESTIONNAIRE RESPONSES', 20, yPos);
  yPos += 10;

  const questions = [
    "Do you experience frequent headaches?",
    "Do you have neck pain or stiffness?",
    "Do you experience lower back pain?",
    "Do you have shoulder pain or tension?",
    "Do you spend more than 6 hours per day sitting?",
    "Do you use a computer or phone for extended periods?",
    "Do you exercise regularly (3+ times per week)?",
    "Do you have difficulty sleeping due to discomfort?",
    "Do you experience knee pain?",
    "Do you have flat feet or high arches?",
    "Do you experience hip pain or tightness?",
    "Do you have jaw pain or TMJ issues?",
    "Do you carry a heavy bag on one shoulder regularly?",
    "Do you wear high heels frequently?",
    "Do you have good posture awareness?",
    "Do you stretch or do mobility work regularly?",
    "Do you experience numbness or tingling in your hands/feet?",
    "Do you have a history of injuries affecting your posture?",
    "Do you feel balanced when standing on one leg?",
    "Do you have breathing difficulties or shallow breathing?"
  ];

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  questions.forEach((question, index) => {
    const qNum = index + 1;
    const answer = questionnaireAnswers[qNum] || 'N/A';
    
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(`Q${qNum}: ${question}`, 20, yPos);
    yPos += 5;
    doc.text(`A${qNum}: ${answer.toUpperCase()}`, 30, yPos);
    yPos += 8;
  });

  // New page for recommendations
  doc.addPage();
  yPos = 20;

  // RECOMMENDATIONS
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('RECOMMENDATIONS', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');

  const totalScore = parseFloat(scores.total);
  let recommendations = '';

  if (totalScore >= 90) {
    recommendations = 'Excellent posture! Continue your current habits and maintain regular exercise.';
  } else if (totalScore >= 75) {
    recommendations = 'Good posture with minor areas for improvement. Focus on strengthening exercises and regular stretching.';
  } else if (totalScore >= 60) {
    recommendations = 'Moderate posture concerns detected. Consider consulting a physical therapist for personalized guidance.';
  } else {
    recommendations = 'Significant posture issues identified. We strongly recommend professional assessment and treatment.';
  }

  yPos = addText(recommendations, 20, yPos, pageWidth - 40, 10);
  yPos += 10;

  // General recommendations
  doc.setFont(undefined, 'bold');
  doc.text('General Recommendations:', 20, yPos);
  yPos += 7;

  doc.setFont(undefined, 'normal');
  const generalRecs = [
    '• Take regular breaks from sitting every 30-60 minutes',
    '• Practice good ergonomics at your workstation',
    '• Engage in regular strength and flexibility exercises',
    '• Consider professional posture assessment if pain persists',
    '• Stay hydrated and maintain a healthy weight'
  ];

  generalRecs.forEach(rec => {
    yPos = addText(rec, 20, yPos, pageWidth - 40, 10);
    yPos += 5;
  });

  // Footer
  yPos = pageHeight - 20;
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text('This report is for informational purposes only and does not constitute medical advice.', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text('Consult with a healthcare professional for personalized medical guidance.', pageWidth / 2, yPos, { align: 'center' });

  // Save PDF
  doc.save(`Bodi-Kemistri-Report-${currentDate.replace(/\s/g, '-')}.pdf`);
};
