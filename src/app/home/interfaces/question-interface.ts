export interface Question{
    idPregunta: number;
    idUsuarioPupilo: number;
    titulo: string;
    descripcion: string;
    fechaPublicacion: any;
    materia: {
        materia: string
    };
    imgpregunta:{
        img: string
    }[];
    ofertaresolucion?: {
        idOferta: number,
        idEstadoOferta: {
            idEstadoOferta: number;
            estadoOferta: string;
        },
        idPregunta: number,
        descripcion: string,
        fechaOferta: any,
        usuario: {
            idUsuario: number,
            fotoPerfil: string,
            nombre: {
                primerNombre: string,
                primerApellido: string
            }
        }
    }[];
}

type ofertareSolucion = Pick<Question, "ofertaresolucion">;