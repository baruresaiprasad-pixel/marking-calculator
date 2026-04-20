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
    
    const student = document.getElementById('studentName').value || "Scholar";
    const test = document.getElementById('testName').value || "General Assessment";
    const reportID = "E7-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const date = new Date().toLocaleString();

    // 1. HEADER SECTION
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(28);
    doc.text("Eclipse7 DIGITAL", 105, 25, { align: "center" });
    doc.setFontSize(10);
    doc.text("VERIFIED ACADEMIC PERFORMANCE ANALYTICS", 105, 33, { align: "center" });

    // 2. CANDIDATE IDENTITY
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`REPORT ID: ${reportID}`, 20, 55);
    doc.text(`DATE: ${date}`, 140, 55);
    doc.setFontSize(14);
    doc.text(`CANDIDATE: ${student}`, 20, 70);
    doc.text(`EXAMINATION: ${test}`, 20, 80);

    // 3. ANALYTICS TABLE
    doc.autoTable({
        startY: 90,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        body: [
            ['Total Questions Attempted', data.attempted],
            ['Total Correct Responses', data.correct],
            ['Total Incorrect Responses', data.wrong],
            ['Negative Marking Ratio', `1 / ${data.ratio}`],
            ['FINAL CALCULATED SCORE', data.finalScore.toFixed(2)]
        ],
    });

    // 4. PERFORMANCE CHART (Pie Chart Logic)
    const chartY = doc.lastAutoTable.finalY + 40;
    const correctRatio = data.correct / data.attempted || 0;
    
    doc.setFontSize(12);
    doc.text("ACCURACY DISTRIBUTION CHART", 20, chartY - 25);
    
    // Green Segment (Correct)
    doc.setLineWidth(12);
    doc.setDrawColor(34, 197, 94);
    doc.arc(60, chartY, 20, 0, correctRatio * 2 * Math.PI, true);
    
    // Red Segment (Incorrect)
    doc.setDrawColor(239, 68, 68);
    doc.arc(60, chartY, 20, correctRatio * 2 * Math.PI, 2 * Math.PI, true);

    doc.setFontSize(10);
    doc.text(`- Correct: ${data.correct}`, 100, chartY - 5);
    doc.text(`- Incorrect: ${data.wrong}`, 100, chartY + 5);

    // 5. EXECUTIVE ENDORSEMENT
    const execY = chartY + 50;
    doc.setFontSize(12);
    doc.text("EXECUTIVE ENDORSEMENT", 20, execY);
    doc.setFontSize(10);
    doc.text("MR. PRASAD REDDY", 20, execY + 10);
    doc.text("Founder & CEO, Eclipse7", 20, execY + 15);
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, execY + 22, 80, execY + 22);
    doc.setFont("times", "italic");
    doc.text("Authorized by P. Reddy", 25, execY + 28);

    // 6. CORPORATE INFO & STAMP
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const mission = "Eclipse7 is an AI-integrated platform providing advanced board resources and high-precision testing tools. Visit our site to explore resources made for your academic success.";
    doc.text(doc.splitTextToSize(mission, 170), 20, execY + 45);

    // Circular Stamp
    doc.setDrawColor(239, 68, 68);
    doc.circle(160, execY + 20, 18);
    doc.setFontSize(7);
    doc.setTextColor(239, 68, 68);
    doc.text("Eclipse7", 160, execY + 18, { align: "center" });
    doc.text("APPROVED", 160, execY + 23, { align: "center" });

    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.text("YOU SHOULD VISIT OUR SITE, IT WAS SPECIALLY MADE FOR YOU.", 105, 270, { align: "center" });

    doc.save(`${student}_Eclipse7_Verified_Report.pdf`);
}
