// 1. UNIVERSAL DROPDOWN LOGIC (Must be at the top)
function initDropdown(containerId, triggerId, panelId, hiddenInputId, callback) {
    const container = document.getElementById(containerId);
    const trigger = document.getElementById(triggerId);
    const panel = document.getElementById(panelId);
    const hidden = document.getElementById(hiddenInputId);
    
    if (!container || !trigger || !panel) return;

    const options = panel.querySelectorAll('.option-item');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('show');
        container.classList.toggle('active');
    });

    options.forEach(item => {
        item.addEventListener('click', () => {
            trigger.textContent = item.textContent;
            hidden.value = item.getAttribute('data-value');
            panel.classList.remove('show');
            container.classList.remove('active');
            if (callback) callback();
        });
    });

    window.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            panel.classList.remove('show');
            container.classList.remove('active');
        }
    });
}

// 2. INITIALIZE DROPDOWNS ON LOAD
document.addEventListener('DOMContentLoaded', () => {
    initDropdown('customSelect', 'selectedLabel', 'selectOptions', 'reportType', toggleSubjectInputs);
    initDropdown('ratioSelectContainer', 'ratioLabel', 'ratioOptions', 'markingRatio', null);
});

// 3. UI VISIBILITY LOGIC
function toggleSubjectInputs() {
    const type = document.getElementById('reportType').value;
    const section = document.getElementById('subjectSection');
    if (section) section.style.display = (type === 'subjectwise') ? 'block' : 'none';
}

// 4. SCORE CALCULATION ENGINE
function calculateScore() {
    const totalQs = parseFloat(document.getElementById('totalQs').value) || 0;
    const maxMarks = parseFloat(document.getElementById('maxMarks').value) || 0;
    const attempted = parseFloat(document.getElementById('attempted').value) || 0;
    const wrong = parseFloat(document.getElementById('wrong').value) || 0;
    const ratio = parseFloat(document.getElementById('markingRatio').value) || 0;
    
    const correct = attempted - wrong;
    const unattempted = Math.max(0, totalQs - attempted);
    const marksPerCorrect = totalQs > 0 ? (maxMarks / totalQs) : 0;
    const totalPenalty = wrong * (marksPerCorrect * ratio); 
    const finalScore = (correct * marksPerCorrect) - totalPenalty;
    const efficiency = maxMarks > 0 ? ((finalScore / maxMarks) * 100).toFixed(2) : 0;

    document.getElementById('score').innerText = finalScore.toFixed(2);
    
    return { 
        totalQs, maxMarks, attempted, wrong, correct, 
        unattempted, finalScore, efficiency, totalPenalty, marksPerCorrect 
    };
}

// 5. PDF GENERATION ENGINE
async function downloadPDF() {
    const data = calculateScore();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const reportType = document.getElementById('reportType').value;
    const student = (document.getElementById('studentName').value || "CANDIDATE").toUpperCase();
    const test = (document.getElementById('testName').value || "ASSESSMENT").toUpperCase();

    // Header
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("STRATEGIC PERFORMANCE E7 Report", 105, 22, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(0, 242, 255);
    doc.text("OFFICIAL REPORT | POWERED BY ECLIPSE7 AI | FOUNDER: SAIPRASAD BARURE", 105, 32, { align: "center" });

    // Table
    doc.autoTable({
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
        body: [
            ['STUDENT IDENTITY', student],
            ['ASSESSMENT TAG', test],
            ['TOTAL QUESTIONS', data.totalQs],
            ['MAXIMUM MARKS', data.maxMarks],
            ['VERIFIED CORRECT', data.correct],
            ['IDENTIFIED ERRORS', data.wrong],
            ['PENALTY (NEGATIVE)', `- ${data.totalPenalty.toFixed(2)}`],
            ['FINAL SCORE', data.finalScore.toFixed(2)],
            ['EFFICIENCY', `${data.efficiency}%`]
        ],
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    // Accuracy Bars
    const metrics = [
        { label: `Accuracy (${data.correct})`, val: data.correct, color: [34, 197, 94] }, 
        { label: `Errors (${data.wrong})`, val: data.wrong, color: [239, 68, 68] }
    ];

    metrics.forEach(m => {
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.text(m.label, 20, currentY + 3);
        const barWidth = data.totalQs > 0 ? (m.val / data.totalQs) * 100 : 0;
        doc.setFillColor(m.color[0], m.color[1], m.color[2]);
        doc.rect(60, currentY, Math.max(barWidth, 2), 3, 'F');
        currentY += 8;
    });

    // Signature & Stamp
    doc.setTextColor(30, 41, 59);
    doc.text("MR. PRASAD REDDY", 20, 270);
    doc.text("Founder & CEO, ECLIPSE7", 20, 274);

    const stampUrl = "https://eclipse7-pixal.github.io/marking-calculator/stamp.png";
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = stampUrl;
    img.onload = function() {
        doc.addImage(img, 'PNG', 155, 252, 38, 38);
        doc.save(`${student}_E7_Report.pdf`);
    };
    img.onerror = () => doc.save(`${student}_E7_Report.pdf`);
}
