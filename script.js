// --- STAGE 1: SECURE UI INITIALIZATION ---
/**
 * Advanced Dropdown Controller: Links custom UI to hidden data inputs.
 * Ensures that changes in Ratio or Mode trigger an immediate score update.
 */
function initDropdown(containerId, triggerId, panelId, hiddenInputId, callback) {
    const container = document.getElementById(containerId);
    const trigger = document.getElementById(triggerId);
    const panel = document.getElementById(panelId);
    const hidden = document.getElementById(hiddenInputId);
    
    if (!container || !trigger || !panel || !hidden) return;

    const options = panel.querySelectorAll('.option-item');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents immediate closing
        panel.classList.toggle('show');
        container.classList.toggle('active');
    });

    options.forEach(item => {
        item.addEventListener('click', () => {
            // Update Visuals and Data
            trigger.textContent = item.textContent;
            hidden.value = item.getAttribute('data-value');
            
            // Close Panel
            panel.classList.remove('show');
            container.classList.remove('active');
            
            // Execute Linked Actions
            calculateScore(); 
            if (callback) callback();
        });
    });

    // Global listener to close dropdowns when clicking away
    window.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            panel.classList.remove('show');
            container.classList.remove('active');
        }
    });
}

// Deploying UI Listeners
initDropdown('customSelect', 'selectedLabel', 'selectOptions', 'reportType', toggleSubjectInputs);
initDropdown('ratioSelectContainer', 'ratioLabel', 'ratioOptions', 'markingRatio', calculateScore);

function toggleSubjectInputs() {
    const type = document.getElementById('reportType').value;
    const section = document.getElementById('subjectSection');
    if (section) {
        section.style.display = (type === 'subjectwise') ? 'block' : 'none';
    }
}

// --- STAGE 2: PRECISION CALCULATION ENGINE ---
/**
 * Mathematical core for Eclipse7.
 * Calculates net score using dynamic penalty ratios.
 */
function calculateScore() {
    // Basic Params
    const totalQs = parseFloat(document.getElementById('totalQs').value) || 0;
    const maxMarks = parseFloat(document.getElementById('maxMarks').value) || 0;
    const attempted = parseFloat(document.getElementById('attempted').value) || 0;
    const wrong = parseFloat(document.getElementById('wrong').value) || 0;
    const ratio = parseFloat(document.getElementById('markingRatio').value) || 0;
    
    // Safety check to avoid division by zero
    if (totalQs <= 0) {
        if(document.getElementById('score')) document.getElementById('score').innerText = "0.00";
        return { totalQs: 0, finalScore: 0 };
    }

    // Logic Execution
    const correct = Math.max(0, attempted - wrong);
    const unattempted = Math.max(0, totalQs - attempted);
    const marksPerQ = maxMarks / totalQs;
    const penaltyPerQ = marksPerQ * ratio;
    const totalPenalty = wrong * penaltyPerQ; 
    
    const finalScore = (correct * marksPerQ) - totalPenalty;
    const efficiency = maxMarks > 0 ? ((finalScore / maxMarks) * 100).toFixed(2) : 0;

    // Live UI Update
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = finalScore.toFixed(2);
    }
    
    return { 
        totalQs, maxMarks, attempted, wrong, correct, 
        unattempted, finalScore, efficiency, totalPenalty, marksPerQ, ratio 
    };
}

// --- STAGE 3: E7 INTELLIGENCE PDF EXPORTER ---
/**
 * Generates a formal performance dossier for the student.
 */
async function downloadPDF() {
    // Verify jspdf availability
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        alert("CRITICAL: PDF Library not detected. Please ensure CDN links are in the HTML head.");
        return;
    }

    const doc = new jsPDF();
    const data = calculateScore(); // Ensure we have the freshest calculations
    
    // Identity Parsing
    const student = (document.getElementById('studentName').value || "ANONYMOUS CANDIDATE").toUpperCase();
    const test = (document.getElementById('testName').value || "GENERAL ASSESSMENT").toUpperCase();
    const reportType = document.getElementById('reportType').value;

    // --- Header Construction ---
    doc.setFillColor(15, 23, 42); // Deep Slate
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("STRATEGIC PERFORMANCE E7 DOSSIER", 105, 22, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(0, 242, 255); // Cyan branding
    doc.text("OFFICIAL INTELLIGENCE REPORT | FOUNDER: SAIPRASAD BARURE", 105, 32, { align: "center" });

    // --- Core Data Matrix ---
    doc.autoTable({
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], fontSize: 9 },
        styles: { cellPadding: 3, fontSize: 9 },
        body: [
            ['STUDENT IDENTITY', student],
            ['ASSESSMENT TAG', test],
            ['VERIFIED CORRECT', data.correct],
            ['IDENTIFIED ERRORS', data.wrong],
            ['FINAL AGGREGATE', data.finalScore.toFixed(2)],
            ['ACCURACY EFFICIENCY', `${data.efficiency}%`]
        ],
    });

    let currentY = doc.lastAutoTable.finalY + 15;

    // --- Conditional Subject Breakdown ---
    if (reportType === 'subjectwise') {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.text("SUBJECT-LEVEL PERFORMANCE DATA", 14, currentY);
        currentY += 10;

        const subjects = [
            { id: 'phy', name: 'PHYSICS' },
            { id: 'chem', name: 'CHEMISTRY' },
            { id: 'mathBio', name: 'MATH / BIOLOGY' }
        ];

        subjects.forEach(sub => {
            const t = parseInt(document.getElementById(`${sub.id}A`).value) || 0;
            const c = parseInt(document.getElementById(`${sub.id}C`).value) || 0;
            const w = parseInt(document.getElementById(`${sub.id}W`).value) || 0;

            if (t > 0) {
                doc.setFontSize(9);
                doc.setTextColor(80);
                doc.text(`${sub.name}: ${c} Correct | ${w} Wrong | ${t} Total Q.`, 14, currentY);
                currentY += 8;
            }
        });
    }

    // --- Footer & CEO Authentication ---
    const footerY = 265;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text("MR. PRASAD REDDY", 14, footerY);
    doc.setFontSize(8);
    doc.text("Founder & CEO, ECLIPSE7", 14, footerY + 5);

    // Official Stamp Integration
    const stampUrl = "https://eclipse7-pixal.github.io/marking-calculator/stamp.png";
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = stampUrl;

    img.onload = () => {
        doc.addImage(img, 'PNG', 155, 245, 40, 40);
        doc.save(`${student}_E7_Report.pdf`);
    };
    img.onerror = () => {
        // Fallback: Save PDF even if image fails to load
        doc.save(`${student}_E7_Report.pdf`);
    };
}
