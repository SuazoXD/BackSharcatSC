"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Dot } from "lucide-react";
import FormCategoriaMateria from "./formCategoriaInteres";
import { UserProfile } from "../../interfaces/UserProfile";

interface PerfilTutor {
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  correo?: string;
  edad?: number;
  foto?: File | null;
}

interface Conocimiento {
  institucion: string;
  tituloAcademico: string;
  fechaEgreso: string;
  descripcion: string;
}

interface Experiencia {
  puesto: string;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function PerfilTutor() {
  const { register, handleSubmit, setValue } = useForm<PerfilTutor>();
  const [foto, setFoto] = useState<File | null>(null);
  const [pestañaActiva, setPestañaActiva] = useState("datosPersonales");
  const [nombreMostrado, setNombreMostrado] = useState("Nombre Apellido");
  const [correoMostrado, setCorreoMostrado] = useState("correo@example.com");
  const [mensaje, setMensaje] = useState("Cargando detalles del perfil...");
  const [token, setToken] = useState<string | null>(null);
  const [esEditable, setEsEditable] = useState(false);
  const [valoracion, setValoracion] = useState(4); // Valoración del tutor
  const [profilePhoto, setProfilePhoto] = useState<string | null>("https://via.placeholder.com/150");

  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // Estados separados para cada sección
  const [conocimientos, setConocimientos] = useState<Conocimiento[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const access_token = sessionStorage.getItem("access_token");

      if (!access_token) {
        setMensaje("No estás autenticado. Redirigiendo al inicio de sesión...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
        return;
      }

      setToken(access_token);

      fetch(`${apiUrl}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los detalles del perfil.");
          }
          return response.json();
        })
        .then((data) => {

          setValue("primerNombre", data.nombre.primerNombre);
          setValue("segundoNombre", data.nombre.segundoNombre);
          setValue("primerApellido", data.nombre.primerApellido);
          setValue("segundoApellido", data.nombre.segundoApellido);
          setValue("correo", data.correo);
          setValue("edad", data.edad);
          setProfilePhoto(data.fotoPerfil);
          setValoracion(data.valoracion);
          setNombreMostrado(
            `${data.nombre.primerNombre || ""} ${data.nombre.primerApellido || ""}`.trim()
          );
          setCorreoMostrado(data.correo);
          setProfileData(data);
          setMensaje("");
        })
        .catch((error) => {
          console.error("Error al obtener los detalles del perfil:", error);
          setMensaje("Error al obtener los detalles del perfil.");
        });
    }
  }, [setValue]);

  const onSubmit = async (data: PerfilTutor) => {
    if (!token) return;

    console.log("Datos enviados al backend:", data);

    try {
      const response = await fetch(`${apiUrl}/user/update-info`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los detalles del perfil.");
      }

      console.log("Perfil actualizado con éxito");
      setNombreMostrado(`${data.primerNombre || ""} ${data.primerApellido || ""}`.trim());
      setCorreoMostrado(data.correo || correoMostrado);
      setEsEditable(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };


  const agregarConocimiento = (conocimiento: Conocimiento) => {
    setConocimientos((prev) => [...prev, conocimiento]);
  };

  const agregarExperiencia = (experiencia: Experiencia) => {
    setExperiencias((prev) => [...prev, experiencia]);
  };

  const manejarCambioFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fotoSeleccionada = e.target.files[0];
      setFoto(fotoSeleccionada);
    }
  };

  // Función para renderizar las estrellas
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-${i <= valoracion ? "yellow" : "gray"}-500`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (mensaje) {
    return <p>{mensaje}</p>;
  }

  return (
    <>
    <div className="sm:flex sm:space-x-6 lg:flex-wrap">
      {/* Card para la foto de perfil */}
      <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md sm:w-60">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          
            <img src={profilePhoto ?? undefined} alt="Foto de perfil" className="w-full h-full object-cover" />
          
        </div>
        <Input type="file" accept="image/*" onChange={manejarCambioFoto} className="my-2 mt-4 max-w-[40vh] " />
        {foto && <p className="text-sm text-gray-500">Foto seleccionada: {foto.name}</p>}
        <p className="font-medium mt-2">{nombreMostrado}</p>
        <p className="text-sm text-gray-500">{correoMostrado}</p>

        {/* Estrellas de valoración */}
        <div className="flex space-x-1 mt-2">{renderStars()}</div>

        {/* Sección de comentarios */}
        <div className="mt-4">
          <h3 className="font-medium text-gray-700">Comentarios:</h3>
          {/* {comentarios.length > 0 ? (
            comentarios.map((comentario, index) => (
              <p key={index} className="text-sm text-gray-600 mt-1">
                {comentario}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">Sin comentarios aún.</p>
          )} */}
        </div>
      </div>

      {/* Card para los datos personales y pestañas */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1 mt-5 max-w-3xl">
        <div className="border-b mb-4 pb-2 flex space-x-6">
          <button
            className={`font-medium ${
              pestañaActiva === "datosPersonales" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setPestañaActiva("datosPersonales")}
          >
            Datos Personales
          </button>
          <button
            className={`font-medium ${
              pestañaActiva === "materias" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setPestañaActiva("materias")}
          >
            Materias
          </button>
          <button
            className={`font-medium ${
              pestañaActiva === "conocimientos" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setPestañaActiva("conocimientos")}
          >
            Conocimientos
          </button>
          <button
            className={`font-medium ${
              pestañaActiva === "experiencia" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setPestañaActiva("experiencia")}
          >
            Experiencia
          </button>
        </div>

        {/* Renderizado condicional de cada pestaña */}
        {pestañaActiva === "datosPersonales" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Datos Personales */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Primer Nombre:</label>
              <Input className="my-2" {...register("primerNombre")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Segundo Nombre:</label>
              <Input className="my-2" {...register("segundoNombre")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Primer Apellido:</label>
              <Input className="my-2" {...register("primerApellido")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Segundo Apellido:</label>
              <Input className="my-2" {...register("segundoApellido")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Correo:</label>
              <Input className="my-2" type="email" {...register("correo")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Edad:</label>
              <Input className="my-2" type="number" {...register("edad")} disabled={!esEditable} />
            </div>
            <div className="flex space-x-4">
              <Button type="button" onClick={() => setEsEditable(!esEditable)}>
                {esEditable ? "Cancelar" : "Editar"}
              </Button>
              {esEditable && <Button type="submit">Guardar Cambios</Button>}
            </div>
          </form>
        ) : pestañaActiva === "materias" ? (
          <div className="space-y-4">
            {/* Materias */}
            <FormCategoriaMateria/>
          </div>
        ) : pestañaActiva === "conocimientos" ? (
          <div className="space-y-4">
            {/* Conocimientos */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const conocimiento = {
                  institucion: (form.institucion as HTMLInputElement).value,
                  tituloAcademico: (form.tituloAcademico as HTMLInputElement).value,
                  fechaEgreso: (form.fechaEgreso as HTMLInputElement).value,
                  descripcion: (form.descripcion as HTMLInputElement).value,
                };
                agregarConocimiento(conocimiento);
              }}
              className="space-y-4"
            >
              {/* Campos para Conocimientos */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Institución:</label>
                <Input name="institucion" className="my-2" placeholder="Nombre de la Institución" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Título Académico:</label>
                <Input name="tituloAcademico" className="my-2" placeholder="Título Académico" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Fecha de Egreso:</label>
                <Input name="fechaEgreso" className="my-2" type="date" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Descripción:</label>
                <Input name="descripcion" className="my-2" placeholder="Descripción" />
              </div>
              <Button type="submit">Guardar Conocimientos</Button>
            </form>

            {/* Mostrar los conocimientos guardados */}
            {conocimientos.map((conocimiento, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                <p className="font-medium">{conocimiento.institucion}</p>
                <p>{conocimiento.tituloAcademico}</p>
                <p className="text-sm text-gray-600">{conocimiento.fechaEgreso}</p>
                <p className="text-sm text-gray-600">{conocimiento.descripcion}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Experiencia */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const experiencia = {
                  puesto: (form.puesto as HTMLInputElement).value,
                  empresa: (form.empresa as HTMLInputElement).value,
                  fechaInicio: (form.fechaInicio as HTMLInputElement).value,
                  fechaFin: (form.fechaFin as HTMLInputElement).value,
                  descripcion: (form.descripcion as HTMLInputElement).value,
                };
                agregarExperiencia(experiencia);
              }}
              className="space-y-4"
            >
              {/* Campos para Experiencia */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Puesto:</label>
                <Input name="puesto" className="my-2" placeholder="Nombre del Puesto" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Empresa:</label>
                <Input name="empresa" className="my-2" placeholder="Nombre de la Empresa" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Fecha de Inicio:</label>
                <Input name="fechaInicio" className="my-2" type="date" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Fecha de Finalización:</label>
                <Input name="fechaFin" className="my-2" type="date" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">Descripción:</label>
                <Input name="descripcion" className="my-2" placeholder="Descripción" />
              </div>
              <Button type="submit">Guardar Experiencia</Button>
            </form>

            {/* Mostrar las experiencias guardadas */}
            {experiencias.map((experiencia, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                <p className="font-medium">{experiencia.puesto}</p>
                <p>{experiencia.empresa}</p>
                <p className="text-sm text-gray-600">{experiencia.fechaInicio} - {experiencia.fechaFin}</p>
                <p className="text-sm text-gray-600">{experiencia.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
      <div className="grid gap-3 md:grid-cols-3 sm:gap-2 mt-5 lg:gap-4 w-full h-[30vh]">
            <div className=" h-full shadow-md rounded">
                <div className="w-auto ml-2 mt-2 lg:ml-4">
                    <p className="font-bold">Experiencia</p>
                </div>
            </div>
            <div className="shadow-md rounded">
                <div className="w-auto ml-2 mt-2 lg:ml-4">
                    <p className="font-bold">Materias de interes</p>
                </div>
                <div className="ml-4 mb-2 text-sm">
                    {profileData?.materia_tutor?.map((materia) => (
                        <p className="flex" key={materia.materia.idMateria}>
                            <Dot/>
                            {materia.materia.materia}</p>
                    ))}
                </div>
            </div>
            <div className="h-full shadow-md rounded">
                <div className="w-auto ml-2 mt-2 lg:ml-4">
                    <p className="font-bold">Conocimientos</p>
                </div>
            </div>
        </div>
      </>
  );
}