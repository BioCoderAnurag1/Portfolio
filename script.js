// Portfolio bootstrap: tab nav, reveal animation, canvas simulations
document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.remove("no-js");
    lucide.createIcons();
    initTabNavigation();
    initRevealOnActive();
    initRevealContacts();
    initBackToTop();
    initSimulations();
});

// --- Tab navigation ---
function initTabNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
    navLinks.forEach(link => link.addEventListener("click", e => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active-section"));
        link.classList.add("active");
        const target = document.getElementById(link.getAttribute("href").slice(1));
        if (!target) return;
        target.classList.add("active-section");
        window.scrollTo({ top: 0, behavior: "smooth" });
        triggerCanvasResize();
        revealSection(target);
    }));
}

const triggerCanvasResize = () => window.dispatchEvent(new Event("resize"));

// --- Staggered reveal ---
const REVEAL_SELECTOR = [
    ".interest-card", ".project-card", ".skill-category-card", ".about-tag",
    ".cert-item", ".lab-item", ".tool-item", ".about-tag-group",
    ".summary-divider", ".attribute-card"
].join(", ");

function initRevealOnActive() {
    document.querySelectorAll(".content-section").forEach(s =>
        s.querySelectorAll(REVEAL_SELECTOR).forEach(el => el.classList.add("reveal"))
    );
    const active = document.querySelector(".content-section.active-section");
    if (active) requestAnimationFrame(() => revealSection(active));
}

function revealSection(section) {
    if (!section) return;
    section.querySelectorAll(".reveal").forEach((el, i) => {
        el.classList.remove("is-visible");
        el.style.animationDelay = "";
        el.style.animationDelay = `${Math.min(i, 8) * 50}ms`;
        void el.offsetWidth; // reflow to restart animation
        el.classList.add("is-visible");
    });
}

// --- Reveal/hide contact info (email & phone) ---
function initRevealContacts() {
    document.querySelectorAll(".contact-link[data-reveal]").forEach(link => {
        const toggle = e => {
            // Don't toggle when modifier keys are pressed or it's a real-link click
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            link.classList.toggle("is-shown");
            lucide.createIcons();
        };
        link.addEventListener("click", toggle);
        link.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(e); }
        });
    });
}

// --- Back to top ---
function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;
    const update = () => btn.classList.toggle("hidden", window.scrollY < 320);
    window.addEventListener("scroll", update, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    update();
}

// --- Canvas simulations ---
function initSimulations() {
    initProteinCanvas();
    initNetworkCanvas();
    initDockingCanvas();
}

function setupCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    let w, h;
    function resize() {
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * devicePixelRatio;
        canvas.height = h * devicePixelRatio;
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();
    return { ctx, w: () => w, h: () => h };
}

// 1) Protein structure — minimalist rotating backbone
function initProteinCanvas() {
    const canvas = document.getElementById("protein-canvas");
    if (!canvas) return;
    const { ctx, w, h } = setupCanvas(canvas);

    const N = 65;
    const pts = [];
    for (let i = 0; i < N; i++) {
        const t = (i / 8) * Math.PI * 2;
        pts.push({
            x: Math.sin(t) * 32 + Math.cos(i / 15) * 12,
            y: (i - N / 2) * 2.6,
            z: Math.cos(t) * 32 + Math.sin(i / 15) * 12,
            c: i % 2 === 0 ? "rgba(59,130,246,.8)" : "rgba(161,161,170,.8)"
        });
    }

    let ay = 0.008, ax = 0.003;
    const mouse = { x: 0, y: 0, on: false };
    canvas.addEventListener("mousemove", e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    });
    canvas.addEventListener("mouseleave", () => mouse.on = false);

    (function frame() {
        const W = w(), H = h();
        ctx.clearRect(0, 0, W, H);
        let cy = ay, cx = ax;
        if (mouse.on) { cy = (mouse.x - W / 2) * .0001; cx = (mouse.y - H / 2) * .0001; }
        else { ay += .004; ax += .001; }

        const proj = pts.map(p => {
            const x1 = p.x * Math.cos(cy) - p.z * Math.sin(cy);
            const z1 = p.z * Math.cos(cy) + p.x * Math.sin(cy);
            const y2 = p.y * Math.cos(cx) - z1 * Math.sin(cx);
            const z2 = z1 * Math.cos(cx) + p.y * Math.sin(cx);
            const s = 160 / (160 + z2);
            return { x: W / 2 + x1 * s, y: H / 2 + y2 * s, z: z2, c: p.c };
        });

        for (let i = 0; i < proj.length - 1; i++) {
            ctx.strokeStyle = "rgba(161,161,170,.25)";
            ctx.lineWidth = Math.max(.5, 1.5 * (120 / (160 + proj[i].z)));
            ctx.beginPath();
            ctx.moveTo(proj[i].x, proj[i].y);
            ctx.lineTo(proj[i + 1].x, proj[i + 1].y);
            ctx.stroke();
        }
        proj.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(1, 3.5 * (120 / (160 + p.z))), 0, Math.PI * 2);
            ctx.fillStyle = p.c;
            ctx.fill();
        });
        requestAnimationFrame(frame);
    })();
}

// 2) Protein interaction network — minimalist drifting nodes
function initNetworkCanvas() {
    const canvas = document.getElementById("network-canvas");
    if (!canvas) return;
    const { ctx, w, h } = setupCanvas(canvas);

    const nodes = [
        { x: 40,  y: 35,  vx: .1,  vy: -.08, r: 6, c: "#71717a", l: "STAT3" },
        { x: 120, y: 70,  vx: -.08, vy: .12, r: 8, c: "#3b82f6", l: "JAK2" },
        { x: 70,  y: 110, vx: .12, vy: -.1, r: 8, c: "#71717a", l: "EGFR" },
        { x: 180, y: 50,  vx: -.09, vy: -.09, r: 6, c: "#71717a", l: "AKT1" },
        { x: 170, y: 115, vx: .06, vy: .12, r: 7, c: "#71717a", l: "mTOR" },
        { x: 100, y: 30,  vx: -.1,  vy: .1,  r: 9, c: "#a1a1aa", l: "TP53" }
    ];
    const edges = [[0,1],[1,2],[2,5],[0,5],[1,3],[3,4],[2,3]];
    let hover = null;

    canvas.addEventListener("mousemove", e => {
        const r = canvas.getBoundingClientRect();
        const mx = e.clientX - r.left, my = e.clientY - r.top;
        hover = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.r + 6) || null;
    });
    canvas.addEventListener("mouseleave", () => hover = null);

    (function frame() {
        const W = w(), H = h();
        ctx.clearRect(0, 0, W, H);

        nodes.forEach(n => {
            n.x += n.vx; n.y += n.vy;
            if (n.x < n.r || n.x > W - n.r) n.vx *= -1;
            if (n.y < n.r || n.y > H - n.r) n.vy *= -1;
            n.x = Math.max(n.r, Math.min(W - n.r, n.x));
            n.y = Math.max(n.r, Math.min(H - n.r, n.y));
        });

        edges.forEach(([a, b]) => {
            const s = nodes[a], t = nodes[b];
            const hi = hover && (hover === s || hover === t);
            ctx.strokeStyle = hi ? "rgba(59,130,246,.7)" : "rgba(63,63,70,.3)";
            ctx.lineWidth = hi ? 1.5 : .8;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(t.x, t.y);
            ctx.stroke();
        });

        nodes.forEach(n => {
            const hi = hover && hover === n;
            if (hi) {
                ctx.strokeStyle = "rgba(59,130,246,.4)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.fillStyle = hi ? "#3b82f6" : n.c;
            ctx.strokeStyle = "#1e1e22";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = hi ? "#f4f4f5" : "#a1a1aa";
            ctx.font = hi ? "500 9px Inter" : "9px Inter";
            ctx.textAlign = "center";
            ctx.fillText(n.l, n.x, n.y + n.r + 10);
        });
        requestAnimationFrame(frame);
    })();
}

// 3) Molecular docking — minimalist pocket + ligand
function initDockingCanvas() {
    const canvas = document.getElementById("docking-canvas");
    if (!canvas) return;
    const { ctx, w, h } = setupCanvas(canvas);

    const pocket = { x: 110, y: 65, r: 20 };
    const ligand = { x: 30, y: 40, tx: 30, ty: 40, r: 5 };
    let affinity = 0, docked = false, progress = 0;
    const on = { x: 0, y: 0, active: false };

    canvas.addEventListener("mousemove", e => {
        const r = canvas.getBoundingClientRect();
        on.x = e.clientX - r.left; on.y = e.clientY - r.top; on.active = true;
        ligand.tx = on.x; ligand.ty = on.y;
    });
    canvas.addEventListener("mouseleave", () => { on.active = false; ligand.tx = 35; ligand.ty = 40; });

    (function frame() {
        const W = w(), H = h();
        ctx.clearRect(0, 0, W, H);

        // Search space
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "rgba(161,161,170,.25)";
        ctx.strokeRect(pocket.x - 24, pocket.y - 24, 48, 48);
        ctx.setLineDash([]);

        // Receptor blob
        ctx.beginPath();
        ctx.moveTo(pocket.x - 18, pocket.y - 35);
        ctx.quadraticCurveTo(pocket.x - 4, pocket.y - 25, pocket.x - 10, pocket.y - 8);
        ctx.quadraticCurveTo(pocket.x - 26, pocket.y, pocket.x - 12, pocket.y + 12);
        ctx.quadraticCurveTo(pocket.x - 16, pocket.y + 32, pocket.x + 8, pocket.y + 35);
        ctx.quadraticCurveTo(pocket.x + 28, pocket.y + 16, pocket.x + 32, pocket.y + 4);
        ctx.quadraticCurveTo(pocket.x + 20, pocket.y - 12, pocket.x + 30, pocket.y - 28);
        ctx.quadraticCurveTo(pocket.x + 8, pocket.y - 38, pocket.x - 18, pocket.y - 35);
        ctx.closePath();
        ctx.fillStyle = "rgba(39,39,42,.4)";
        ctx.strokeStyle = "#3f3f46";
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#71717a";
        ctx.font = "9px Inter";
        ctx.fillText("Receptor", pocket.x - 18, pocket.y + 4);

        // Move ligand (easing)
        ligand.x += (ligand.tx - ligand.x) * .08;
        ligand.y += (ligand.ty - ligand.y) * .08;
        const dist = Math.hypot(ligand.x - pocket.x, ligand.y - pocket.y);

        if (dist < 12) {
            ligand.x = pocket.x; ligand.y = pocket.y;
            docked = true;
            if (progress < 100) progress += 2;
            affinity = -8.7;
            ctx.strokeStyle = "rgba(59,130,246,.8)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(pocket.x, pocket.y);
            ctx.lineTo(pocket.x - 10, pocket.y - 8);
            ctx.moveTo(pocket.x, pocket.y);
            ctx.lineTo(pocket.x + 8, pocket.y + 4);
            ctx.stroke();
        } else {
            docked = false;
            progress = Math.max(0, progress - 3);
            affinity = Math.max(0, -9.0 * (30 / (dist + 20)));
            if (Math.abs(affinity) < .1) affinity = 0;
        }

        // Ligand cluster
        const colors = ["#3b82f6", "#71717a", "#a1a1aa"];
        ctx.fillStyle = colors[0];
        ctx.beginPath(); ctx.arc(ligand.x, ligand.y, ligand.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = colors[1];
        ctx.beginPath(); ctx.arc(ligand.x - 5, ligand.y + 2, ligand.r - 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = colors[2];
        ctx.beginPath(); ctx.arc(ligand.x + 4, ligand.y - 3, ligand.r - 1, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(161,161,170,.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ligand.x, ligand.y); ctx.lineTo(ligand.x - 5, ligand.y + 2);
        ctx.moveTo(ligand.x, ligand.y); ctx.lineTo(ligand.x + 4, ligand.y - 3);
        ctx.stroke();

        // HUD
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "10px monospace";
        ctx.fillText(`BINDING AFFINITY: ${affinity.toFixed(1)} kcal/mol`, 10, H - 24);
        ctx.fillText(`DOCKING STATUS: ${docked ? 'SUCCESS (' + Math.round(progress) + '%)' : 'SEARCHING...'}`, 10, H - 12);
        requestAnimationFrame(frame);
    })();
}
