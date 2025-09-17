// Importar configuración de Supabase
import { fetchIntegrantes } from '/js/config/supabase.js';

// Asegurarse de que Supabase esté disponible globalmente
if (!window.supabase) {
    console.error('Supabase no está disponible. Asegúrate de cargar la biblioteca de Supabase antes de este módulo.');
}

// Función para renderizar los integrantes en el DOM
async function renderIntegrantes() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;

    try {
        // Mostrar estado de carga
        teamGrid.innerHTML = '<div class="loading">Cargando integrantes...</div>';

        // Obtener datos de Supabase
        const { data: integrantes, error } = await fetchIntegrantes();

        if (error) throw error;

        // Limpiar el contenedor
        teamGrid.innerHTML = '';

        // Crear tarjetas para cada integrante
        if (integrantes && integrantes.length > 0) {
            integrantes.forEach(integrante => {
                const card = document.createElement('article');
                card.className = 'team-card';
                
                card.innerHTML = `
                    <picture class="member-photo">
                        <img src="${integrante.Imagen || '/pages/integrantes/assets/avatar-placeholder.svg'}" 
                             alt="Foto de ${integrante.Nombre}" 
                             loading="lazy" 
                             width="150" 
                             height="150">
                    </picture>
                    <h3>${integrante.Nombre || 'Nombre no disponible'}</h3>
                    <p>${integrante.Institucion || 'Institución no disponible'}</p>
                `;
                
                teamGrid.appendChild(card);
            });
        } else {
            teamGrid.innerHTML = '<p>No se encontraron integrantes.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los integrantes:', error);
        teamGrid.innerHTML = '<p class="error">Error al cargar los integrantes. Por favor, intente más tarde.</p>';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar los integrantes
    renderIntegrantes();
});

// Hacer la función disponible globalmente si es necesario
window.renderIntegrantes = renderIntegrantes;
