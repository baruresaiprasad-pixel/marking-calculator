async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = calculateScore();
    const student = document.getElementById('studentName').value || "Scholar";
    const test = document.getElementById('testName').value || "Assessment";
    const date = new Date().toLocaleString();
    const reportID = "E7-X" + Math.random().toString(36).substr(2, 5).toUpperCase();

    // --- Header & Logo ---
    doc.setFillColor(15, 23, 42); // Dark Navy Header
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(28);
    doc.text("Eclipse7 DIGITAL", 105, 25, { align: "center" });

    // --- Student & Exam Info ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`REPORT ID: ${reportID}`, 20, 50);
    doc.text(`ISSUED ON: ${date}`, 140, 50);
    doc.setFontSize(14);
    doc.text(`CANDIDATE: ${student}`, 20, 65);
    doc.text(`EXAMINATION: ${test}`, 20, 75);

    // --- Detailed Metrics Table ---
    doc.autoTable({
        startY: 85,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        body: [
            ['Total Questions Attempted', data.attempted],
            ['Total Correct Responses', data.correct],
            ['Total Incorrect Responses', data.wrong],
            ['Negative Penalty Ratio', `1:${data.ratio}`],
            ['FINAL COMPUTED SCORE', data.finalScore.toFixed(2)]
        ],
    });

    // --- FIXED PIE CHART (Performance Visualization) ---
    const chartY = doc.lastAutoTable.finalY + 40;
    const correctPct = (data.correct / data.attempted) * 100 || 0;
    
    doc.setFontSize(12);
    doc.text("ANALYTICS: ACCURACY DISTRIBUTION", 20, chartY - 25);
    
    // Draw the Pie Segments
    doc.setLineWidth(15);
    doc.setDrawColor(39, 174, 96); // Green for Correct
    doc.arc(60, chartY, 20, 0, (correctPct/100) * 2 * Math.PI, true);
    
    doc.setDrawColor(192, 57, 43); // Red for Incorrect
    doc.arc(60, chartY, 20, (correctPct/100) * 2 * Math.PI, 2 * Math.PI, true);

    // Legend
    doc.setFontSize(10);
    doc.text(`Accuracy Rate: ${correctPct.toFixed(1)}%`, 100, chartY - 5);
    doc.text(`Error Rate: ${(100 - correctPct).toFixed(1)}%`, 100, chartY + 5);

    // --- FOUNDER & CEO INFORMATION ---
    const founderY = chartY + 60;
    doc.setFont("helvetica", "bold");
    doc.text("EXECUTIVE ENDORSEMENT", 20, founderY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Mr. Prasad Reddy", 20, founderY + 10);
    doc.text("Founder & CEO, Eclipse7", 20, founderY + 15);
    
    // Digital Signature Line
    doc.setDrawColor(0);
    doc.line(20, founderY + 25, 80, founderY + 25);
    doc.setFont("times", "italic");
    doc.text("Authorized by P. Reddy", 25, founderY + 30);

    // --- SITE INFORMATION & CALL TO ACTION ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const about = "Eclipse7 is an AI-driven educational platform dedicated to providing board exam resources, competitive test prep, and high-precision analytical tools for students globally.";
    doc.text(doc.splitTextToSize(about, 170), 20, founderY + 45);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("YOU SHOULD VISIT OUR SITE, IT WAS SPECIALLY MADE FOR YOU.", 105, founderY + 65, { align: "center" });

    // --- FOOTER ---
    doc.setTextColor(150);
    doc.setFontSize(8);
    doc.text("Digital Validation: https://eclipse7.odoo.com/", 105, 285, { align: "center" });

    doc.save(`${student}_Official_Eclipse7_Report.pdf`);
}
