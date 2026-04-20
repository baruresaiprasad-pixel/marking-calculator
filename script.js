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

    // 1. BRANDED HEADER & LOGO
    // Capitalized brand name as requested
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0); 
    doc.text("Eclipse7 DIGITAL", 105, 40, { align: "center" });

    // Note: To use your specific logo, upload it to your GitHub repo 
    // and replace 'logo.png' with your file path.
    const logoImg = 'logo.png';
    try {
        doc.addImage(logoImg, 'PNG', 85, 5, 40, 40);
    } catch (e) {
        console.log("Logo file not found in repository.");
    }

    // 2. REPORT DETAILS
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 50, 190, 50);
    doc.setFontSize(11);
    doc.text(`Student: ${student}`, 20, 60);
    doc.text(`Exam: ${test}`, 20, 67);
    doc.text(`Report ID: ${reportID}`, 140, 60);
    doc.text(`Date: ${date}`, 140, 67);

    // 3. SCORE TABLE
    doc.autoTable({
        startY: 75,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0] },
        body: [
            ['Total Attempted', data.attempted],
            ['Correct Responses', data.correct],
            ['Incorrect Responses', data.wrong],
            ['Final Score', data.finalScore.toFixed(2)]
        ],
    });

    // 4. PERFORMANCE PIE CHART (Visual Logic)
    const chartY = doc.lastAutoTable.finalY + 40;
    const centerX = 60;
    const radius = 25;
    
    // Draw Correct Slice (Green)
    const correctAngle = (data.correct / data.attempted) * 2 * Math.PI;
    doc.setDrawColor(40, 167, 69);
    doc.setLineWidth(10);
    doc.arc(centerX, chartY, radius, 0, correctAngle);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("Performance Breakdown:", 20, chartY - 30);
    doc.text(`- Correct: ${data.correct}`, 100, chartY - 10);
    doc.text(`- Incorrect: ${data.wrong}`, 100, chartY);

    // 5. CIRCULAR BRAND STAMP
    const stampY = chartY + 40;
    // Outer Circle
    doc.setDrawColor(192, 57, 43);
    doc.setLineWidth(1);
    doc.circle(160, stampY, 20);
    // Inner Circle
    doc.circle(160, stampY, 18);
    
    doc.setFontSize(7);
    doc.setTextColor(192, 57, 43);
    doc.setFont("helvetica", "bold");
    doc.text("Eclipse7 APPROVED", 160, stampY, { align: "center", angle: -10 });

    // 6. FOOTER
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Verify at eclipse7.odoo.com", 105, 285, { align: "center" });

    doc.save(`${student}_Result.pdf`);
}
