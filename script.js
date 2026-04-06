/* ============================================
   SUPER MARIO PORTFOLIO — JAVASCRIPT
   Interactive Mario-themed animations & effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // === STATE ===
    let score = 0;
    let coins = 0;
    const scoreDisplay = document.getElementById('scoreDisplay');
    const coinCount = document.getElementById('coinCount');

    // === TYPING EFFECT ===
    const roles = [
        'AI / ML Engineer',
        'Full-Stack Developer',
        'Deep Learning Explorer',
        'Mobile App Builder',
        'Cybersecurity Enthusiast',
        'Problem Solver'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const roleText = document.getElementById('roleText');

    function typeRole() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            roleText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(typeRole, 2000);
                return;
            }
        } else {
            roleText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }

        const speed = isDeleting ? 50 : 100;
        setTimeout(typeRole, speed);
    }

    typeRole();

    // === SCORE SYSTEM ===
    function addScore(points) {
        score += points;
        scoreDisplay.textContent = String(score).padStart(6, '0');
    }

    function addCoin(x, y) {
        coins++;
        coinCount.textContent = String(coins).padStart(2, '0');
        addScore(200);

        // Coin popup animation
        const popup = document.createElement('div');
        popup.className = 'coin-popup';
        popup.textContent = '✦';
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        document.body.appendChild(popup);

        const scorePopup = document.createElement('div');
        scorePopup.className = 'score-popup';
        scorePopup.textContent = '+200';
        scorePopup.style.left = (x + 20) + 'px';
        scorePopup.style.top = y + 'px';
        document.body.appendChild(scorePopup);

        setTimeout(() => {
            popup.remove();
            scorePopup.remove();
        }, 1200);
    }

    // === CLICK COIN EFFECT ===
    document.addEventListener('click', (e) => {
        // Only trigger on interactive elements
        const target = e.target.closest('.skill-item, .social-block, .question-block, .project-card, .contact-pipe');
        if (target) {
            const rect = target.getBoundingClientRect();
            addCoin(rect.left + rect.width / 2, rect.top);
        }
    });

    // === NAVIGATION ===
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link
        const sections = document.querySelectorAll('.section, .hero');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // === GROUND BLOCKS ===
    const groundBlocks = document.getElementById('groundBlocks');
    const blockCount = Math.ceil(window.innerWidth / 48) + 2;
    for (let i = 0; i < blockCount; i++) {
        const block = document.createElement('div');
        block.className = 'ground-block';
        groundBlocks.appendChild(block);
    }

    // === FLOATING CLOUDS ===
    const cloudsContainer = document.getElementById('clouds');
    function createCloud() {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.textContent = '☁';
        cloud.style.top = Math.random() * 60 + '%';
        cloud.style.fontSize = (40 + Math.random() * 60) + 'px';
        cloud.style.animationDuration = (20 + Math.random() * 30) + 's';
        cloud.style.animationDelay = Math.random() * 20 + 's';
        cloud.style.opacity = 0.02 + Math.random() * 0.03;
        cloudsContainer.appendChild(cloud);

        // Remove and recreate after animation
        const duration = parseFloat(cloud.style.animationDuration) * 1000;
        const delay = parseFloat(cloud.style.animationDelay) * 1000;
        setTimeout(() => {
            cloud.remove();
            createCloud();
        }, duration + delay);
    }

    // Create initial clouds
    for (let i = 0; i < 6; i++) {
        createCloud();
    }

    // === CANVAS ANIMATIONS (Background particles) ===
    const canvas = document.getElementById('marioCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Floating stars/particles
    const particles = [];
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedY = -Math.random() * 0.5 - 0.1;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.twinkle += this.twinkleSpeed;
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }
        draw() {
            const alpha = this.opacity * (0.5 + 0.5 * Math.sin(this.twinkle));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.fill();

            // Star glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.2})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // === INTERSECTION OBSERVER (Scroll Animations) ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Stat bars animation
    const statBars = document.querySelectorAll('.bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width');
                fill.style.width = width + '%';
                fill.classList.add('animate');
                barObserver.unobserve(fill);
                addScore(100);
            }
        });
    }, observerOptions);

    statBars.forEach(bar => barObserver.observe(bar));

    // Timeline items animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                timelineObserver.unobserve(entry.target);
                addScore(50);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => timelineObserver.observe(item));

    // General section animations
    const sections = document.querySelectorAll('.skill-category, .project-card');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        sectionObserver.observe(section);
    });

    // === QUESTION BLOCK INTERACTION ===
    const questionBlocks = document.querySelectorAll('.question-block');
    questionBlocks.forEach(block => {
        block.addEventListener('click', (e) => {
            block.style.animation = 'none';
            block.offsetHeight; // reflow
            block.style.animation = 'blockHit 0.3s ease';
            setTimeout(() => {
                block.style.animation = 'blockBounce 2s ease-in-out infinite';
            }, 300);
        });
    });

    // === STAR PARTICLES ON MOUSE MOVE ===
    let starThrottle = 0;
    document.addEventListener('mousemove', (e) => {
        starThrottle++;
        if (starThrottle % 8 !== 0) return;

        const star = document.createElement('div');
        star.className = 'star-particle';
        star.style.left = e.clientX + 'px';
        star.style.top = e.clientY + 'px';
        document.body.appendChild(star);

        setTimeout(() => star.remove(), 800);
    });

    // === SMOOTH SCROLL for nav links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // === SCORE INCREMENT ON SCROLL ===
    let lastScrollScore = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.floor((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > lastScrollScore + 10) {
            lastScrollScore = scrollPercent;
            addScore(50);
        }
    });

    // === POWER-UP HOVER SOUND SIMULATION (visual) ===
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const block = item.querySelector('.skill-block');
            block.style.transform = 'scale(1.15) translateY(-4px)';
            setTimeout(() => {
                block.style.transform = '';
            }, 200);
        });
    });

    // === PROJECT CARD TILT EFFECT ===
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // === KONAMI CODE EASTER EGG ===
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                konamiIndex = 0;
                activateStarPower();
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateStarPower() {
        addScore(10000);
        document.body.style.animation = 'starPowerFlash 0.2s ease 5';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes starPowerFlash {
                0%, 100% { filter: none; }
                50% { filter: hue-rotate(180deg) brightness(1.3); }
            }
        `;
        document.head.appendChild(style);

        // Create burst of coins
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.5;
                addCoin(x, y);
            }, i * 100);
        }

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 1500);
    }

    // === AUTO SCORE INCREMENTER ===
    setInterval(() => {
        addScore(1);
    }, 5000);

    // === INITIAL LOAD ANIMATION ===
    setTimeout(() => {
        addScore(1000);
        // Animate score counting up
        const startScore = 0;
        const endScore = 1000;
        const duration = 1000;
        const startTime = performance.now();

        function animateScore(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScore = Math.floor(startScore + (endScore - startScore) * progress);
            scoreDisplay.textContent = String(currentScore).padStart(6, '0');
            if (progress < 1) {
                requestAnimationFrame(animateScore);
            }
        }
        requestAnimationFrame(animateScore);
    }, 1000);

    console.log(`
    ╔════════════════════════════════════╗
    ║  🍄 SUPER SOUMITH PORTFOLIO 🍄    ║
    ║                                    ║
    ║  Try the Konami Code!              ║
    ║  ↑↑↓↓←→←→ B A                    ║
    ║                                    ║
    ║  Built with ❤️ and Power-Ups       ║
    ╚════════════════════════════════════╝
    `);
});
