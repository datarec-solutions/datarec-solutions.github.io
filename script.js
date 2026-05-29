/**
 * portfolio - script.js
 * Lógica interativa para o portfólio moderno
 * 
 * Funcionalidades:
 * 1. Fundo de partículas interativas (Canvas)
 * 2. Efeito de digitação (Typewriter)
 * 3. Alternador de Temas (Dark/Light) com persistência
 * 4. Animação de revelação de elementos ao rolar (Scroll Reveal)
 * 5. Contador numérico de estatísticas animado
 * 6. Efeito de inclinação 3D interativo nos cards (Tilt Effect)
 * 7. Menu Mobile (Hamburger)
 * 8. Filtragem dinâmica de Projetos
 * 9. Botão de voltar ao topo
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. FUNDO DE PARTÍCULAS INTERATIVAS (CANVAS)
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const numberOfParticles = 80;
    const connectionDistance = 120;
    
    // Configura o tamanho do canvas
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Objeto mouse para interação
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Cores das partículas baseadas no tema ativo
    function getParticleColors() {
        const isLightTheme = document.body.classList.contains('light-theme');
        return {
            particleColor: isLightTheme ? 'rgba(37, 99, 235, 0.45)' : 'rgba(0, 242, 254, 0.45)',
            lineColor: isLightTheme ? 'rgba(37, 99, 235, 0.08)' : 'rgba(0, 242, 254, 0.08)'
        };
    }
    
    // Classe de Partícula
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
        }
        
        draw(color) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
        
        update() {
            // Movimentação básica
            this.x += this.vx;
            this.y += this.vy;
            
            // Colisão com as bordas
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            
            // Interação com o mouse (repulsão suave)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.hypot(dx, dy);
                
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    
                    // Força decrescente baseada na distância
                    let force = (mouse.radius - distance) / mouse.radius;
                    
                    this.x -= forceDirectionX * force * 1.5;
                    this.y -= forceDirectionY * force * 1.5;
                }
            }
        }
    }
    
    // Inicializa as partículas
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();
    
    // Conecta partículas próximas por linhas
    function connectParticles(colors) {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.hypot(dx, dy);
                
                if (distance < connectionDistance) {
                    // Opacidade da linha proporcional à proximidade
                    ctx.strokeStyle = colors.lineColor;
                    ctx.lineWidth = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Loop de Animação do Canvas
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const colors = getParticleColors();
        
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw(colors.particleColor);
        });
        
        connectParticles(colors);
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
    
    // Reinicializa ao redimensionar tela para redistribuir partículas
    window.addEventListener('resize', initParticles);
    
    
    /* ==========================================================================
       2. EFEITO DE DIGITAÇÃO (TYPEWRITER)
       ========================================================================== */
    const typewriterEl = document.getElementById('typewriter');
    const words = ["desenvolvedor full stack", "administrador de sistemas", "especialista em redes & linux", "técnico em infraestrutura"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 40 : 80;
        
        // Pausas elegantes ao terminar de digitar ou apagar
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // pausa no texto completo
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // pausa antes de iniciar nova palavra
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    if (typewriterEl) {
        setTimeout(typeEffect, 1000);
    }
    
    
    /* ==========================================================================
       3. ALTERNADOR DE TEMAS (DARK/LIGHT) COM PERSISTÊNCIA
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Obtém tema salvo no LocalStorage ou preferência do sistema
    const currentTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (currentTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        // Fallback do sistema
        if (!prefersDark) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    
    /* ==========================================================================
       4. REVELAÇÃO DE ELEMENTOS AO ROLAR (SCROLL REVEAL)
       ========================================================================== */
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animando as barras de habilidades correspondentes
                if (entry.target.id === 'skills') {
                    animateSkillsBars();
                }
                
                // Desativa a observação para otimizar após revelado
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    
    scrollRevealElements.forEach(el => revealObserver.observe(el));
    
    
    /* ==========================================================================
       5. CONTADOR NUMÉRICO DE ESTATÍSTICAS ANIMADO
       ========================================================================== */
    const statsContainer = document.querySelector('.stats-grid');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;
    
    function animateCounters() {
        statNumbers.forEach(numberEl => {
            const target = parseInt(numberEl.getAttribute('data-target'), 10);
            const duration = 2000; // 2 segundos
            const startTime = performance.now();
            
            function updateNumber(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Efeito Easing Out Quad para rolagem suave do contador
                const easeValue = progress * (2 - progress);
                const currentValue = Math.floor(easeValue * target);
                
                // Formatação simples para números grandes (ex: 2.5k+)
                if (target >= 1000) {
                    const formatted = (currentValue / 1000).toFixed(1) + 'k+';
                    numberEl.textContent = formatted.replace('.0', '');
                } else {
                    numberEl.textContent = currentValue + (target === 3 ? '+' : '');
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    // Garante que chegue exatamente no valor final
                    if (target >= 1000) {
                        numberEl.textContent = (target / 1000).toFixed(1) + 'k+';
                        numberEl.textContent = numberEl.textContent.replace('.0', '');
                    } else {
                        numberEl.textContent = target + (target === 3 || target === 50 || target === 12 ? '+' : '');
                    }
                }
            }
            
            requestAnimationFrame(updateNumber);
        });
    }
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats) {
                animatedStats = true;
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
    
    
    /* ==========================================================================
       ANIMAÇÃO DE BARRAS DE HABILIDADE
       ========================================================================== */
    function animateSkillsBars() {
        const fillElements = document.querySelectorAll('.progress-bar-fill');
        fillElements.forEach(fill => {
            const widthVal = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = widthVal;
            }, 100);
        });
    }
    
    
    /* ==========================================================================
       6. EFEITO DE INCLINAÇÃO 3D INTERATIVO NOS CARDS (TILT EFFECT)
       ========================================================================== */
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            
            // Posição relativa do mouse no card (-0.5 a 0.5)
            const mouseX = (e.clientX - cardRect.left) / cardRect.width - 0.5;
            const mouseY = (e.clientY - cardRect.top) / cardRect.height - 0.5;
            
            // Intensidade máxima da rotação em graus
            const maxTilt = 10;
            
            const tiltX = (mouseY * maxTilt).toFixed(2);
            const tiltY = -(mouseX * maxTilt).toFixed(2);
            
            // Aplica a transformação 3D no container do card
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
            card.style.transition = 'transform 0.05s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            // Retorna ao estado original suavemente
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
    
    
    /* ==========================================================================
       7. MENU MOBILE (HAMBURGER)
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Fecha o menu ao clicar em qualquer link de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    
    /* ==========================================================================
       8. FILTRAGEM DINÂMICA DE PROJETOS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Gerencia classes ativas dos botões
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Revela com efeito suave de escala e opacidade
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Oculta suavemente
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });
    
    
    /* ==========================================================================
       9. BOTÃO DE VOLTAR AO TOPO
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /* ==========================================================================
       10. FORMULÁRIO DE CONTATO INTELIGENTE (AJAX VIA FORMSUBMIT)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');

    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Set loading state on button and status card
            submitBtn.disabled = true;
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `Enviando... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>`;
            
            formStatus.style.display = 'block';
            formStatus.style.background = 'rgba(255, 255, 255, 0.04)';
            formStatus.style.border = '1px solid rgba(255, 255, 255, 0.08)';
            formStatus.style.color = '#e2e8f0';
            formStatus.innerHTML = `Processando dados seguros...`;

            // Prepare form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            try {
                // Post asynchronously to FormSubmit's AJAX endpoint
                const response = await fetch('https://formsubmit.co/ajax/lucas.ti.temp@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success === 'true') {
                    // Success State
                    formStatus.style.background = 'rgba(16, 185, 129, 0.1)';
                    formStatus.style.border = '1px solid rgba(16, 185, 129, 0.3)';
                    formStatus.style.color = '#34d399';
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-check" style="margin-right: 6px;"></i> Mensagem enviada com sucesso! Verifique sua caixa de entrada para ativação do e-mail.`;
                    contactForm.reset();
                } else {
                    throw new Error('Falha no processamento da API externa.');
                }
            } catch (error) {
                // Error State
                formStatus.style.background = 'rgba(239, 68, 68, 0.1)';
                formStatus.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                formStatus.style.color = '#f87171';
                formStatus.innerHTML = `<i class="fa-solid fa-circle-xmark" style="margin-right: 6px;"></i> Erro ao enviar. Tente novamente ou use o e-mail acima.`;
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        });
    }
});
