import { jsPDF } from 'jspdf';
import { QUESTIONNAIRE_DATA } from '../config/questionnaireData.js';

export const generatePDF = ( captureData, questionnaireData, patternResults, scores ) => {
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
  doc.text( 'SOMATIC PATTERN ASSESSMENT', pageWidth / 2, yPos, { align: 'center' } );
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

  // PATTERN ANALYSIS SECTION (if available)
  if ( patternResults && patternResults.primaryPattern ) {
    doc.setFontSize( 16 );
    doc.setFont( undefined, 'bold' );
    doc.text( 'PATTERN CLASSIFICATION', 20, yPos );
    yPos += 10;

    doc.setFontSize( 14 );
    doc.setFont( undefined, 'bold' );
    doc.text( `Primary Pattern: ${ patternResults.primaryPattern.name }`, 30, yPos );
    yPos += 7;

    doc.setFontSize( 12 );
    doc.setFont( undefined, 'normal' );
    doc.text( `Score: ${ patternResults.primaryPattern.score.toFixed( 1 ) }/100`, 40, yPos );
    yPos += 6;
    doc.text( `Severity: ${ patternResults.primaryPattern.severity.toUpperCase() }`, 40, yPos );
    yPos += 10;

    if ( patternResults.secondaryPattern ) {
      doc.setFontSize( 14 );
      doc.setFont( undefined, 'bold' );
      doc.text( `Secondary Pattern: ${ patternResults.secondaryPattern.name }`, 30, yPos );
      yPos += 7;

      doc.setFontSize( 12 );
      doc.setFont( undefined, 'normal' );
      doc.text( `Score: ${ patternResults.secondaryPattern.score.toFixed( 1 ) }/100`, 40, yPos );
      yPos += 6;
      doc.text( `Severity: ${ patternResults.secondaryPattern.severity.toUpperCase() }`, 40, yPos );
      yPos += 10;
    }

    // Confidence
    if ( patternResults.confidence ) {
      doc.setFontSize( 12 );
      doc.setFont( undefined, 'bold' );
      doc.text( `Confidence: ${ patternResults.confidence.level } (${ patternResults.confidence.percentage }%)`, 30, yPos );
      yPos += 10;
    }

    // Separator
    doc.setLineWidth( 0.5 );
    doc.line( 20, yPos, pageWidth - 20, yPos );
    yPos += 10;
  }

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
  doc.text( `Questionnaire Score: ${ scores.questionnaire }/100`, 30, yPos );
  yPos += 10;

  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text( `OVERALL SCORE: ${ scores.total }/100`, 30, yPos );
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

  // If we have the new questionnaire data format
  if ( questionnaireData && questionnaireData.answers && QUESTIONNAIRE_DATA ) {
    doc.setFontSize( 9 );
    doc.setFont( undefined, 'normal' );

    questionnaireData.answers.forEach( ( answer, index ) => {
      if ( !answer ) return; // Skip unanswered questions

      const questionObj = QUESTIONNAIRE_DATA[ index ];
      if ( !questionObj ) return;

      const qNum = index + 1;
      const selectedOption = questionObj.options.find( opt => opt.label === answer );

      if ( yPos > pageHeight - 30 ) {
        doc.addPage();
        yPos = 20;
      }

      // Question text
      doc.setFont( undefined, 'bold' );
      const questionLines = doc.splitTextToSize( `Q${ qNum }: ${ questionObj.question }`, pageWidth - 40 );
      doc.text( questionLines, 20, yPos );
      yPos += questionLines.length * 4;

      // Answer text
      doc.setFont( undefined, 'normal' );
      if ( selectedOption ) {
        const answerLines = doc.splitTextToSize( `Answer: ${ answer } - ${ selectedOption.text }`, pageWidth - 40 );
        doc.text( answerLines, 30, yPos );
        yPos += answerLines.length * 4 + 3;
      } else {
        doc.text( `Answer: ${ answer }`, 30, yPos );
        yPos += 7;
      }
    } );

    // Add questionnaire scores
    if ( questionnaireData.normalizedScores ) {
      yPos += 10;
      if ( yPos > pageHeight - 50 ) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize( 14 );
      doc.setFont( undefined, 'bold' );
      doc.text( 'QUESTIONNAIRE PATTERN SCORES', 20, yPos );
      yPos += 10;

      doc.setFontSize( 10 );
      doc.setFont( undefined, 'normal' );
      doc.text( `Upper Compression: ${ questionnaireData.normalizedScores.upperCompression.toFixed( 1 ) }%`, 30, yPos );
      yPos += 6;
      doc.text( `Lower Compression: ${ questionnaireData.normalizedScores.lowerCompression.toFixed( 1 ) }%`, 30, yPos );
      yPos += 6;
      doc.text( `Thoracic Collapse: ${ questionnaireData.normalizedScores.thoracicCollapse.toFixed( 1 ) }%`, 30, yPos );
      yPos += 6;
      doc.text( `Lateral Asymmetry: ${ questionnaireData.normalizedScores.lateralAsymmetry.toFixed( 1 ) }%`, 30, yPos );
      yPos += 10;
    }
  }

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

  // Pattern-specific recommendations
  if ( patternResults && patternResults.primaryPattern ) {
    const patternName = patternResults.primaryPattern.name;
    const severity = patternResults.primaryPattern.severity;

    doc.setFont( undefined, 'bold' );
    doc.text( `For ${ patternName } (${ severity }):`, 20, yPos );
    yPos += 7;
    doc.setFont( undefined, 'normal' );

    let patternRecs = [];

    if ( patternName.includes( 'Upper Compression' ) ) {
      patternRecs = [
        '• Practice diaphragmatic breathing exercises daily',
        '• Release tension in neck, jaw, and shoulders with gentle stretches',
        '• Work on softening the upper body through yoga or tai chi',
        '• Consider massage therapy or craniosacral work',
        '• Practice mindfulness to reduce stress-holding patterns'
      ];
    } else if ( patternName.includes( 'Lower Compression' ) ) {
      patternRecs = [
        '• Strengthen core and pelvic floor muscles',
        '• Practice hip-opening stretches and mobility work',
        '• Work on ankle and foot mobility',
        '• Consider gait analysis and corrective exercises',
        '• Focus on grounding and stability exercises'
      ];
    } else if ( patternName.includes( 'Thoracic Collapse' ) ) {
      patternRecs = [
        '• Practice chest-opening stretches and back extensions',
        '• Strengthen upper back and shoulder blade muscles',
        '• Work on improving breathing capacity',
        '• Consider postural awareness training',
        '• Practice exercises that promote spinal extension'
      ];
    } else if ( patternName.includes( 'Lateral Asymmetry' ) ) {
      patternRecs = [
        '• Work on balancing left and right sides of the body',
        '• Practice single-leg balance and stability exercises',
        '• Address any rotational imbalances',
        '• Consider manual therapy for structural alignment',
        '• Focus on symmetrical movement patterns'
      ];
    }

    patternRecs.forEach( rec => {
      yPos = addText( rec, 20, yPos, pageWidth - 40, 10 );
      yPos += 5;
    } );

    yPos += 5;
  }

  // General recommendations
  doc.setFont(undefined, 'bold');
  doc.text('General Recommendations:', 20, yPos);
  yPos += 7;

  doc.setFont(undefined, 'normal');
  const generalRecs = [
    '• Take regular breaks from sitting every 30-60 minutes',
    '• Practice good ergonomics at your workstation',
    '• Engage in regular strength and flexibility exercises',
    '• Consider professional somatic therapy or bodywork',
    '• Stay hydrated and maintain a healthy weight',
    '• Practice body awareness and mindful movement'
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