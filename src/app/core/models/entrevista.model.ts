export interface Entrevista {
    id: number;
    titulo: string;
    entrevistado: string;
    descripcion: string; // Breve bajada o contexto
    video_url: string;   // URL del video (YouTube o local assets)
    url_imagen: string;  // Thumbnail
    fecha_grabacion?: string;
    visible: boolean;
}
