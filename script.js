function calculateScore() {
    const attempted = parseFloat(document.getElementById('attempted').value) || 0;
    const wrong = parseFloat(document.getElementById('wrong').value) || 0;
    const ratio = parseFloat(document.getElementById('ratio').value) || 0;
    
    const correct = attempted - wrong;
    const penalty = ratio > 0 ? (wrong / ratio) : 0;
    const finalScore = correct - penalty;

    document.getElementById('score').innerText = finalScore.toFixed(2);
    return { attempted, wrong, correct, finalScore, ratio };
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = calculateScore();
    
    const student = document.getElementById('studentName').value || "Valued Student";
    const test = document.getElementById('testName').value || "Evaluation Test";
    const date = new Date().toLocaleString();
    const reportID = "E7-" + Math.random().toString(36).substr(2, 6).toUpperCase();

    // 1. Header & Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); 
    doc.text("eclipse7 DIGITAL", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("CERTIFIED PERFORMANCE ANALYTICS", 105, 27, { align: "center" });

    // 2. Personalization Details
    doc.setDrawColor(41, 128, 185);
    doc.line(20, 35, 190, 35);
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Student Name: ${student}`, 20, 45);
    doc.text(`Exam Title: ${test}`, 20, 52);
    doc.text(`Report ID: ${reportID}`, 140, 45);
    doc.text(`Date: ${date}`, 140, 52);

    // 3. Official Results Table
    doc.autoTable({
        startY: 65,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        body: [
            ['Total Questions Attempted', data.attempted],
            ['Correct Responses', data.correct],
            ['Incorrect Responses', data.wrong],
            ['Negative Marking Ratio', `1 / ${data.ratio}`],
            ['TOTAL FINAL SCORE', data.finalScore.toFixed(2)]
        ],
    });

    const finalY = doc.lastAutoTable.finalY + 25;

    // 4. BRAND STAMP (Approved)
    doc.setDrawColor(192, 57, 43);
    doc.setLineWidth(0.8);
    doc.rect(25, finalY, 40, 15); 
    doc.setFontSize(12);
    doc.setTextColor(192, 57, 43);
    doc.setFont("courier", "bold");
    doc.text("APPROVED", 28, finalY + 10, { angle: 4 });

    // 5. SIGNATURE OF PROVIDER
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("Authorized by eclipse7:", 135, finalY);
    
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.text("eclipse7 Admin", 135, finalY + 10); // Digital Signature
    doc.setDrawColor(0);
    doc.line(130, finalY + 12, 185, finalY + 12); 

    // 6. Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This document is an electronically generated report. Verify at eclipse7.odoo.com", 105, 285, { align: "center" });

    doc.save(`${student}_${reportID}_Report.pdf`);
}
