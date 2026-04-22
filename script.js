function toggleSubjectInputs() {
    const section = document.getElementById('subjectSection');
    section.style.display = document.getElementById('reportType').value === 'subjectwise' ? 'block' : 'none';
}

function calculateScore() {
    const totalQs = parseFloat(document.getElementById('totalQs').value) || 0;
    const maxMarks = parseFloat(document.getElementById('maxMarks').value) || 0;
    const attempted = parseFloat(document.getElementById('attempted').value) || 0;
    const wrong = parseFloat(document.getElementById('wrong').value) || 0;
    
    const correct = attempted - wrong;
    const unattempted = Math.max(0, totalQs - attempted);
    const marksPerCorrect = totalQs > 0 ? (maxMarks / totalQs) : 0;
    const totalPenalty = wrong * (marksPerCorrect / 4);
    const finalScore = (correct * marksPerCorrect) - totalPenalty;
    const efficiency = maxMarks > 0 ? ((finalScore / maxMarks) * 100).toFixed(2) : 0;

    document.getElementById('score').innerText = finalScore.toFixed(2);
    return { totalQs, maxMarks, attempted, wrong, correct, unattempted, finalScore, efficiency, totalPenalty };
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = calculateScore();
    const reportType = document.getElementById('reportType').value;
    const student = (document.getElementById('studentName').value || "CANDIDATE").toUpperCase();
    const test = (document.getElementById('testName').value || "STANDARD ASSESSMENT").toUpperCase();

    // --- PREMIUM DARK HEADER ---
    doc.setFillColor(15, 23, 42); // Deep Navy/Black
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("STRATEGIC PERFORMANCE DOSSIER", 105, 22, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(0, 242, 255);
    doc.text("OFFICIAL REPORT | POWERED BY ECLIPSE7 AI MADE BY SAIPRASAD BARURE", 105, 32, { align: "center" });
    
    doc.setDrawColor(0, 242, 255);
    doc.line(20, 38, 190, 38);

    // --- CORE METRICS TABLE ---
    doc.autoTable({
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59] },
        styles: { fontSize: 9, cellPadding: 3 },
        body: [
            ['STUDENT IDENTITY', student],
            ['ASSESSMENT TAG', test],
            ['TOTAL QUESTIONS', data.totalQs],
            ['VERIFIED CORRECT', data.correct],
            ['IDENTIFIED ERRORS', data.wrong],
            ['PENALTY DEDUCTION', `- ${data.totalPenalty.toFixed(2)}`],
            ['AGGREGATE SCORE', data.finalScore.toFixed(2)],
            ['EFFICIENCY RATING', `${data.efficiency}%`]
        ],
    });

    let currentY = doc.lastAutoTable.finalY + 15;

    // --- CORE PERFORMANCE METRICS (BAR GRAPHS) ---
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text("CORE PERFORMANCE METRICS", 20, currentY);
    currentY += 8;

    const metrics = [
        { label: `Accuracy (${data.correct})`, val: data.correct, color: [34, 197, 94] }, // Green
        { label: `Errors (${data.wrong})`, val: data.wrong, color: [239, 68, 68] },   // Red
        { label: `Unattempted (${data.unattempted})`, val: data.unattempted, color: [148, 163, 184] } // Gray
    ];

    metrics.forEach(m => {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(m.label, 20, currentY + 3);
        
        const barWidth = (m.val / data.totalQs) * 100;
        doc.setFillColor(m.color[0], m.color[1], m.color[2]);
        doc.rect(60, currentY, Math.max(barWidth, 1), 4, 'F');
        currentY += 10;
    });

    // --- STRATEGIC RECOMMENDATIONS ---
    currentY += 5;
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("STRATEGIC RECOMMENDATIONS:", 20, currentY);
    doc.setFontSize(9);
    doc.setTextColor(80);
    currentY += 8;
    doc.text(`1. Optimize Attempt Velocity: You left ${data.unattempted} (${((data.unattempted/data.totalQs)*100).toFixed(2)}%) questions unaddressed.`, 20, currentY);
    currentY += 6;
    doc.text(`2. Potential Growth: Solving these unattempted items correctly could surge your efficiency by ${((data.unattempted/data.totalQs)*100).toFixed(2)}%.`, 20, currentY);

    // --- SIGNATURE & STAMP BLOCK ---
    const bottomY = 260;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text("MR. PRASAD REDDY", 20, bottomY);
    doc.setFontSize(8);
    doc.text("Founder & CEO, ECLIPSE7", 20, bottomY + 5);
    doc.setTextColor(150);
    doc.text(`Generation Timestamp: ${new Date().toLocaleString()}`, 20, bottomY + 12);

    // APPROVED STAMP (Red Circle Design)
    doc.setDrawColor(200, 30, 30);
    doc.setLineWidth(1);
    doc.circle(170, bottomY, 15, 'S');
    doc.setTextColor(200, 30, 30);
    doc.setFontSize(7);
    doc.text("ECLIPSE7", 170, bottomY - 5, { align: "center" });
    doc.setFontSize(9);
    doc.text("APPROVED", 170, bottomY + 2, { align: "center" });
    doc.setFontSize(6);
    doc.text("PRASAD REDDY", 170, bottomY + 8, { align: "center" });

    doc.save(`${student}_Strategic_Report.pdf`);
}
