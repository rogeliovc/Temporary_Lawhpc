// Función para obtener la ruta base correcta
function getBasePath() {
    const currentPath = window.location.pathname;
    // Si estamos en la raíz
    if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
        return '';
    }
    // Si estamos en una subcarpeta (como /pages/agenda/)
    if (currentPath.includes('/pages/')) {
        const depth = currentPath.split('/').filter(Boolean).length - 1;
        return '../'.repeat(depth - 1);
    }
    return '';
}

// Función para cargar componentes HTML de manera dinámica
async function loadComponent(componentPath, targetElementId) {
    try {
        // Asegurarse de que la ruta sea absoluta
        if (!componentPath.startsWith('/')) {
            componentPath = '/' + componentPath;
        }
        
        console.log(`Intentando cargar componente desde: ${componentPath}`);
        const response = await fetch(componentPath, { 
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/html'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error al cargar el componente: ${componentPath}. Estado: ${response.status}`);
        }
        
        const html = await response.text();
        const targetElement = document.getElementById(targetElementId);
        
        if (targetElement) {
            targetElement.innerHTML = html; // Usar innerHTML en lugar de outerHTML
            console.log(`✅ Componente cargado correctamente: ${componentPath}`);
            return true;
        } else {
            console.error(`❌ Elemento con ID '${targetElementId}' no encontrado`);
            return false;
        }
    } catch (error) {
        console.error('❌ Error cargando el componente:', error);
        return false;
    }
}

// Función para cargar estilos
function loadStyles(stylePath) {
    return new Promise((resolve, reject) => {
        // Obtener el nombre del archivo de la ruta
        const styleName = stylePath.split('/').pop();
        
        // Verificar si el estilo ya está cargado
        const existingStyles = document.querySelectorAll('link[rel="stylesheet"]');
        const styleAlreadyLoaded = Array.from(existingStyles).some(style => 
            style.href.includes(styleName)
        );
        
        if (styleAlreadyLoaded) {
            console.log(`ℹ️ Los estilos de ${styleName} ya están cargados`);
            resolve(true);
            return;
        }
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = stylePath;
        link.onload = () => {
            console.log(`✅ Estilos cargados: ${stylePath}`);
            resolve(true);
        };
        link.onerror = (error) => {
            console.error(`❌ Error cargando estilos (${stylePath}):`, error);
            reject(error);
        };
        document.head.appendChild(link);
    });
}

// Función para inicializar el menú móvil
function initializeMobileMenu() {
    // Esperar un breve momento para asegurar que el DOM esté listo
    setTimeout(() => {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.main-nav');
        
        if (menuToggle && nav) {
            // Remover event listeners previos para evitar duplicados
            const newToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newToggle, menuToggle);
            
            newToggle.addEventListener('click', (e) => {
                e.preventDefault();
                newToggle.classList.toggle('active');
                nav.classList.toggle('active');
                document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            });
            
            // Cerrar menú al hacer clic en un enlace
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                // Remover event listeners previos
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                newLink.addEventListener('click', (e) => {
                    // Solo cerrar el menú si es un enlace interno
                    if (newLink.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                    }
                    newToggle.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }, 100); // Pequeño retraso para asegurar que el DOM esté listo
}

// Función principal para cargar el header
async function initializeHeader() {
    console.log('🔄 Inicializando header...');
    
    try {
        // Cargar estilos primero
        await loadStyles('/css/components/header.css');
        
        // Verificar si el contenedor ya existe
        let headerContainer = document.getElementById('headerContainer');
        
        if (!headerContainer) {
            // Crear contenedor para el header si no existe
            headerContainer = document.createElement('div');
            headerContainer.id = 'headerContainer';
            document.body.insertBefore(headerContainer, document.body.firstChild);
        }
        
        // Cargar el contenido del header
        const headerLoaded = await loadComponent(
            '/components/header.html',
            'headerContainer'
        );
        
        // Asegurarse de que los enlaces en el header usen rutas absolutas
        const headerLinks = document.querySelectorAll('#headerContainer a[href^="../"]');
        headerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const absolutePath = href.replace(/\.\.\//g, '/');
                link.setAttribute('href', absolutePath);
            }
        });
        
        // Marcar el enlace activo basado en la URL actual
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath && currentPath.endsWith(linkPath) || 
                (linkPath !== '/' && currentPath.includes(linkPath))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Inicializar menú móvil
        initializeMobileMenu();
        
        if (!headerLoaded) {
            console.error('❌ No se pudo cargar el header');
        } else {
            console.log('✨ Header cargado exitosamente');
        }
    } catch (error) {
        console.error('❌ Error durante la carga del header:', error);
    }
}

// Función principal para cargar el footer
async function initializeFooter() {
    console.log('🔄 Inicializando footer...');
    
    try {
        // Cargar estilos primero
        await loadStyles('/css/components/footer.css');
        
        // Luego cargar el contenido del footer
        const footerLoaded = await loadComponent(
            '/components/footer.html',
            'footerContainer'
        );
        
        // Asegurarse de que los enlaces en el footer usen rutas absolutas
        const footerLinks = document.querySelectorAll('#footerContainer a[href^="../"]');
        footerLinks.forEach(link => {
            const absolutePath = link.getAttribute('href').replace(/\.\.\//, '/');
            link.setAttribute('href', absolutePath);
        });
        
        if (!footerLoaded) {
            console.error('❌ No se pudo cargar el footer');
        } else {
            console.log('✨ Footer cargado exitosamente');
        }
    } catch (error) {
        console.error('❌ Error durante la carga del footer:', error);
    }
}

// Función para inicializar todos los componentes
async function initializeComponents() {
    try {
        await initializeHeader();
        await initializeFooter();
    } catch (error) {
        console.error('❌ Error al inicializar componentes:', error);
    }
}

// Cargar componentes cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
} else {
    initializeComponents();
}
