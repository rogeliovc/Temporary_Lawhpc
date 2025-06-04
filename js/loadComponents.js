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
        console.log(`Intentando cargar componente desde: ${componentPath}`);
        const response = await fetch(componentPath, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Error al cargar el componente: ${componentPath}. Estado: ${response.status}`);
        }
        const html = await response.text();
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.outerHTML = html;
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
        // Verificar si el estilo ya está cargado
        const existingStyles = document.querySelectorAll('link[rel="stylesheet"]');
        const styleAlreadyLoaded = Array.from(existingStyles).some(style => 
            style.href.includes('footer.css')
        );
        
        if (styleAlreadyLoaded) {
            console.log('ℹ️ Los estilos ya están cargados');
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
            console.error('❌ Error cargando estilos:', error);
            reject(error);
        };
        document.head.appendChild(link);
    });
}

// Función principal para cargar el footer
async function initializeFooter() {
    const basePath = getBasePath();
    console.log('🔄 Inicializando footer...');
    console.log('📁 Ruta base calculada:', basePath || '(raíz del sitio)');
    
    try {
        // Cargar estilos primero
        await loadStyles(`/css/components/footer.css`);
        
        // Luego cargar el contenido del footer
        const footerLoaded = await loadComponent(
            `/components/footer.html`,
            'footerContainer'
        );
        
        // Asegurarse de que los enlaces en el footer usen rutas absolutas
        const footerLinks = document.querySelectorAll('#footerContainer a[href^="../"]');
        footerLinks.forEach(link => {
            const absolutePath = link.getAttribute('href').replace(/^\.\.\//, '/');
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

// Cargar el footer cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFooter);
} else {
    initializeFooter();
}
