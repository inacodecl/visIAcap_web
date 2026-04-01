export interface ProyectoFuturo {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    categoria: string;
    icono: string;
}

export interface Noticia {
    id: number;
    titulo: string;
    resumen: string;
    fecha: string;
    imagen: string;
    etiqueta: string;
}

export interface EventoProximamente {
    id: number;
    titulo: string;
    descripcion: string;
    fechaTexto: string;
    icono: string;
    ubicacion: string;
    imagen: string;
}

export interface EventoEsteMes {
    id: number;
    titulo: string;
    descripcion: string;
    dia: string;
    mes: string;
    tipo: string;
}
