/**
 * Interfaz que representa un evento en la línea de tiempo.
 * Combina datos estructurales y contenido localizado.
 */
export interface Historia {
    // --- Metadatos Estructurales (Tabla: historia) ---
    id: number;

    /**
     * Año del evento, fundamental para el ordenamiento en el Timeline.
     */
    anio: number;

    /**
     * Fecha exacta del evento, si aplica.
     */
    fecha?: Date | string;

    location?: string;

    /**
     * Controla la visibilidad del evento en el timeline público.
     * Mapeado desde tinyint(1).
     */
    visible: boolean;

    order_index: number;
    categoria_id?: number;

    /**
     * URL del recurso multimedia principal (imagen/video).
     */
    media_url?: string;

    created_by?: number;
    updated_by?: number;
    created_at: Date | string;
    updated_at: Date | string;

    // --- Datos de Contenido Localizado (Tabla: historia_i18n) ---
    // Estos campos se unen al objeto principal según el idioma seleccionado.

    /**
     * Código del idioma (ej: 'es', 'en').
     */
    locale?: string;

    titulo?: string;
    descripcion?: string;
    audio_url?: string;
}
