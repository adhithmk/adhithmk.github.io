// Background Animation with Particle System and Waves
let particlesCanvas;
let particlesCtx;
let particles = [];
let wavesCanvas;
let wavesCtx;
const particleCount = 100;
const maxParticleSize = 3;
const particleSpeed = 2;
const waveCount = 3;
const waveWidth = 1000;
const waveHeight = 200;

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Get canvas elements
    particlesCanvas = document.querySelector('.particles');
    wavesCanvas = document.querySelector('.waves');
    
    if (!particlesCanvas || !wavesCanvas) {
        console.error('Canvas elements not found');
        return;
    }

    // Initialize canvas
    particlesCtx = particlesCanvas.getContext('2d');
    wavesCtx = wavesCanvas.getContext('2d');
    
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    wavesCanvas.width = window.innerWidth;
    wavesCanvas.height = window.innerHeight;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Start animation loop
    animate();

    // Add mouse movement listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
}

// Particle class
function Particle() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.random() * maxParticleSize + 1;
    this.speedX = Math.random() * particleSpeed - particleSpeed / 2;
    this.speedY = Math.random() * particleSpeed - particleSpeed / 2;
    this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
}

// Update particle position
Particle.prototype.update = function() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around edges
    if (this.x > window.innerWidth) this.x = 0;
    if (this.x < 0) this.x = window.innerWidth;
    if (this.y > window.innerHeight) this.y = 0;
    if (this.y < 0) this.y = window.innerHeight;

    // Update speed based on mouse position
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
        const force = (100 - distance) / 100;
        this.speedX += dx * force * 0.01;
        this.speedY += dy * force * 0.01;
    }
}

// Draw particle
Particle.prototype.draw = function() {
    particlesCtx.beginPath();
    particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particlesCtx.fillStyle = this.color;
    particlesCtx.fill();
}

// Draw waves
function drawWaves() {
    wavesCtx.clearRect(0, 0, wavesCanvas.width, wavesCanvas.height);
    
    for (let i = 0; i < waveCount; i++) {
        wavesCtx.beginPath();
        
        let x = 0;
        let y = window.innerHeight - (i * waveHeight);
        
        wavesCtx.moveTo(x, y);
        
        for (let j = 0; j < window.innerWidth; j += 10) {
            const waveOffset = Math.sin((x + waveOffsetValues[i]) / 100) * 20;
            wavesCtx.lineTo(x, y + waveOffset);
            x += 10;
        }
        
        wavesCtx.strokeStyle = `rgba(255, 255, 255, ${0.1 + (i * 0.05)})`;
        wavesCtx.lineWidth = 2;
        wavesCtx.stroke();
    }
}

// Animation loop
function animate() {
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawWaves();

    requestAnimationFrame(animate);
}

// Handle mouse movement
let mouseX = 0;
let mouseY = 0;
let waveOffsetValues = Array(waveCount).fill(0);

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update wave offsets based on mouse position
    waveOffsetValues = waveOffsetValues.map((offset, i) => {
        return offset + (mouseX / 1000) + (i * 2);
    });
}

// Handle window resize
function resizeCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    wavesCanvas.width = window.innerWidth;
    wavesCanvas.height = window.innerHeight;
    
    particles.forEach(particle => {
        particle.x = Math.random() * window.innerWidth;
        particle.y = Math.random() * window.innerHeight;
    });
}
