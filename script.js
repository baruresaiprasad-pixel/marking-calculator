// 1. UNIVERSAL DROPDOWN ENGINE WITH SYNC & PREFIX PRESERVATION
function initDropdown(containerId, triggerId, panelId, hiddenInputId, callback) {
    const container = document.getElementById(containerId);
    const trigger = document.getElementById(triggerId);
    const panel = document.getElementById(panelId);
    const hidden = document.getElementById(hiddenInputId);
    if (!container || !trigger || !panel) return;

    const options = panel.querySelectorAll('.option-item');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Sweep close competing operational interfaces
        document.querySelectorAll('.select-options').forEach(p => {
            if(p !== panel) p.classList.remove('show');
        });
        document.querySelectorAll('.custom-select').forEach(c => {
            if(c !== container) c.classList.remove('active');
        });

        panel.classList.toggle('show');
        container.classList.toggle('active');
    });

    options.forEach(item => {
        item.addEventListener('click', () => {
            const chosenVal = item.getAttribute('data-value');
            hidden.value = chosenVal;
            
            // Retain original styling context label layout if it demands structure
            if (containerId === 'ratioSelectContainer') {
                trigger.textContent = `Ratio: ${item.textContent.split(' ')[0]}`;
            } else {
                trigger.textContent = item.textContent;
            }

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

// 2. COMPLETE DOM READY BINDING MATRIX
document.addEventListener('DOMContentLoaded', () => {
    initDropdown('customSelect', 'selectedLabel', 'selectOptions', 'reportType', toggleSubjectInputs);
    initDropdown('ratioSelectContainer', 'ratioLabel', 'ratioOptions', 'markingRatio', null);
    
    // Trigger initial structural validation sequence
    toggleSubjectInputs();
});

function toggleSubjectInputs() {
    const type = document.getElementById('reportType').value;
    const section = document.getElementById('subjectSection');
    if (!section) return;

    // Fluid integration engine replacement for raw display switches
    if (type === 'subjectwise') {
        section.classList.add('visible');
    } else {
        section.classList.remove('visible');
    }
}

// 3. CORE ANALYTICAL CALCULATION ENGINE (CORE IMMUTED LOGIC)
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

// 4. ULTRA PRO MAX EXTRAORDINARY GRAPHICAL HUD PDF ENGINE
async function downloadPDF() {
    const data = calculateScore();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4'); 
    
    const reportType = document.getElementById('reportType').value;
    const student = (document.getElementById('studentName').value || "UNVERIFIED_CANDIDATE").toUpperCase();
    const test = (document.getElementById('testName').value || "CORE_ASSESSMENT_RUN").toUpperCase();
    const timestamp = new Date().toLocaleString().toUpperCase();

    // --- PHASE 1: MICRO-GRID BLUEPRINT BACKGROUND MATRIX ---
    doc.setFillColor(250, 252, 255); // Icy cyber canvas white tint
    doc.rect(0, 0, 210, 297, 'F');
    
    // Programmatic Engineering Grid Coordinates Accent Lines
    doc.setDrawColor(230, 238, 245);
    doc.setLineWidth(0.2);
    for (let i = 10; i < 210; i += 20) doc.line(i, 0, i, 297); // Vertical structural grids
    for (let j = 10; j < 297; j += 20) doc.line(0, j, 210, j); // Horizontal structural grids

    // --- PHASE 2: MILITARY INDUSTRIAL CORNER HUD TARGETING BRACKETS ---
    doc.setDrawColor(15, 23, 42); // Deep slate execution anchor lines
    doc.setLineWidth(0.8);
    // Top-Left Frame Unit
    doc.line(8, 8, 22, 8); doc.line(8, 8, 8, 22); doc.rect(8, 8, 2, 2, 'F');
    // Top-Right Frame Unit
    doc.line(202, 8, 188, 8); doc.line(202, 8, 202, 22); doc.rect(200, 8, 2, 2, 'F');
    // Bottom-Left Frame Unit
    doc.line(8, 289, 22, 289); doc.line(8, 289, 8, 275); doc.rect(8, 287, 2, 2, 'F');
    // Bottom-Right Frame Unit
    doc.line(202, 289, 188, 289); doc.line(202, 289, 202, 275); doc.rect(200, 287, 2, 2, 'F');

    // --- PHASE 3: ASYMMETRIC QUANTUM HEADER MATRIX ---
    doc.setFillColor(11, 8, 28); // Tactical Midnight Obsidian
    doc.rect(10, 10, 190, 32, 'F');
    
    // Integrated Neon Core Border Accent Blocks
    doc.setFillColor(0, 242, 255); // Cyan Neon Laser Block
    doc.rect(10, 42, 125, 1.5, 'F');
    doc.setFillColor(189, 0, 255); // Purple Neon Laser Block
    doc.rect(135, 42, 65, 1.5, 'F');

    // Header HUD Text Typography Layout
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("QUANTUM ENGINE INTELLIGENCE REPORT", 16, 22);
    
    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 242, 255);
    doc.text(`SYSTEM_STATUS: SECURE // EMISSION_BLOCK_ID: E7_V4.0_RUN_${Math.floor(1000+Math.random()*9000)}`, 16, 28);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("ECLIPSE7 ANALYSIS LABS ENGINE MATRIX // FOUNDER & OWNER: SAIPRASAD BARURE", 16, 36);

    // Dynamic Upper Right ID Stamp Box
    doc.setFillColor(24, 18, 54);
    doc.rect(155, 14, 40, 10, 'F');
    doc.setTextColor(189, 0, 255);
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.text("CORE INTEL", 162, 20);

    // --- PHASE 4: ASYMMETRIC SYSTEM METRIC CARDS GRID (TWO COLUMN HUD MODULES) ---
    let cardY = 50;
    
    // --- LEFT COLUMN CARD: IDENTITY MODULE ---
    doc.setFillColor(15, 23, 42); 
    doc.rect(10, cardY, 92, 6, 'F'); // Dark Badge Title Bar
    doc.setTextColor(0, 242, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(" SECURE ID TOKEN REGISTRY", 12, cardY + 4.2);
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.rect(10, cardY + 6, 92, 26, 'DF'); // White Pod Body Frame
    
    doc.setFont("helvetica", "bold"); doc.setTextColor(100, 116, 139); doc.setFontSize(7);
    doc.text("CANDIDATE INITIALS :", 14, cardY + 14);
    doc.text("TARGET MATRIX APP  :", 14, cardY + 22);
    doc.text("SYSTEM TIME STAMP  :", 14, cardY + 30);
    
    doc.setTextColor(15, 23, 42); doc.setFontSize(7.5);
    doc.text(student.length > 20 ? student.substring(0,20)+"..." : student, 46, cardY + 14);
    doc.text(test.length > 20 ? test.substring(0,20)+"..." : test, 46, cardY + 22);
    doc.setFont("courier", "bold"); doc.setFontSize(6.5);
    doc.text(timestamp, 46, cardY + 30);

    // --- RIGHT COLUMN CARD: COGNITIVE DATA PARAMETERS MODULE ---
    doc.setFillColor(15, 23, 42); 
    doc.rect(108, cardY, 92, 6, 'F'); // Dark Badge Title Bar
    doc.setTextColor(189, 0, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(" BASE STRUCTURE LOAD PARAMETERS", 110, cardY + 4.2);
    
    doc.setFillColor(255, 255, 255);
    doc.rect(108, cardY + 6, 92, 26, 'DF'); // White Pod Body Frame
    
    doc.setFont("helvetica", "bold"); doc.setTextColor(100, 116, 139); doc.setFontSize(7);
    doc.text("TOTAL ASSIGNED Q   :", 112, cardY + 13);
    doc.text("MAX ASSIGNED EVAL  :", 112, cardY + 19);
    doc.text("USER EVAL ATTEMPTS :", 112, cardY + 25);
    doc.text("VERIFIED FAULTS    :", 112, cardY + 31);
    
    doc.setTextColor(15, 23, 42); doc.setFontSize(7.5);
    doc.text(`${data.totalQs} ITEMS`, 148, cardY + 13);
    doc.text(`${data.maxMarks} MARKS`, 148, cardY + 19);
    doc.text(`${data.attempted} UNITS`, 148, cardY + 25);
    doc.setTextColor(239, 68, 68); // Soft Error Red
    doc.text(`${data.wrong} FAULTS`, 148, cardY + 31);

    // --- PHASE 5: THE GIANT HERO QUANTUM SCORE DISPLAY MODULE ---
    let scoreY = 88;
    doc.setFillColor(11, 8, 28); // Tactical deep dark frame block
    doc.rect(10, scoreY, 190, 26, 'F');
    
    // Grid Lines Layer inside Score Block for aesthetic complexity
    doc.setDrawColor(30, 27, 75);
    doc.setLineWidth(0.3);
    doc.line(65, scoreY, 65, scoreY + 26);
    doc.line(140, scoreY, 140, scoreY + 26);
    
    // Left Element Sub-Block (Computed Mark System Reads)
    doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    doc.text("COMPUTED REAL MARKS", 16, scoreY + 8);
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text(`${(data.correct * data.marksPerCorrect).toFixed(2)}`, 16, scoreY + 16);
    doc.setFontSize(6.5); doc.setTextColor(100, 116, 139);
    doc.text(`FROM ${data.correct} CORRECT ANSWERS`, 16, scoreY + 22);

    // Center Element Sub-Block (The Ultimate Grand Score Badge View)
    doc.setTextColor(0, 242, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
    doc.text("INTELLIGENCE ENGINE SCORE", 72, scoreY + 7);
    doc.setFont("courier", "bold"); doc.setFontSize(22);
    doc.text(`${data.finalScore.toFixed(2)}`, 72, scoreY + 18);
    doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(148, 163, 184);
    doc.text(`/ ${data.maxMarks} TOTAL ABSOLUTE LIMIT`, 72, scoreY + 23);

    // Right Element Sub-Block (Engine System Efficiency)
    doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    doc.text("ENGINE EFFICIENCY", 146, scoreY + 8);
    // Dynamic color shift based on efficiency tier
    if(data.efficiency >= 75) doc.setTextColor(52, 211, 153);
    else if(data.efficiency >= 45) doc.setTextColor(251, 191, 36);
    else doc.setTextColor(248, 113, 113);
    doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.text(`${data.efficiency}%`, 146, scoreY + 16);
    doc.setFontSize(6.5); doc.setTextColor(100, 116, 139);
    doc.text("SCALED PERFORMANCE VALUE", 146, scoreY + 22);

    // --- PHASE 6: PRO MAX SEGMENTED LED TELEMETRY METERS ---
    let meterY = 122;
    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.4);
    doc.line(10, meterY - 4, 200, meterY - 4);
    
    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.text("HARDWARE SIMULATION HUD METERS", 11, meterY);
    meterY += 6;

    const telemetryMeters = [
        { title: "ACCURACY TRACKER DISPATCH ARRAY", value: data.correct, max: data.totalQs || 1, color: [0, 242, 255] },
        { title: "PENALTY INFLICTED INCIDENCE MATRIX", value: data.wrong, max: data.totalQs || 1, color: [189, 0, 255] }
    ];

    telemetryMeters.forEach(meter => {
        doc.setFontSize(6.5); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 116, 139);
        doc.text(meter.title, 11, meterY + 3.5);

        // Render Premium High-Tech Segmented LED Layout Blocks instead of plain lines
        let totalLedSegments = 24;
        let activeLedSegments = Math.round((meter.value / meter.max) * totalLedSegments);
        let startX = 72;
        
        for(let s = 0; s < totalLedSegments; s++) {
            if(s < activeLedSegments) {
                doc.setFillColor(meter.color[0], meter.color[1], meter.color[2]); // Vibrant Active LED block
            } else {
                doc.setFillColor(235, 241, 247); // Darkened uncharged background tracking block
            }
            doc.rect(startX + (s * 5.2), meterY, 4.2, 4.5, 'F');
        }
        meterY += 8;
    });

    // --- PHASE 7: MODULAR SUBJECT MATRIX MODULES (TACTICAL BREAKDOWNS) ---
    if (reportType === 'subjectwise') {
        doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.4);
        doc.line(10, meterY - 1, 200, meterY - 1);
        
        doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
        doc.text("CROSS-SUBJECT ANALYTICS MODULE ENGINE", 11, meterY + 4);
        meterY += 9;

        const dynamicSubjects = [
            { name: 'PHYSICS SUBSYSTEM', keyA: 'phyA', keyC: 'phyC', keyW: 'phyW' },
            { name: 'CHEMISTRY SUBSYSTEM', keyA: 'chemA', keyC: 'chemC', keyW: 'chemW' },
            { name: 'MATH / BIO SUBSYSTEM', keyA: 'mathBioA', keyC: 'mathBioC', keyW: 'mathBioW' }
        ];

        dynamicSubjects.forEach(subjectItem => {
            const total = parseInt(document.getElementById(subjectItem.keyA).value) || 0;
            const corr = parseInt(document.getElementById(subjectItem.keyC).value) || 0;
            const wrng = parseInt(document.getElementById(subjectItem.keyW).value) || 0;

            doc.setFontSize(6.5); doc.setFont("helvetica", "bold"); doc.setTextColor(71, 85, 105);
            doc.text(subjectItem.name, 11, meterY + 3.5);

            if (total > 0) {
                // Compound Visual Stack Segment Processing Logic
                let segmentWidth = 125;
                let cWidth = (corr / total) * segmentWidth;
                let wWidth = (wrng / total) * segmentWidth;
                let unattemptedWidth = segmentWidth - (cWidth + wWidth);

                doc.setFillColor(52, 211, 153); // Emerald Success Correct Block
                if(cWidth > 0) doc.rect(72, meterY, cWidth, 4.5, 'F');
                
                doc.setFillColor(248, 113, 113); // Crimson Critical Error Wrong Block
                if(wWidth > 0) doc.rect(72 + cWidth, meterY, wWidth, 4.5, 'F');

                doc.setFillColor(203, 213, 225); // Muted Unattempted Remaining block
                if(unattemptedWidth > 0) doc.rect(72 + cWidth + wWidth, meterY, unattemptedWidth, 4.5, 'F');
                
                // Overlay explicit localized text breakdown string values inside tracking matrix
                doc.setFontSize(5.5); doc.setTextColor(30, 41, 59);
                doc.text(`[ OK: ${corr} | ERR: ${wrng} | IDLE: ${total - (corr+wrng)} ]`, 144 + 12, meterY - 1.5);
            } else {
                doc.setFont("helvetica", "oblique"); doc.setFontSize(6); doc.setTextColor(148, 163, 184);
                doc.text("CORE CHANNELS SHUT DOWN // DATA FEED UNINITIALIZED", 72, meterY + 3.2);
                doc.setFont("helvetica", "bold");
            }
            meterY += 8;
        } );
    }

    // --- PHASE 8: THE DARK GLOWING INTELLIGENCE TERMINAL ENGINE POD ---
    let terminalY = Math.max(meterY + 4, 152);
    
    doc.setFillColor(11, 8, 28); // Pure Deep Terminal Canvas Obsidian Block
    doc.rect(10, terminalY, 190, 38, 'F');
    
    // High Intensity Cyber Purple Vertical Alignment Core Bar
    doc.setFillColor(189, 0, 255);
    doc.rect(10, terminalY, 2.5, 38, 'F');

    doc.setTextColor(0, 242, 255); doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.text("AUTOMATED ALGORITHMIC SYSTEMS SYSTEM ADVICE MATRIX", 18, terminalY + 7);
    
    doc.setFont("courier", "normal"); doc.setFontSize(7.5); doc.setTextColor(241, 245, 249);

    let adviceStr = "";
    if (data.efficiency > 80) adviceStr = "EXCELLENT RESPONSE CONTEXT. MAXIMIZE SPEED METRICS TO LOCK ULTIMATE SCALING PEAKS.";
    else if (data.efficiency > 50) adviceStr = "STABLE INTERMEDIATE SYSTEM BASE. FILTER ANOMALIES TO BREAK THE 80% BARRIER LOOPS.";
    else adviceStr = "CONCEPTUAL FOUNDATION HOLES DISCOVERED. HALT RANDOM GUESS RUNS TO REMOVE PENALTY DECAY.";

    doc.text(`>> SYSTEM_STRATEGY : ${adviceStr}`, 16, terminalY + 16);
    doc.text(`>> PENALTY_LOGS   : LOSS METRIC TOTALS A VALUE OF ${data.totalPenalty.toFixed(2)} MARK LOSS OUTCOMES.`, 16, terminalY + 23);
    doc.text(`>> ARCHITECTURE   : REVIEW THE ${data.unattempted} UNATTEMPTED BLANK SIGNALS TO CONVERT QUICK GAINS.`, 16, terminalY + 30);

    // --- PHASE 9: AUTHENTICATED CORPORATE EXECUTIVE FOOTER SIGN-OFF ---
    const footerY = 255;
    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.4);
    doc.line(10, footerY - 4, 200, footerY - 4);

    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text("MR. PRASAD REDDY", 14, footerY + 4);
    
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(100, 116, 139);
    doc.text("Chief Executive Officer & Founder, ECLIPSE7 COGNITIVE CORE", 14, footerY + 9);
    
    doc.setFont("courier", "bold"); doc.setFontSize(7); doc.setTextColor(34, 197, 94); // High visibility emerald approval text
    doc.text("STATUS: SYSTEM_INTEGRITY_VERIFIED_AND_SIGNED_AUTHENTIC", 14, footerY + 14);
    
    doc.setFont("courier", "normal"); doc.setFontSize(6); doc.setTextColor(148, 163, 184);
    doc.text(`HASH_BLOCK: SECURE_MATRIX_E7_LOG_DATA_RECONSTRUCTION_${timestamp.replace(/ /g, "_")}`, 14, footerY + 21);

    // --- PHASE 10: SECURE ASYNC ARCHIVAL STAMP DEPLOYMENT CHANNEL ---
    const stampUrl = "https://eclipse7-pixal.github.io/marking-calculator/stamp.png";
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = stampUrl;
    
    img.onload = function() {
        // Render stamp beautifully aligned inside the targeting grid frames
        doc.addImage(img, 'PNG', 158, 245, 36, 36);
        doc.save(`${student}_E7_ULTRA_PRO_REPORT.pdf`);
    };
    img.onerror = () => {
        // Absolute fallback execution context channel if network assets reject cross-domain permissions
        doc.save(`${student}_E7_ULTRA_PRO_REPORT.pdf`);
    };
}
