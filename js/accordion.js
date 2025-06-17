/**
 * Script para el funcionamiento del acordeón en la página de inicio
 * Maneja la funcionalidad de mostrar/ocultar el contenido del acordeón
 */

document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  if (accordionHeaders.length > 0) {
    // Inicializar acordeones
    accordionHeaders.forEach(button => {
      // Configurar atributos ARIA iniciales
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const contentId = button.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      
      // Asegurarse de que el contenido esté oculto inicialmente si no está expandido
      if (content && !isExpanded) {
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
      }
      
      // Agregar evento de clic
      button.addEventListener('click', toggleAccordion);
      
      // Permitir activación con teclado
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAccordion.call(this, e);
        }
      });
    });
    
    console.log('Acordeón inicializado correctamente');
  } else {
    console.warn('No se encontraron elementos .accordion-header');
  }
  
  /**
   * Función para alternar la visibilidad del contenido del acordeón
   * @param {Event} event - El evento de clic o teclado
   */
  function toggleAccordion(event) {
    event.preventDefault();
    
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    const contentId = this.getAttribute('aria-controls');
    const content = document.getElementById(contentId);
    const icon = this.querySelector('.accordion-icon');
    
    if (!content) {
      console.error('No se pudo encontrar el contenido del acordeón con ID:', contentId);
      return;
    }
    
    // Actualizar estado ARIA
    this.setAttribute('aria-expanded', !isExpanded);
    
    // Animar la altura del contenido
    if (isExpanded) {
      content.style.maxHeight = '0';
      if (icon) icon.textContent = '+';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (icon) icon.textContent = '−';
    }
    
    // Forzar repintado para asegurar la transición
    void content.offsetHeight;
  }
});
