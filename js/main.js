// main.js - Archivo principal de JavaScript para LAW HPC
// Este archivo se cargará al final del body para mejorar el rendimiento

document.addEventListener('DOMContentLoaded', function() {
    console.log('LAW HPC - Página cargada correctamente');
    
    // Aquí puedes agregar cualquier funcionalidad de JavaScript que necesites
    // Por ejemplo:
    // - Navegación suave
    // - Animaciones
    // - Validación de formularios
    // - Llamadas a APIs
    
    // Ejemplo de funcionalidad: Resaltar el enlace de navegación activo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
});

// Funciones de utilidad
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
