/**
 * Illuminative Particle Cursor Effect for Ecological Informatics Website
 * Using GSAP for smooth, high-performance animations
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing illuminative particle cursor effect');
  
  // Create cursor container
  const cursorContainer = document.createElement('div');
  cursorContainer.className = 'cursor-container';
  document.body.appendChild(cursorContainer);
  
  // Particle configuration
  const config = {
    particleCount: 40,           // More particles for a denser effect
    particleColors: [
      '#7fffbf', // Light green
      '#64ffb1', // Slightly darker green
      '#4cf9d9', // Teal
      '#38ebf3', // Light cyan
      '#2bd9ff', // Light blue
    ],
    particleMinSize: 2,         // Minimum particle size
    particleMaxSize: 8,         // Maximum particle size
    attractionRadius: 180,      // How far particles can be attracted from
    attractionForce: 0.12,      // How strongly particles are attracted
    particleSpeed: 0.025,        // Base speed of particle movement
    randomMotion: 0.2,          // Amount of random motion
    particleGlow: 5,           // Glow strength (in px)
    spawnDistance: 120          // Distance from cursor to spawn particles
  };
  
  // Setup styles
  const style = document.createElement('style');
  style.textContent = `
    .cursor-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    
    .illuminate-particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
      filter: blur(1.5px);
      box-shadow: 0 0 var(--glow) var(--color);
      background-color: var(--color);
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    }
  `;
  
  document.head.appendChild(style);
  
  // Mouse position tracking
  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    prevX: window.innerWidth / 2,
    prevY: window.innerHeight / 2,
    isMoving: false,
    velocity: { x: 0, y: 0 }
  };
  
  // Timeout for motion detection
  let moveTimeout;
  
  // Particles array
  const particles = [];
  
  // Initialize particles
  function createParticles() {
    for (let i = 0; i < config.particleCount; i++) {
      // Create DOM element
      const particle = document.createElement('div');
      particle.className = 'illuminate-particle';
      
      // Color from our green-blue gradient
      const colorIndex = Math.floor(Math.random() * config.particleColors.length);
      const color = config.particleColors[colorIndex];
      
      // Random size
      const size = config.particleMinSize + Math.random() * (config.particleMaxSize - config.particleMinSize);
      
      // Set inline styles
      particle.style.setProperty('--color', color);
      particle.style.setProperty('--glow', `${config.particleGlow + Math.random() * 3}px`);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Add to container
      cursorContainer.appendChild(particle);
      
      // Calculate random position around the screen
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Store particle data
      particles.push({
        element: particle,
        x: x,
        y: y,
        size: size,
        color: color,
        vx: 0,
        vy: 0,
        opacity: 0,
        targetOpacity: 0,
        energy: 0.5 + Math.random() * 0.5 // Energy level affects behavior
      });
      
      // Initial position
      gsap.set(particle, {
        x: x,
        y: y,
        opacity: 0
      });
    }
  }
  
  // Update mouse position and calculate velocity
  document.addEventListener('mousemove', function(e) {
    // Store previous position
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    
    // Update current position
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Calculate velocity
    mouse.velocity.x = mouse.x - mouse.prevX;
    mouse.velocity.y = mouse.y - mouse.prevY;
    
    // Set moving flag
    mouse.isMoving = true;
    
    // Create new particles occasionally when moving
    if (Math.random() < 0.25) {
      spawnParticleNearCursor();
    }
    
    // Reset the movement timeout
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      mouse.isMoving = false;
      mouse.velocity.x = 0;
      mouse.velocity.y = 0;
    }, 100);
  });
  
  // Spawn a particle near the cursor
  function spawnParticleNearCursor() {
    // Find an inactive particle
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].targetOpacity === 0) {
        const p = particles[i];
        
        // Random angle
        const angle = Math.random() * Math.PI * 2;
        
        // Random distance from cursor (within spawn distance)
        const distance = Math.random() * config.spawnDistance;
        
        // Calculate new position
        p.x = mouse.x + Math.cos(angle) * distance;
        p.y = mouse.y + Math.sin(angle) * distance;
        
        // Initial velocity away from cursor
        p.vx = Math.cos(angle) * 2 * p.energy;
        p.vy = Math.sin(angle) * 2 * p.energy;
        
        // Make particle visible
        p.targetOpacity = 0.6 + Math.random() * 0.4; // Random opacity
        
        // Animate to new position and opacity
        gsap.to(p.element, {
          x: p.x,
          y: p.y,
          opacity: p.targetOpacity,
          duration: 0.2 + Math.random() * 0.2,
          ease: 'power2.out'
        });
        
        // Only spawn one particle at a time
        break;
      }
    }
  }
  
  // Animation loop
  function animate() {
    // Update each particle
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Skip invisible particles
      if (p.targetOpacity === 0 && p.opacity < 0.1) continue;
      
      // Calculate distance from cursor
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Different behavior based on cursor movement
      if (mouse.isMoving) {
        // When moving: particles should scatter slightly
        if (distance < config.attractionRadius) {
          // Add some repulsion when cursor is moving
          p.vx -= (dx / distance) * config.attractionForce * 0.5 * p.energy;
          p.vy -= (dy / distance) * config.attractionForce * 0.5 * p.energy;
          
          // Add influence from cursor velocity
          p.vx += mouse.velocity.x * 0.05 * p.energy;
          p.vy += mouse.velocity.y * 0.05 * p.energy;
        }
      } else {
        // When stationary: particles should be attracted
        if (distance < config.attractionRadius) {
          // Add attraction force
          p.vx += (dx / distance) * config.attractionForce * p.energy;
          p.vy += (dy / distance) * config.attractionForce * p.energy;
          
          // Increase opacity when close to cursor
          p.targetOpacity = Math.min(0.8, p.targetOpacity + 0.02);
          
          // Add subtle pulsing by modifying the size
          const pulseFactor = 1 + Math.sin(Date.now() * 0.005 * p.energy) * 0.1;
          p.element.style.width = `${p.size * pulseFactor}px`;
          p.element.style.height = `${p.size * pulseFactor}px`;
        } else {
          // Gradually reduce opacity when far from cursor
          p.targetOpacity = Math.max(0, p.targetOpacity - 0.01);
        }
      }
      
      // Add random motion
      p.vx += (Math.random() - 0.5) * config.randomMotion * p.energy;
      p.vy += (Math.random() - 0.5) * config.randomMotion * p.energy;
      
      // Apply friction to slow particles
      p.vx *= 0.95;
      p.vy *= 0.95;
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Gradually move opacity toward target
      p.opacity += (p.targetOpacity - p.opacity) * 0.1;
      
      // Handle offscreen particles
      if (p.x < -50 || p.x > window.innerWidth + 50 ||
          p.y < -50 || p.y > window.innerHeight + 50) {
        
        // Reset offscreen particles
        p.targetOpacity = 0;
        p.opacity = 0;
        
        // Update immediately so they're not visible
        gsap.set(p.element, {
          opacity: 0
        });
        
        continue;
      }
      
      // Update particle DOM element
      gsap.to(p.element, {
        x: p.x,
        y: p.y,
        opacity: p.opacity,
        duration: 0.15 + Math.random() * 0.1
      });
    }
    
    // If not moving and not enough visible particles, spawn new ones
    if (!mouse.isMoving) {
      let visibleCount = 0;
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].opacity > 0.1) visibleCount++;
      }
      
      if (visibleCount < 15 && Math.random() < 0.15) {
        spawnParticleNearCursor();
      }
    }
    
    // Continue animation
    requestAnimationFrame(animate);
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    // Particles will adjust automatically on next frame
  });
  
  // Start the effect
  createParticles();
  animate();
  
  // When mouse leaves the window, fade out particles
  document.addEventListener('mouseout', function(e) {
    if (e.relatedTarget === null) {
      particles.forEach(p => {
        p.targetOpacity = 0;
      });
    }
  });
  
  console.log('Illuminative cursor effect initialized');
});

// Backup initialization
window.addEventListener('load', function() {
  if (!document.querySelector('.cursor-container')) {
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
  }
});
