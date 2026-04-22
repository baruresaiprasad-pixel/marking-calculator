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
    const unattempted = totalQs - attempted;
    const unattemptedPct = totalQs > 0 ? ((unattempted / totalQs) * 100).toFixed(2) : 0;
    const marksPerCorrect = totalQs > 0 ? (maxMarks / totalQs) : 0;
    const potentialBoost = totalQs > 0 ? ((unattempted * marksPerCorrect / maxMarks) * 100).toFixed(2) : 0;
    
    const totalPenalty = wrong * (marksPerCorrect / 4);
    const finalScore = (correct * marksPerCorrect) - totalPenalty;
    const percentage = maxMarks > 0 ? ((finalScore / maxMarks) * 100).toFixed(2) : 0;

    document.getElementById('score').innerText = finalScore.toFixed(2);
    return { totalQs, maxMarks, attempted, wrong, correct, unattempted, unattemptedPct, finalScore, percentage, totalPenalty, potentialBoost };
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = calculateScore();
    const reportType = document.getElementById('reportType').value;
    const student = (document.getElementById('studentName').value || "Candidate").toUpperCase();
    const test = document.getElementById('testName').value || "Standard Assessment";
    const timestamp = new Date().toLocaleString();

    // --- HEADER ---
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("NEGATIVE MARKING CALCULATOR ENGINE", 105, 18, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(56, 189, 248);
    doc.text(`Official Report | Powered by ECLIPSE7 AI Made by Saiprasad Barure`, 105, 28, { align: "center" });

    // --- MAIN DATA TABLE ---
    doc.autoTable({
        startY: 50, theme: 'grid', styles: { fontSize: 8 }, headStyles: { fillColor: [15, 23, 42] },
        body: [
            ['Subject Name', student], ['Assessment Title', test], ['Total Questions', data.totalQs],
            ['Max Mark Potential', data.maxMarks], ['Verified Correct', data.correct],
            ['Identified Errors', data.wrong], ['Penalty Deduction', `- ${data.totalPenalty.toFixed(2)}`],
            ['Aggregate Score', data.finalScore.toFixed(2)], ['Efficiency Rating', data.percentage + "%"]
        ],
    });

    let currentY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(11); doc.setTextColor(0); doc.text("CORE PERFORMANCE METRICS", 20, currentY);
    const total = data.totalQs || 1;
    drawBar(doc, 20, currentY + 8, (data.correct / total) * 100, [34, 197, 94], `Accuracy (${data.correct})`);
    drawBar(doc, 20, currentY + 16, (data.wrong / total) * 100, [239, 68, 68], `Errors (${data.wrong})`);
    drawBar(doc, 20, currentY + 24, (data.unattempted / total) * 100, [148, 163, 184], `Unattempted (${data.unattempted})`);

    currentY += 40;

    // --- SUBJECT BREAKDOWN (Conditional) ---
    if (reportType === 'subjectwise') {
        doc.text("DETAILED SUBJECT ANALYSIS", 20, currentY);
        const subs = [
            { n: "Physics", t: parseInt(document.getElementById('phyT').value)||0, c: parseInt(document.getElementById('phyC').value)||0, w: parseInt(document.getElementById('phyW').value)||0 },
            { n: "Chemistry", t: parseInt(document.getElementById('chemT').value)||0, c: parseInt(document.getElementById('chemC').value)||0, w: parseInt(document.getElementById('chemW').value)||0 },
            { n: "Math/Bio", t: parseInt(document.getElementById('mathBioT').value)||0, c: parseInt(document.getElementById('mathBioC').value)||0, w: parseInt(document.getElementById('mathBioW').value)||0 }
        ];
        subs.forEach(s => {
            if (s.t > 0) {
                currentY += 12;
                doc.setFontSize(8); doc.text(`${s.n}: ${s.c} Correct, ${s.w} Wrong`, 20, currentY);
                doc.setFillColor(34, 197, 94); doc.rect(80, currentY-3, (s.c/s.t)*100, 3, 'F');
                doc.setFillColor(239, 68, 68); doc.rect(80+(s.c/s.t)*100, currentY-3, (s.w/s.t)*100, 3, 'F');
            }
        });
        currentY += 15;
    }

    // --- RECOMMENDATIONS & FOOTER ---
    doc.line(20, currentY, 190, currentY);
    doc.setFontSize(10); doc.text("STRATEGIC RECOMMENDATIONS:", 20, currentY + 10);
    doc.setFontSize(8); doc.text(`1. Optimize Attempt Velocity: You left ${data.unattempted} (${data.unattemptedPct}%) questions unaddressed.`, 20, currentY + 18);
    doc.text(`2. Potential Growth: Solving these unattempted items correctly could surge your efficiency by ${data.potentialBoost}%.`, 20, currentY + 24);
    doc.setTextColor(56, 189, 248); doc.text("Access advanced resources at: https://eclipse7.odoo.com/", 20, currentY + 30);

    const footerY = 275;
    doc.setTextColor(0); doc.setFontSize(9); doc.text("MR. PRASAD REDDY", 20, footerY);
    doc.setFontSize(7); doc.text("Founder & CEO, ECLIPSE7", 20, footerY + 4);
    doc.text(`Generation Timestamp: ${timestamp}`, 20, footerY + 8);
    try { doc.addImage('stamp.png', 'PNG', 160, footerY - 15, 30, 30); } catch (e) { doc.circle(175, footerY, 10, 'S'); }

    doc.save(`${student}_Report.pdf`);
}

function drawBar(doc, x, y, w, color, label) {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(x + 60, y - 4, w, 3.5, 'F');
    doc.setFontSize(8); doc.setTextColor(100); doc.text(label, x, y);
}
