import { fetchNoticias } from '../../js/config/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const newsPage = document.querySelector('.news-page');
    const newsContainer = document.querySelector('.news-grid');
    const newsOverlay = document.querySelector('.news-overlay');
    let scrollPosition = 0;
    let isExpanded = false;

    // Cargar noticias desde Supabase
    async function loadNoticias() {
        try {
            const { data: noticias, error } = await fetchNoticias();
            
            if (error) throw error;
            
            if (noticias && noticias.length > 0) {
                renderNoticias(noticias);
            } else {
                newsContainer.innerHTML = '<p class="no-news">No hay noticias disponibles en este momento.</p>';
            }
        } catch (error) {
            console.error('Error al cargar noticias:', error);
            newsContainer.innerHTML = '<p class="error">Error al cargar las noticias. Por favor, intente más tarde.</p>';
        }
    }

    // Renderizar noticias en el DOM
    function renderNoticias(noticias) {
        newsContainer.innerHTML = noticias.map(noticia => `
            <article class="news-card" data-id="${noticia.id}">
                <div class="news-image-container">
                    ${noticia.imagen ? 
                        `<img class="news-image" src="${noticia.imagen}" alt="${noticia.titulo}" loading="lazy">` : 
                        '<div class="news-image-placeholder"></div>'
                    }
                    <span class="news-date">${formatDate(noticia.fecha_publicacion)}</span>
                </div>
                <div class="news-content">
                    <h3>${noticia.titulo}</h3>
                    <div class="news-excerpt">
                        <p>${noticia.contenido}</p>
                        <a href="#" class="read-more">Leer más</a>
                    </div>
                </div>
                <button class="close-btn" style="display: none;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </article>
        `).join('');

        // Agregar event listeners a los botones de leer más
        document.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const card = button.closest('.news-card');
                expandCard(card);
            });
        });
        
        // Configurar botones de cerrar
        document.querySelectorAll('.close-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const card = button.closest('.news-card');
                collapseCard(card);
            });
        });
        
        // Hacer las tarjetas clickeables
        document.querySelectorAll('.news-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Solo manejar clics en la tarjeta, no en enlaces o botones
                if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && !e.target.closest('a, button')) {
                    if (card.classList.contains('expanded')) {
                        collapseCard(card);
                    } else {
                        expandCard(card);
                    }
                }
            });
        });
    }

    // Formatear fecha
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    // Expandir tarjeta en el lugar
    function expandCard(card) {
        if (card.classList.contains('expanded')) return;
        
        // Cerrar cualquier otra tarjeta expandida
        const expandedCard = document.querySelector('.news-card.expanded');
        if (expandedCard && expandedCard !== card) {
            collapseCard(expandedCard);
        }
        
        // Mostrar el botón de cerrar
        const closeBtn = card.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.style.display = 'flex';
            // Forzar reflow para que la transición funcione
            void closeBtn.offsetWidth;
            closeBtn.classList.add('visible');
        }
        
        // Marcar como expandida
        card.classList.add('expanded');
        isExpanded = true;
        
        // No mostrar overlay según la preferencia del usuario
        
        // Desplazar la vista a la tarjeta si es necesario
        const rect = card.getBoundingClientRect();
        const isInView = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        if (!isInView) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Asegurar que el contenido completo sea visible
        const newsExcerpt = card.querySelector('.news-excerpt');
        if (newsExcerpt) {
            newsExcerpt.style.webkitLineClamp = 'unset';
            newsExcerpt.style.display = 'block';
        }
    }
    
    // Colapsar tarjeta
    function collapseCard(card) {
        if (!card.classList.contains('expanded')) return;
        
        // Ocultar el botón de cerrar
        const closeBtn = card.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.classList.remove('visible');
            // Esperar a que termine la transición antes de ocultar
            setTimeout(() => {
                closeBtn.style.display = 'none';
            }, 300); // Match this with CSS transition duration
        }
        
        // Quitar la clase expanded
        card.classList.remove('expanded');
        isExpanded = false;
        
        // No hay overlay que ocultar
        
        // Restaurar el contenido recortado
        const newsExcerpt = card.querySelector('.news-excerpt');
        if (newsExcerpt) {
            newsExcerpt.style.webkitLineClamp = '3';
            newsExcerpt.style.display = '-webkit-box';
        }
        
        // Desplazar la vista a la tarjeta si es necesario
        const rect = card.getBoundingClientRect();
        const isInView = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        if (!isInView) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Cerrar tarjeta expandida (alias para compatibilidad)
    function closeExpandedCard() {
        const expandedCard = document.querySelector('.news-card.expanded');
        if (expandedCard) {
            collapseCard(expandedCard);
        } else {
            // Si no hay tarjeta expandida pero el overlay está activo, limpiar
            if (newsOverlay && newsOverlay.classList.contains('active')) {
                newsOverlay.classList.remove('active');
                document.body.style.overflow = '';
                isExpanded = false;
            }
        }
    }

    // No necesitamos el manejador de eventos del overlay

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (isExpanded && !e.target.closest('.news-card.expanded')) {
            closeExpandedCard();
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isExpanded) {
            closeExpandedCard();
        }
    });


    // Cargar noticias al iniciar
    loadNoticias();
});
