export interface OfferCreate{
    idPregunta?: number;
    idEstadoOferta?: number;
    descripcion: string;
    fechaOferta?: any;
}

export interface Offer{
    idOferta: number;
    estadoOfertaSolucion?:{
        idEstadoOferta: number;
        estadoOferta: string;
    };
    idPregunta: number;
    descripcion: string;
    fechaOferta?: any;
    usuario: {
        valoracion?: number,
        correo?: string,
        idUsuario: number,
        fotoPerfil: string,
        nombre: {
            primerNombre: string;
            primerApellido: string;
        }
    }
}