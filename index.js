const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    document.querySelector(".bg-overlay:not(.children)").style.background =
        `radial-gradient(circle at ${x}px ${y}px,
        rgba(0,212,255,0.25),
        rgba(0,0,0,0.70) 30%)`;
});
let particles = [];

for (let i = 0; i < 100; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5),
        speedY: (Math.random() - 0.5)
    });
}

function drawLine(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
        ctx.strokeStyle = 'rgba(0,212,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        // interação com mouse
        if (mouse.x && mouse.y) {
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                p.x += dx * 0.02;
                p.y += dy * 0.02;
            }
        }

        ctx.beginPath();
        let gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
        gradient.addColorStop(0, '#00D4FF');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // conexões
        for (let j = i + 1; j < particles.length; j++) {
            drawLine(p, particles[j]);
        }
    });

    requestAnimationFrame(animate);
}

animate();

// PARALLAX
// window.addEventListener('scroll', () => {
//     const scroll = window.scrollY;
//     document.querySelector('.hero-bg').style.transform = `scale(1.15) translateY(${scroll * -0.3}px)`;
// });

function scrollToProjetos() {
    document.getElementById("projetos").scrollIntoView({
        behavior: "smooth"
    });
}

document.querySelectorAll('.card.projeto').forEach(card => {

    const inner = card.querySelector('.card-inner');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        inner.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.05)
        `;
    });

    card.addEventListener('mouseleave', () => {
        inner.style.transform = `rotateX(0) rotateY(0) scale(1)`;
    });

});

function scrollMobile() {
    const screenCenter = window.innerHeight / 2;
    const cardsproj = document.querySelectorAll('.card.projeto');
    const cards = document.querySelectorAll('.card:not(.projeto)');

    cardsproj.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;

        const distance = Math.abs(screenCenter - cardCenter);

        if (distance < 150) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;

        const distance = Math.abs(screenCenter - cardCenter);

        if (distance < 60) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

function handleMobileEffects() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const cardsproj = document.querySelectorAll('.card.projeto');
    const cards = document.querySelectorAll('.card:not(.projeto)');

    if (isMobile) {
        window.addEventListener('scroll', scrollMobile);
    } else {
        window.removeEventListener('scroll', scrollMobile);
        cardsproj.forEach(card => card.classList.remove('active'));
        cards.forEach(card => card.classList.remove('active'));
    }
}

handleMobileEffects();
window.addEventListener('resize', handleMobileEffects);