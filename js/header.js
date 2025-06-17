document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    let lastScroll = 0;
    const scrollThreshold = 100; // Píxeles para activar el efecto

    // Efecto de scroll
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Mostrar/ocultar header al hacer scroll
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scroll hacia abajo
            header.classList.add('scrolled');
            header.classList.add('hide-header');
        } else {
            // Scroll hacia arriba
            header.classList.add('scrolled');
            header.classList.remove('hide-header');
        }
        
        lastScroll = currentScroll;
    });

    // Menú móvil
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !mainNav.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mainNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});
