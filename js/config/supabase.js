// Configuración de Supabase
export const SUPABASE_URL = 'https://vybuapucyiprbyawbhkh.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5YnVhcHVjeWlwcmJ5YXdiaGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzcwMjMsImV4cCI6MjA3MzcxMzAyM30.hyWGaJb17pLzuam5zsN7Wx6bynjKd2dhkEkKhwj76gs';

// Inicializar Supabase usando la instancia global
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Función para obtener los integrantes
export const fetchIntegrantes = async () => {
    try {
        console.log('Obteniendo integrantes de Supabase...');
        const { data, error } = await supabase
            .from('integrantes')
            .select('id, Nombre, Institucion, Imagen')
            .order('Nombre', { ascending: true });

        if (error) {
            console.error('Error en la consulta a Supabase:', error);
            throw error;
        }
        
        console.log('Integrantes obtenidos:', data);
        return { data, error: null };
    } catch (error) {
        console.error('Error al obtener los integrantes:', error);
        return { data: null, error };
    }
};

// Función para obtener noticias
export const fetchNoticias = async () => {
    try {
        console.log('Obteniendo noticias de Supabase...');
        const { data, error } = await supabase
            .from('noticias')
            .select('id, titulo, contenido, imagen, fecha_publicacion')
            .order('fecha_publicacion', { ascending: false });

        if (error) {
            console.error('Error en la consulta de noticias:', error);
            throw error;
        }
        
        console.log('Noticias obtenidas:', data);
        return { data, error: null };
    } catch (error) {
        console.error('Error al obtener las noticias:', error);
        return { data: null, error };
    }
};
