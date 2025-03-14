// Particle animation for the background with programming symbols, bling effects and mouse interaction
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
    
    // Mouse interaction
    let mouse = {
        x: null,
        y: null,
        radius: 100 // Reduced from 150
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Particle properties with rainbow colors
    const particlesArray = [];
    const numberOfParticles = 50; // Reduced for better performance and less crowded visuals
    
    // Developer themed colors - lighter and more vibrant colors
    const colors = [
        '#ff5277', // Brighter Red
        '#4a94ff', // Brighter Blue
        '#ffe066', // Brighter Yellow
        '#32e875', // Brighter Green
        '#c44dff', // Brighter Purple
        '#ffb74d', // Brighter Orange
        '#40e0d0', // Brighter Teal
        '#ffffff', // White
        '#ff66c4'  // Brighter Pink
    ];
    
    // Developer symbols and icons
    const devSymbols = [
        '{ }', '< >', '# ', '()', '[]', '//', '&&', '||', 
        '+=', '=>', '===', '!==', '++', '--', '**', 
        '#!/', 'npm', 'git', 'def', 'let', 'var', 'const',
        'if', 'for', 'while', 'return', 'import', 'from',
        'function', 'async', 'await', 'class', 'extends'
    ];
    
    // Programming languages for special particles
    const languages = [
        { text: 'Python', color: '#6ba5e0' }, // Lighter blue
        { text: 'C++', color: '#007acc' }, // Brighter blue
        { text: 'JavaScript', color: '#ffdc4e' }, // Brighter yellow
        { text: 'HTML', color: '#ff5722' }, // Brighter orange
        { text: 'CSS', color: '#4d90fe' }, // Lighter blue
        { text: 'PHP', color: '#8892be' }, // Lighter purple
        { text: 'Java', color: '#5382a1' }, // Lighter blue
        { text: 'React', color: '#61dbfb' }, // Brighter cyan
        { text: 'Node.js', color: '#7ac665' }, // Brighter green
        { text: 'SQL', color: '#ffb700' }  // Brighter orange
    ];
    
    // Glow effect for canvas - reduced blur
    ctx.shadowBlur = 6; // Reduced for sharper visuals
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'; // Using white for more contrast against black
    
    // Rainbow color effect - made brighter
    function getRainbowColor(offset) {
        const time = Date.now() * 0.001 + offset;
        // Increase the range to make colors brighter (160 -> 200 instead of 127 -> 128)
        const r = Math.sin(time * 0.3) * 127 + 160;
        const g = Math.sin(time * 0.3 + 2) * 127 + 160;
        const b = Math.sin(time * 0.3 + 4) * 127 + 160;
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Create particles
    class Particle {
        constructor(isSpecial = false) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; // Further reduced size
            this.baseSize = this.size;
            this.speedX = Math.random() * 1.2 - 0.6; // Slightly slower for smoother movement
            this.speedY = Math.random() * 1.2 - 0.6;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.isRainbow = Math.random() > 0.8; // 20% chance of rainbow
            this.rainbowOffset = Math.random() * 10;
            this.opacity = Math.random() * 0.5 + 0.5; // Increased minimum opacity for more visibility
            this.pulsate = Math.random() > 0.5;
            this.pulseSpeed = 0.02 + Math.random() * 0.03;
            this.pulsePhase = Math.random() * Math.PI * 2;
            
            // Chance for a star particle
            this.isStar = Math.random() > 0.92;
            if (this.isStar) {
                this.starFlareSize = this.size * (Math.random() * 3 + 2);
                this.starColor = '#ffffff';
                this.starOpacity = Math.random() * 0.3 + 0.2; // Increased for more visibility
            }
            
            // Developer symbol or language
            this.isProgrammingSymbol = Math.random() < 0.25 || isSpecial; // Reduced chance
            if (this.isProgrammingSymbol) {
                if (isSpecial) {
                    // Special language particle
                    const lang = languages[Math.floor(Math.random() * languages.length)];
                    this.symbol = lang.text;
                    this.color = lang.color;
                    this.isLanguage = true;
                    
                    // Make Python and C++ particles larger and extra visible
                    if (this.symbol === 'Python' || this.symbol === 'C++') {
                        this.fontSize = Math.random() * 4 + 12; // Further reduced
                        this.opacity = 1.0; // Full opacity for better visibility
                    } else {
                        this.fontSize = Math.random() * 3 + 8; // Smaller font
                    }
                } else {
                    // Regular programming symbol
                    this.symbol = devSymbols[Math.floor(Math.random() * devSymbols.length)];
                    this.fontSize = Math.random() * 4 + 6; // Smaller font
                    this.isLanguage = false;
                }
                
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.01; // Slower rotation
            }
            
            // Shape variety - some particles have different shapes
            this.shape = Math.floor(Math.random() * 5); // 0: circle, 1: square, 2: triangle, 3: diamond, 4: code block
            
            // For code block shapes
            if (this.shape === 4) {
                this.width = Math.random() * 15 + 10; // Smaller
                this.height = Math.random() * 10 + 6; // Smaller
                this.lineCount = Math.floor(Math.random() * 3) + 2;
            }
        }
        
        update() {
            // Mouse interaction - particles move away from mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    this.x += Math.cos(angle) * force * 2;
                    this.y += Math.sin(angle) * force * 2;
                    
                    // Highlight particles near mouse
                    this.size = this.baseSize * (1 + (force * 2));
                }
            }
            
            // Regular movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Update pulsation
            if (this.pulsate) {
                this.pulsePhase += this.pulseSpeed;
                if (this.pulsePhase > Math.PI * 2) this.pulsePhase = 0;
            }
            
            // Rotate programming symbols
            if (this.isProgrammingSymbol) {
                this.rotation += this.rotationSpeed;
            }
            
            // Wrap around edges
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
            
            // Update color for rainbow particles
            if (this.isRainbow && !this.isProgrammingSymbol) {
                this.color = getRainbowColor(this.rainbowOffset);
            }
            
            if (this.isProgrammingSymbol) {
                // Draw programming symbol with glow
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                // Special rendering for languages (especially Python and C++)
                if (this.isLanguage) {
                    // Draw background for language labels
                    const padding = 4; // Reduced padding
                    const textWidth = ctx.measureText(this.symbol).width + padding * 2;
                    const textHeight = this.fontSize + padding;
                    
                    if (this.symbol === 'Python' || this.symbol === 'C++') {
                        // First, draw a glowing background for the language
                        ctx.fillStyle = this.symbol === 'Python' ? 'rgba(75, 139, 190, 0.15)' : 'rgba(0, 89, 156, 0.15)'; // Reduced opacity
                        ctx.shadowBlur = 5; // Reduced blur
                        ctx.shadowColor = this.color;
                        ctx.beginPath();
                        ctx.roundRect(-textWidth/2, -textHeight/2, textWidth, textHeight, 4);
                        ctx.fill();
                        
                        // Then draw text with shadow for better visibility
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                        ctx.font = `bold ${this.fontSize * sizeFactor}px "Courier New", monospace`;
                        ctx.globalAlpha = this.opacity * opacityFactor;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(this.symbol, 1, 1); // Reduced shadow offset
                        
                        // Draw the main text
                        ctx.fillStyle = this.color;
                        ctx.shadowBlur = 2; // Minimal blur for sharp text
                        ctx.shadowColor = 'white';
                        ctx.fillText(this.symbol, 0, 0);
                    } else {
                        // For other languages
                        ctx.font = `${this.fontSize * sizeFactor}px "Courier New", monospace`;
                        ctx.fillStyle = this.color;
                        ctx.globalAlpha = this.opacity * opacityFactor;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.shadowBlur = 3; // Reduced blur
                        ctx.shadowColor = this.color;
                        ctx.fillText(this.symbol, 0, 0);
                    }
                } else {
                    // For regular dev symbols
                    ctx.font = `${this.fontSize * sizeFactor}px "Courier New", monospace`;
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = this.opacity * opacityFactor;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.shadowBlur = 2; // Minimal blur
                    ctx.shadowColor = this.color;
                    ctx.fillText(this.symbol, 0, 0);
                }
                
                ctx.restore();
            } else {
                // Draw different particle shapes
                ctx.save();
                
                // Apply color (rainbow or static)
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity * opacityFactor;
                ctx.shadowBlur = 4; // Reduced blur
                ctx.shadowColor = this.color;
                
                // Star flare effect
                if (this.isStar) {
                    const gradient = ctx.createRadialGradient(
                        this.x, this.y, 0,
                        this.x, this.y, this.starFlareSize
                    );
                    gradient.addColorStop(0, 'rgba(255, 255, 255, ' + this.starOpacity + ')');
                    gradient.addColorStop(1, 'rgba(70, 130, 240, 0)');
                    
                    ctx.fillStyle = gradient;
                    ctx.globalAlpha = this.starOpacity * (0.6 + Math.sin(Date.now() * 0.003) * 0.4); // Brighter
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.starFlareSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Reset for the main shape
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity * opacityFactor;
                
                // Draw different shapes
                switch (this.shape) {
                    case 0: // Circle
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size * sizeFactor, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    case 1: // Square
                        ctx.fillRect(
                            this.x - (this.size * sizeFactor), 
                            this.y - (this.size * sizeFactor), 
                            this.size * 2 * sizeFactor, 
                            this.size * 2 * sizeFactor
                        );
                        break;
                        
                    case 2: // Triangle
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y - this.size * 1.5 * sizeFactor);
                        ctx.lineTo(this.x - this.size * 1.3 * sizeFactor, this.y + this.size * sizeFactor);
                        ctx.lineTo(this.x + this.size * 1.3 * sizeFactor, this.y + this.size * sizeFactor);
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 3: // Diamond
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y - this.size * 1.5 * sizeFactor);
                        ctx.lineTo(this.x + this.size * 1.5 * sizeFactor, this.y);
                        ctx.lineTo(this.x, this.y + this.size * 1.5 * sizeFactor);
                        ctx.lineTo(this.x - this.size * 1.5 * sizeFactor, this.y);
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 4: // Code block
                        const width = this.width * sizeFactor;
                        const height = this.height * sizeFactor;
                        const x = this.x - width/2;
                        const y = this.y - height/2;
                        
                        // Draw rectangle for code block
                        ctx.fillStyle = 'rgba(30, 30, 30, 0.8)';
                        ctx.beginPath();
                        ctx.roundRect(x, y, width, height, 3);
                        ctx.fill();
                        
                        // Draw code lines
                        ctx.fillStyle = this.color;
                        const lineHeight = height / (this.lineCount + 1);
                        const lineWidth = width * 0.7;
                        
                        for (let i = 0; i < this.lineCount; i++) {
                            const lineY = y + lineHeight * (i + 1);
                            const lineLength = (Math.random() * 0.5 + 0.3) * lineWidth;
                            ctx.fillRect(x + width * 0.15, lineY - 1, lineLength, 2);
                        }
                        break;
                }
                
                ctx.restore();
            }
        }
    }
    
    // Initialize particles
    function init() {
        // First fill with solid pitch black background
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
        
        // Add special language particles (reduced)
        for (let i = 0; i < 8; i++) { // Further reduced from 12
            particlesArray.push(new Particle(true));
        }
    }
    
    // Animation loop
    function animate() {
        // Semi-transparent clear for trail effect - completely dark black background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Increased opacity for faster fade and darker background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all particles
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        // Draw connections between particles
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    // Connect particles with lines if they are close - reduced distance
    function connectParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) { // Further reduced from 100
                    // Rainbow connections for rainbow particles
                    if (particlesArray[i].isRainbow || particlesArray[j].isRainbow) {
                        ctx.strokeStyle = getRainbowColor(particlesArray[i].rainbowOffset);
                    } else {
                        const gradient = ctx.createLinearGradient(
                            particlesArray[i].x, particlesArray[i].y,
                            particlesArray[j].x, particlesArray[j].y
                        );
                        gradient.addColorStop(0, particlesArray[i].color);
                        gradient.addColorStop(1, particlesArray[j].color);
                        ctx.strokeStyle = gradient;
                    }
                    
                    ctx.globalAlpha = 0.12 * (1 - distance/80); // Further reduced opacity
                    ctx.lineWidth = 0.4; // Thinner lines
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Add a media query check for mobile
    function isMobileDevice() {
        return (window.innerWidth <= 768);
    }
    
    // Adjust for mobile if needed
    if (isMobileDevice()) {
        // Further reduce for mobile
        mouse.radius = 70;
        // Even smaller particles on mobile
        particlesArray.forEach(p => {
            if (!p.isProgrammingSymbol) {
                p.size *= 0.7;
                p.baseSize *= 0.7;
            } else {
                p.fontSize *= 0.8;
            }
        });
    }
    
    init();
    animate();
});
