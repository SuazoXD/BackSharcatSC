interface UserProfile {
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
    horarioDisponibleInicio: any;
    horarioDisponibleFin: any;
    rol: {
        idRol: number;
        rol: string;
    };
    experiencia?: any[];
    conocimiento?: any[];
    materia_tutor?:{
        materia: {
            idMateria: number;
            idCategoria: number;
            materia: string;
        };
    }[];

}
