// Toggle the subject input visibility
function toggleSubjectInputs() {
    const type = document.getElementById('reportType').value;
    const section = document.getElementById('subjectSection');
    section.style.display = type === 'subjectwise' ? 'block' : 'none';
}

// Logic for calculating scores
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

// PDF Generation Engine
async function downloadPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const data = calculateScore();
        const reportType = document.getElementById('reportType').value;
        const student = document.getElementById('studentName').value || "Candidate";
        const test = document.getElementById('testName').value || "General Assessment";

        // --- PAGE 1: OVERALL ANALYSIS ---
        renderBrandedHeader(doc, "Performance Report");
        
        doc.autoTable({
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] },
            body: [
                ['Student Name', student],
                ['Test Name', test],
                ['Total Questions', data.totalQs],
                ['Correct Answers', data.correct],
                ['Wrong Answers', data.wrong],
                ['Final Score', data.finalScore.toFixed(2)],
                ['Percentage', data.percentage + "%"]
            ],
        });

        let currentY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("PERFORMANCE OVERVIEW", 20, currentY);
        
        const maxWidth = 100;
        const total = data.totalQs || 1;
        
        drawDataBar(doc, 20, currentY + 10, (data.correct / total) * maxWidth, [34, 197, 94], `Correct (${data.correct})`);
        drawDataBar(doc, 20, currentY + 20, (data.wrong / total) * maxWidth, [239, 68, 68], `Wrong (${data.wrong})`);
        drawDataBar(doc, 20, currentY + 30, (data.unattempted / total) * maxWidth, [148, 163, 184], `Skipped (${data.unattempted})`);

        // --- PAGE 2: SUBJECT-WISE (CONDITIONAL) ---
        if (reportType === 'subjectwise') {
            doc.addPage();
            renderBrandedHeader(doc, "Subject-wise Analysis");
            
            const subjects = [
                { n: "Physics", c: parseInt(document.getElementById('phyC').value) || 0, w: parseInt(document.getElementById('phyW').value) || 0 },
                { n: "Chemistry", c: parseInt(document.getElementById('chemC').value) || 0, w: parseInt(document.getElementById('chemW').value) || 0 },
                { n: "Math/Biology", c: parseInt(document.getElementById('mathBioC').value) || 0, w: parseInt(document.getElementById('mathBioW').value) || 0 },
                { n: "Additional Sub", c: parseInt(document.getElementById('extraC').value) || 0, w: parseInt(document.getElementById('extraW').value) || 0 }
            ];

            let subY = 55;
            subjects.forEach(s => {
                if(s.c > 0 || s.w > 0) {
                    doc.setFontSize(11);
                    doc.setTextColor(0);
                    doc.text(`${s.n}: ${s.c} Correct, ${s.w} Wrong`, 20, subY);
                    const subTotal = s.c + s.w || 1;
                    doc.setFillColor(34, 197, 94);
                    doc.rect(20, subY + 2, (s.c / subTotal) * 80, 3, 'F');
                    doc.setFillColor(239, 68, 68);
                    doc.rect(20 + (s.c / subTotal) * 80, subY + 2, (s.w / subTotal) * 80, 3, 'F');
                    subY += 22;
                }
            });
        }

        // --- FINAL FOOTER & STAMP (ALWAYS ON LAST PAGE) ---
        const lastPageIdx = doc.internal.getNumberOfPages();
        doc.setPage(lastPageIdx);
        
        const footerY = 250;
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text("MR. PRASAD REDDY", 20, footerY);
        doc.setFontSize(9);
        doc.text("Founder & CEO, ECLIPSE7", 20, footerY + 5);
        doc.setTextColor(100);
        doc.text("Rule: Strategic Oversight & Operational Integrity", 20, footerY + 10);
        doc.line(20, footerY + 12, 80, footerY + 12);
        
        try {
            // Using your stamp.png from repo
            doc.addImage('stamp.png', 'PNG', 145, footerY - 15, 40, 40);
        } catch (e) {
            doc.setDrawColor(180, 0, 0);
            doc.circle(165, footerY, 15, 'S');
        }

        doc.save(`${student}_Report.pdf`);
    } catch (err) {
        console.error(err);
        alert("Check your inputs and try again.");
    }
}

// HELPER: Renders the ECLIPSE7 Header
function renderBrandedHeader(doc, subtext) {
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Negative Marking Calculator", 105, 15, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(56, 189, 248);
    doc.text(`${subtext} | Powered by ECLIPSE7`, 105, 25, { align: "center" });
}

// HELPER: Draws a bar graph row
function drawDataBar(doc, x, y, w, color, label) {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(x + 45, y - 4, w, 5, 'F');
    doc.setFontSize(9);
    doc.setTextColor(50);
    doc.text(label, x, y);
}
