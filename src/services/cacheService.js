// Claves para identificar los datos en el almacenamiento local del navegador
const CACHE_KEY = 'senafim_pesajes_data';
const CACHE_TIMESTAMP_KEY = 'senafim_pesajes_timestamp';

/**
 * Recupera los datos de la caché si siguen siendo válidos según el TTL.
 * @param {number} ttlMinutos Tiempo de vida de la caché en minutos.
 */
export const obtenerDatosCache = (ttlMinutos = 5) => {
    const datosGuardados = localStorage.getItem(CACHE_KEY);
    const timestampGuardado = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (!datosGuardados || !timestampGuardado) return null;

    const ahora = new Date().getTime();
    const tiempoLimite = parseInt(timestampGuardado) + (ttlMinutos * 60 * 1000);

    // Si el tiempo actual superó el límite permitido, la caché expiró
    if (ahora > tiempoLimite) {
        limpiarCache();
        return null;
    }

    return JSON.parse(datosGuardados);
};

/**
 * Guarda los datos de la API en la caché junto con la marca de tiempo actual.
 */
export const guardarEnCache = (datos) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(datos));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().getTime().toString());
};

/**
 * Borra por completo los datos cacheados para forzar una sincronización limpia.
 */
export const limpiarCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
};