// Particle animation for the background with programming symbols
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
    
    // Particle properties
    const particlesArray = [];
    const numberOfParticles = 100;
    const colors = ['#4e9af1', '#2a75e6', '#1756b7'];
    const symbols = ['{ }', '< >', '# ', '()', '[]', 'py', 'C++', '//'];
    
    // Create particles
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.2;
            
            // 30% chance to be a programming symbol
            this.isProgrammingSymbol = Math.random() < 0.3;
            if (this.isProgrammingSymbol) {
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.fontSize = Math.random() * 12 + 8; // 8-20px font size
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.01;
            }
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.isProgrammingSymbol) {
                this.rotation += this.rotationSpeed;
            }
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            if (this.isProgrammingSymbol) {
                // Draw programming symbol
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.font = `${this.fontSize}px Courier New`;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, 0, 0);
                ctx.restore();
            } else {
                // Draw regular particle
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = particlesArray[i].color;
                    ctx.globalAlpha = 0.2 * (1 - distance/100);
                    ctx.lineWidth = 0.5;
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
            particle.opacity = 0.7;
            particle.speedX = (Math.random() - 0.5) * 0.5; // Slower movement
            particle.speedY = (Math.random() - 0.5) * 0.5;
            particlesArray.push(particle);
        }
    }
    
    init();
    addProgrammingLanguages(); // Add the special programming language particles
    animate();
});
