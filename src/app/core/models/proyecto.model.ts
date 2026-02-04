export enum ProyectoTipo {
    Presente = 'presente',
    Futuro = 'futuro'
}

/**
 * Interfaz para Proyectos (Presente y Futuro).
 * Combina configuración base y textos.
 */
// --- Interfaces Auxiliares ---

export interface ProyectoMedia {
    id: number;
    proyecto_id: number;
    tipo: 'image' | 'video' | 'audio';
    url: string;
    alt_es?: string;
    alt_en?: string;
    order_index: number;
}

export interface ProyectoMiembro {
    proyecto_id: number;
    nombre: string;
    rol?: string;
    contacto?: string;
}

export interface ProyectoTag {
    id: number;
    nombre: string;
    slug: string;
}

export interface ProyectoCategoria {
    id: number;
    nombre: string;
    slug: string;
}

/**
 * Interfaz para Proyectos (Presente y Futuro).
 * Combina configuración base y textos localizados.
 */
export interface Proyecto {
    // --- Datos Base (Tabla: proyectos) ---
    id: number;
    slug: string;

    /**
     * Clasificación del proyecto: 'presente' (actual) o 'futuro' (proyección).
     */
    tipo: ProyectoTipo;

    /**
     * Destacado en la portada o secciones principales.
     * Mapeado desde tinyint(1).
     */
    featured: boolean;

    order_index: number;
    image_cover_url?: string;
    url_externa?: string;

    start_date?: Date | string;
    end_date?: Date | string;
    location?: string;

    /**
     * Estado de publicación.
     * Si es false, solo visible para Admin/SuperAdmin.
     */
    is_published: boolean;

    created_by?: number;
    updated_by?: number;
    created_at: Date | string;
    updated_at: Date | string;

    // --- Datos Localizados (Tabla: proyectos_i18n) ---

    locale?: string;
    titulo?: string;
    resumen?: string;
    descripcion?: string;

    // --- Relaciones (Optional for listings, Required for Details) ---
    images?: ProyectoMedia[];
    members?: ProyectoMiembro[];
    tags?: ProyectoTag[];
    categories?: ProyectoCategoria[];
}
