export interface UserProfile {
    nombre: {
        idNombre: number;
        primerNombre: string;
        segundoNombre?: string;
        primerApellido: string;
        segundoApellido?: string;
    };
    edad: number;
    correo: string;
    dni: string;
    telefono: string;
    valoracion: number;
    fotoPerfil: string;
    horarioDisponibleInicio: string;
    horarioDisponibleFin: string;
    rol: {
        idRol: number;
        rol: string;
    };
    experiencia?: [];
    conocimiento?: [];
    materia_tutor?:{
        materia: {
            idMateria: number;
            idCategoria: number;
            materia: string;
        };
    }[];

}
