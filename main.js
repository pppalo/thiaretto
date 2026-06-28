document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
        }
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            iconSun.classList.remove('hidden');
            iconMoon.classList.add('hidden');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
        }
    });

    // ── Contadores animados ──
    function animarContador(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.counter-num').forEach(animarContador);
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const banner = document.querySelector('.hero-banner');
    if (banner) observer.observe(banner);

    // ── Tabs ──
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.getAttribute('data-tab');
            const targetElement = document.getElementById(targetId);
            targetElement.classList.add('active');
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const elementPos = targetElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementPos - headerHeight - 20, behavior: 'smooth' });
        });
    });

    // ── Notificación ──
    function mostrarNotificacion(mensaje, esError = false) {
        const overlay = document.getElementById('notificacionOverlay');
        const notif = document.getElementById('notificacion');
        const texto = document.getElementById('notificacionTexto');
        const icono = document.getElementById('notificacionIcono');
        texto.textContent = mensaje;
        icono.textContent = esError ? '❌' : '🎉';
        notif.classList.toggle('error', esError);
        overlay.classList.add('visible');
    }

    window.cerrarNotificacion = function() {
        document.getElementById('notificacionOverlay').classList.remove('visible');
    };

    // ── Formulario ──
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                tipo: document.getElementById('tipo').value,
                request: document.getElementById('request').value
            };
            try {
                const response = await fetch('/api/requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (result.success) {
                    mostrarNotificacion('¡Gracias por contactarnos! Te responderemos a la brevedad.');
                    contactForm.reset();
                } else {
                    mostrarNotificacion('Hubo un error al enviar el mensaje.', true);
                }
            } catch (error) {
                console.error(error);
                mostrarNotificacion('No se pudo conectar al servidor.', true);
            }
        });
    }
});