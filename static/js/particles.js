// Particle system configuration
const particleConfig = {
    particleCount: 150,  // Increased count for more particles
    color: 'rgba(100, 180, 255, 0.25)', // Base color
    radius: 0.8, // Base size
    maxSpeed: 0.5,

    lineLength: 100,
    lineWidth: 0.4,
    glow: true, // Enable glow for better lighting
    languageEmojis: ['🐍', '🔠', '🔢', '🧮', '⚙️', '{', '}', '<>', '[]', '()', '#', '$', '💻']
};

// Particle class
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * particleConfig.maxSpeed * 1.5; // Increased speed
        this.vy = (Math.random() - 0.5) * particleConfig.maxSpeed * 1.5; // Increased speed

        this.radius = (Math.random() * 0.5 + 0.5) * particleConfig.radius;

        // Enhanced particle types
        this.particleType = Math.random();
        
        // Some particles have trails (shooting stars effect)
        this.hasTrail = Math.random() > 0.85;
        this.trailLength = this.hasTrail ? Math.random() * 40 + 15 : 0;
        
        // Determine particle style
        if (Math.random() > 0.5) { // Increased probability for Python particles
            // Programming language emoji particles
            this.isProgrammingEmoji = true;
            this.emoji = particleConfig.languageEmojis[Math.floor(Math.random() * particleConfig.languageEmojis.length)];
            this.size = Math.random() * 15 + 10; // Larger for emojis
            this.rotation = Math.random() * Math.PI * 2; // Random rotation
            this.rotationSpeed = (Math.random() - 0.5) * 0.01; // Slow rotation
            this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.4 + 0.2})`;
        } else if (Math.random() > 0.7) {
            // Language-specific colored particles
            this.isProgrammingColor = true;
            
            // Pick a language-specific color
            const languages = [
                {name: 'python', color: 'rgba(55, 118, 171, 0.6)'}, // Python blue
                {name: 'python', color: 'rgba(55, 118, 171, 0.6)'}, // Additional Python entry for higher probability
                {name: 'c', color: 'rgba(85, 85, 185, 0.6)'}, // C blue
                {name: 'cpp', color: 'rgba(0, 114, 178, 0.6)'}, // C++ blue
                {name: 'js', color: 'rgba(247, 223, 30, 0.6)'} // JavaScript yellow
            ];
            
            const lang = languages[Math.floor(Math.random() * languages.length)];
            this.language = lang.name;
            this.color = lang.color;
            this.radius = Math.random() * 3 + 2;
            this.pulseSpeed = Math.random() * 0.05 + 0.02;
            this.pulsePhase = Math.random() * Math.PI * 2;
        } else if (Math.random() > 0.97) {
            // Add occasional larger particles for blue planet effect
            this.isLargeParticle = true;
            this.radius = Math.random() * 25 + 10;
            this.color = `rgba(60, 100, 180, ${Math.random() * 0.3 + 0.2})`;
        } else if (this.particleType > 0.7) {
            // Brighter star particles
            this.color = `rgba(150, 200, 255, ${Math.random() * 0.4 + 0.2})`;
            this.radius *= 1.2;
        } else {
            this.color = particleConfig.color;
        }

        // Twinkle effect timing
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Update twinkle phase
        this.twinklePhase += this.twinkleSpeed;
        if (this.twinklePhase > Math.PI * 2) this.twinklePhase = 0;

        // Update pulse phase for programming color particles
        if (this.isProgrammingColor) {
            this.pulsePhase += this.pulseSpeed;
            if (this.pulsePhase > Math.PI * 2) this.pulsePhase = 0;
        }

        // Update rotation for emoji particles
        if (this.isProgrammingEmoji) {
            this.rotation += this.rotationSpeed;
        }

        // Reset particles when they move off screen
        if (this.x < 0 || this.x > this.canvas.width || 
            this.y < 0 || this.y > this.canvas.height) {
            this.reset();
        }
    }

    draw() {
        this.ctx.beginPath();

        if (this.isProgrammingEmoji) {
            // Draw programming language emoji
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.rotation);
            this.ctx.font = `${this.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = this.color;
            this.ctx.fillText(this.emoji, 0, 0);
            this.ctx.restore();
            
            // Add glow to emojis
            if (particleConfig.glow) {
                this.ctx.save();
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = this.color;
                this.ctx.globalAlpha = 0.5;
                this.ctx.translate(this.x, this.y);
                this.ctx.rotate(this.rotation);
                this.ctx.fillText(this.emoji, 0, 0);
                this.ctx.restore();
            }
        } else if (this.isProgrammingColor) {
            // Draw programming language-colored particle with pulse effect
            const pulseFactor = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius * pulseFactor, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            
            // Add glow based on language
            if (particleConfig.glow) {
                this.ctx.beginPath();
                this.ctx.arc(this.x, this.y, this.radius * pulseFactor * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = this.color.replace(')', ', 0.2)');
                this.ctx.fill();
            }
        } else if (this.isLargeParticle) {
            // Draw larger blue circle with enhanced gradient
            const gradient = this.ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, 'rgba(100, 150, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(20, 30, 80, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Draw regular star particle with twinkle effect
            const twinkleFactor = Math.sin(this.twinklePhase) * 0.5 + 0.5;
            // Extract the values from the color string
            const rgba = this.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/);
            if (rgba) {
                const r = rgba[1];
                const g = rgba[2];
                const b = rgba[3];
                const a = rgba[4] || "1";
                // Create a new color with the twinkle factor
                const color = `rgba(${r}, ${g}, ${b}, ${parseFloat(a) * twinkleFactor})`;
                this.ctx.fillStyle = color;
            } else {
                this.ctx.fillStyle = this.color;
            }
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Draw star trail if this is a shooting star
        if (this.hasTrail && !this.isProgrammingEmoji) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.x - this.vx * this.trailLength, this.y - this.vy * this.trailLength);
            this.ctx.strokeStyle = 'rgba(180, 210, 255, 0.25)';
            this.ctx.lineWidth = this.radius * (this.isLargeParticle ? 0.5 : 1.2);
            this.ctx.stroke();
        }

        // Add enhanced glow to all particles
        if (particleConfig.glow && !this.isProgrammingEmoji && !this.isProgrammingColor) {
            const glowSize = this.isLargeParticle ? 2 : (Math.random() > 0.7 ? 3 : 2);
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius * glowSize, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(180, 220, 255, ${Math.random() * 0.15 + 0.05})`;
            this.ctx.fill();
        }
    }
}

// Initialize and run particle system
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];

    // Add glow effect to canvas if enabled
    if (particleConfig.glow) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(100, 180, 255, 0.5)';
    }

    // Resize canvas to match window dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Initialize particles
    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < particleConfig.particleCount; i++) {
            particles.push(new Particle(canvas));
        }
    }

    // Animation loop
    function animateParticles() {
        // Clear canvas with a very dark bg for better contrast with bright particles
        ctx.fillStyle = 'rgba(2, 4, 10, 0.15)'; // Lighter clear for more persistence
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Occasional lightning flash effect
        if (Math.random() > 0.997) {
            ctx.fillStyle = 'rgba(150, 200, 255, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        requestAnimationFrame(animateParticles);
    }

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Initialize
    resizeCanvas();
    initParticles();
    animateParticles();
});
