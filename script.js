function calculateScore() {
    const totalQs = parseFloat(document.getElementById('totalQs').value) || 0;
    const maxMarks = parseFloat(document.getElementById('maxMarks').value) || 0;
    const attempted = parseFloat(document.getElementById('attempted').value) || 0;
    const wrong = parseFloat(document.getElementById('wrong').value) || 0;
    const ratio = parseFloat(document.getElementById('ratio').value) || 4;
    
    const correct = attempted - wrong;
    const unattempted = totalQs - attempted;
    const marksPerCorrect = totalQs > 0 ? (maxMarks / totalQs) : 0;
    const penaltyPerWrong = ratio > 0 ? (marksPerCorrect / ratio) : 0;
    
    const totalPenalty = wrong * penaltyPerWrong;
    const finalScore = (correct * marksPerCorrect) - totalPenalty;
    const percentage = maxMarks > 0 ? ((finalScore / maxMarks) * 100).toFixed(2) : 0;

    document.getElementById('score').innerText = finalScore.toFixed(2);
    return { totalQs, maxMarks, attempted, wrong, correct, unattempted, finalScore, percentage, marksPerCorrect, totalPenalty };
}

async function downloadPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const data = calculateScore();
        const student = document.getElementById('studentName').value || "Candidate";
        const dateStr = new Date().toLocaleString();

        // 1. BRANDED HEADER (MATCHING THE PAGE LAYOUT)
        doc.setFillColor(15, 23, 42); // Dark Navy background
        doc.rect(0, 0, 210, 45, 'F');
        
        // Main Heading
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Negative Marking Calculator", 105, 20, { align: "center" });
        
        // Subheading
        doc.setFontSize(14);
        doc.setTextColor(56, 189, 248); // Bright Blue
        doc.setFont("helvetica", "normal");
        doc.text("Powered by ECLIPSE7", 105, 30, { align: "center" });

        // 2. DATA TABLE
        doc.autoTable({
            startY: 55,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] },
            body: [
                ['Student Name', student],
                ['Total Questions', data.totalQs],
                ['Maximum Marks', data.maxMarks],
                ['Correct Answers', data.correct],
                ['Wrong Answers', data.wrong],
                ['Penalty Marks', data.totalPenalty.toFixed(2)],
                ['Final Score', data.finalScore.toFixed(2)],
                ['Percentage', data.percentage + "%"]
            ],
        });

        // 3. STABLE BAR GRAPH
        const graphY = doc.lastAutoTable.finalY + 25;
        doc.setTextColor(0);
        doc.setFontSize(14);
        doc.text("PERFORMANCE OVERVIEW", 20, graphY);

        const maxWidth = 120;
        const total = data.totalQs || 1;

        doc.setFontSize(10);
        // Correct Bar (Green)
        doc.setFillColor(34, 197, 94);
        doc.rect(50, graphY + 10, (data.correct / total) * maxWidth, 8, 'F');
        doc.text(`Correct (${data.correct})`, 20, graphY + 16);

        // Wrong Bar (Red)
        doc.setFillColor(239, 68, 68);
        doc.rect(50, graphY + 25, (data.wrong / total) * maxWidth, 8, 'F');
        doc.text(`Wrong (${data.wrong})`, 20, graphY + 31);

        // 4. RECOMMENDATIONS (EXACT PHRASING)
        const recY = graphY + 60;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Recommendations:", 20, recY);
        doc.setFontSize(10);
        
        const unP = ((data.unattempted / total) * 100).toFixed(2);
        const boost = ((data.unattempted * data.marksPerCorrect / (data.maxMarks || 1)) * 100).toFixed(2);

        doc.text(`1. Spend more time reviewing: You left ${data.unattempted} (${unP}%) of the questions unattempted.`, 20, recY + 10);
        doc.text(`2. Switch focus to unattempted: Solving ${data.unattempted} more questions correctly could boost your percentage by`, 20, recY + 18);
        doc.text(`approximately ${boost}%.`, 20, recY + 24);

        // 5. CEO FOOTER
        const footerY = 250;
        doc.setFontSize(11);
        doc.text("MR. PRASAD REDDY", 20, footerY);
        doc.setFontSize(9);
        doc.text("Founder & CEO, Eclipse7", 20, footerY + 5);
        doc.setTextColor(100);
        doc.text("Rule: Strategic Oversight & Operational Integrity", 20, footerY + 10);
        doc.line(20, footerY + 12, 80, footerY + 12);

        // 6. STAMP & WEBSITE
        try {
            doc.addImage('stamp.png', 'PNG', 140, footerY - 20, 40, 40);
        } catch (e) {
            doc.setDrawColor(180, 0, 0);
            doc.circle(160, footerY, 15, 'S');
        }

        doc.setTextColor(37, 99, 235);
        doc.text("Visit: https://eclipse7.odoo.com/", 105, 275, { align: "center" });
        doc.setTextColor(150);
        doc.text(`Issued on: ${dateStr}`, 105, 282, { align: "center" });

        doc.save(`${student}_Eclipse7_Report.pdf`);
    } catch (err) {
        console.error(err);
        alert("Download failed. Please check inputs.");
    }
}
