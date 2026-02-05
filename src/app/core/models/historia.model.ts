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
     * URL del recurso multimedia principal (Portada).
     */
    media_url?: string;

    /**
     * Galería multimedia enriquecida (v2).
     */
    media?: HistoriaMedia[];

    /**
     * Etiquetas asociadas (v2).
     */
    tags?: HistoriaTag[];

    created_by?: number;
    updated_by?: number;
    created_at: Date | string;
    updated_at: Date | string;

    // --- Datos de Contenido Localizado (Tabla: historia_i18n) ---
    locale?: string;
    titulo?: string;
    descripcion?: string;
    audio_url?: string;
}

export interface HistoriaMedia {
    id?: number;
    url: string;
    tipo: 'image' | 'video' | 'audio';
    alt?: string;
}

export interface HistoriaTag {
    id: number;
    slug: string;
    nombre: string;
}
