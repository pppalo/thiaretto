document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');

    // Revisar preferencia guardada
    const currentTheme = localStorage.getItem('theme');
    
    // Si hay un tema guardado, aplicarlo
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
        }
    } else {
        // Por defecto: revisar preferencia del sistema o usar light
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
        }
    }

    // Funcionalidad de cambiar tema
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

    // Funcionalidad de pestañas
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remover active de todos los links
            tabLinks.forEach(btn => btn.classList.remove('active'));
            // Remover active de todos los contenidos
            tabContents.forEach(content => content.classList.remove('active'));

            // Añadir active al link clickeado
            link.classList.add('active');
            // Añadir active al contenido correspondiente
            const targetId = link.getAttribute('data-tab');
            const targetElement = document.getElementById(targetId);
            targetElement.classList.add('active');

            // Hacer scroll suave hacia la sección (considerando la altura del header)
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const elementPos = targetElement.getBoundingClientRect().top + window.scrollY;
            
            window.scrollTo({
                top: elementPos - headerHeight - 20,
                behavior: 'smooth'
            });
        });
    });

    // --- FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar que la página recargue

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                request: document.getElementById('request').value
            };

            try {
                // Hacer POST al backend Node.js
                const response = await fetch('/api/requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('¡Gracias por contactarnos! Te responderemos a la brevedad.');
                    contactForm.reset();
                } else {
                    alert('Hubo un error al enviar el mensaje.');
                }
            } catch (error) {
                console.error(error);
                alert('No se pudo conectar al servidor. Asegúrate de ejecutar el backend (node server.js).');
            }
        });
    }
});
