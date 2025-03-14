// Particle animation for the background with programming symbols and bling effect
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle properties with brighter colors
    const particlesArray = [];
    const numberOfParticles = 120; // More particles
    const colors = [
        '#4e9af1', // Blue
        '#2a75e6', // Darker Blue
        '#1756b7', // Deep Blue
        '#64c5eb', // Light Blue
        '#f7d06b', // Gold
        '#f08df0', // Pink
        '#ee82ee', // Violet
        '#ffffff'  // White (bright!)
    ];
    const symbols = ['{ }', '< >', '# ', '()', '[]', 'py', 'C++', '//', 'JS', 'HTML', '$$'];
    
    // Glow effect for canvas
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(70, 130, 240, 0.5)';
    
    // Occasional flash effect
    let flashTimer = 0;
    const flashInterval = 200; // Lower value = more frequent flashes
    
    // Create particles
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 1; // Larger particles
            this.speedX = Math.random() * 1.5 - 0.75; // Faster movement
            this.speedY = Math.random() * 1.5 - 0.75;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.7 + 0.3; // Higher opacity
            this.pulsate = Math.random() > 0.7; // Some particles will pulsate
            this.pulseSpeed = 0.02 + Math.random() * 0.03;
            this.pulsePhase = Math.random() * Math.PI * 2;
            
            // Chance for a star particle (extra bright)
            this.isStar = Math.random() > 0.9;
            if (this.isStar) {
                this.starFlareSize = this.size * (Math.random() * 4 + 3);
                this.starColor = '#ffffff';
                this.starOpacity = Math.random() * 0.3 + 0.2;
            }
            
            // 25% chance to be a programming symbol
            this.isProgrammingSymbol = Math.random() < 0.25;
            if (this.isProgrammingSymbol) {
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.fontSize = Math.random() * 12 + 8; // 8-20px font size
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            }
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Update pulsation
            if (this.pulsate) {
                this.pulsePhase += this.pulseSpeed;
                if (this.pulsePhase > Math.PI * 2) this.pulsePhase = 0;
            }
            
            if (this.isProgrammingSymbol) {
                this.rotation += this.rotationSpeed;
            }
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            // Calculate pulsation effect
            let sizeFactor = 1;
            let opacityFactor = 1;
            
            if (this.pulsate) {
                sizeFactor = 1 + Math.sin(this.pulsePhase) * 0.3;
                opacityFactor = 0.7 + Math.sin(this.pulsePhase) * 0.3;
            }
            
            if (this.isProgrammingSymbol) {
                // Draw programming symbol with glow
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.font = `${this.fontSize * sizeFactor}px Courier New`;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity * opacityFactor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Draw glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                
                ctx.fillText(this.symbol, 0, 0);
                ctx.restore();
            } else {
                // Draw star flash effect first (if it's a star)
                if (this.isStar) {
                    ctx.save();
                    
                    // Draw star flare
                    const gradient = ctx.createRadialGradient(
                        this.x, this.y, 0,
                        this.x, this.y, this.starFlareSize
                    );
                    gradient.addColorStop(0, 'rgba(255, 255, 255, ' + this.starOpacity + ')');
                    gradient.addColorStop(1, 'rgba(70, 130, 240, 0)');
                    
                    ctx.fillStyle = gradient;
                    ctx.globalAlpha = this.starOpacity * (0.5 + Math.sin(Date.now() * 0.003) * 0.5);
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.starFlareSize, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                
                // Draw regular particle with glow
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity * opacityFactor;
                
                // Add glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * sizeFactor, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }
    
    // Initialize particles
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        // Use a semi-transparent clear for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Occasional flash effect
        flashTimer++;
        if (flashTimer > flashInterval && Math.random() > 0.97) {
            ctx.fillStyle = 'rgba(70, 130, 240, 0.03)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            flashTimer = 0;
        }
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        // Draw connections between particles
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    // Connect particles with lines if they are close
    function connectParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) { // Increased connection distance
                    ctx.beginPath();
                    ctx.strokeStyle = particlesArray[i].color;
                    ctx.globalAlpha = 0.2 * (1 - distance/120);
                    ctx.lineWidth = 0.8; // Slightly thicker lines
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Create special programming language particles
    function addProgrammingLanguages() {
        const languages = [
            { text: 'Python', color: '#4B8BBE' },
            { text: 'C++', color: '#00599C' },
            { text: 'JavaScript', color: '#F7DF1E' },
            { text: 'HTML', color: '#E34C26' },
            { text: 'CSS', color: '#264DE4' }
        ];
        
        // Add language particles
        for (let i = 0; i < languages.length; i++) {
            const particle = new Particle();
            particle.isProgrammingSymbol = true;
            particle.symbol = languages[i].text;
            particle.color = languages[i].color;
            particle.fontSize = 14;
            particle.opacity = 0.8; // More visible
            particle.speedX = (Math.random() - 0.5) * 0.5; // Slower movement
            particle.speedY = (Math.random() - 0.5) * 0.5;
            particle.pulsate = true; // Make them pulsate
            particlesArray.push(particle);
        }
    }
    
    init();
    addProgrammingLanguages(); // Add the special programming language particles
    animate();
});
