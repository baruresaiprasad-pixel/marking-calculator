// --- 1. THE ANIMATION ENGINE ---
function toggleSubjectInputs() {
    const section = document.getElementById('subjectSection');
    const isSubjectWise = document.getElementById('reportType').value === 'subjectwise';
    
    if(isSubjectWise) {
        section.style.display = 'block';
        gsap.fromTo(".item-row", { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 });
    } else {
        section.style.display = 'none';
    }
}

function animateScore(targetValue, maxMarks) {
    let obj = { value: 0 };
    gsap.to(obj, {
        value: targetValue,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
            document.getElementById('score').innerText = obj.value.toFixed(2);
        }
    });

    const percentage = maxMarks > 0 ? (targetValue / maxMarks) * 100 : 0;
    gsap.to("#progress", { width: `${Math.min(100, Math.max(0, percentage))}%`, duration: 1.5 });
}

// --- 2. CORE LOGIC (Restored from Original) ---
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

    return { 
        totalQs, maxMarks, attempted, wrong, correct, 
        unattempted, finalScore, efficiency, totalPenalty, marksPerCorrect 
    };
}

function executeCalculation() {
    const data = calculateScore();
    animateScore(data.finalScore, data.maxMarks);
}

// --- 3. PDF GENERATION (Restored Original with Stamp) ---
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = calculateScore();
    const student = (document.getElementById('studentName').value || "CANDIDATE").toUpperCase();
    const test = (document.getElementById('testName').value || "ASSESSMENT TAG").toUpperCase();

    // Header logic from your original code
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("STRATEGIC PERFORMANCE E7 Report", 105, 22, { align: "center" });
    
    // AutoTable Body from original
    doc.autoTable({
        startY: 45,
        theme: 'grid',
        body: [
            ['STUDENT IDENTITY', student],
            ['ASSESSMENT TAG', test],
            ['FINAL AGGREGATE SCORE', data.finalScore.toFixed(2)],
            ['EFFICIENCY RATING', `${data.efficiency}%`]
        ],
    });

    // Original Signature & Stamp Logic
    const footerY = 270;
    doc.setTextColor(30, 41, 59);
    doc.text("MR. PRASAD REDDY", 20, footerY);
    doc.text("Founder & CEO, ECLIPSE7", 20, footerY + 4);

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
