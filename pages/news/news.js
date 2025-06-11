document.addEventListener('DOMContentLoaded', () => {
    const newsPage = document.querySelector('.news-page');
    const newsCards = document.querySelectorAll('.news-card');
    let scrollPosition = 0;
    let isExpanded = false;

    // Cerrar tarjeta expandida y restaurar scroll
    function closeExpandedCard() {
        const expandedCard = document.querySelector('.news-card.expanded');
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
            document.body.style.overflow = '';
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, scrollPosition);
            document.documentElement.style.scrollBehavior = '';
            newsPage.classList.remove('has-expanded-card');
            isExpanded = false;
        }
    }

    // Manejar clic en tarjeta
    function handleCardClick(card, e) {
        e.stopPropagation();
        
        if (card.classList.contains('expanded')) {
            closeExpandedCard();
            return;
        }

        // Cerrar cualquier otra tarjeta abierta
        closeExpandedCard();
        
        // Guardar posición del scroll
        scrollPosition = window.scrollY;
        
        // Expandir la tarjeta clickeada
        card.classList.add('expanded');
        document.body.style.overflow = 'hidden';
        newsPage.classList.add('has-expanded-card');
        isExpanded = true;
    }

    // Event listeners
    newsCards.forEach(card => {
        card.addEventListener('click', (e) => handleCardClick(card, e));
    });

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
});
