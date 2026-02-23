export interface Entrevista {
    id: number;
    titulo: string;
    entrevistado: string;
    descripcion: string; // Breve bajada o contexto
    url_video: string;   // URL del video (YouTube o local assets)
    url_imagen: string;  // Thumbnail
    fecha_grabacion?: string;
    visible: boolean;

    // --- Auditoría Obligatoria (Golden Standard) ---
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;

    // --- Campos Virtuales (LEFT JOIN Frontend) ---
    creator_email?: string;
    updater_email?: string;
}
