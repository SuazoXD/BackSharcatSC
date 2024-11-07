"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dot, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { UserProfile } from "../../interfaces/UserProfile";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const GuestContent = () => {
  const searchParams = useSearchParams();
  const idTutor = searchParams.get('tutor');
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/profile/view-only/${idTutor}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }

        const data: UserProfile = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error(`Error al obtener la informacion del usuario: ${error}`);
      }
    };
    fetchProfileData();
  }, [idTutor]);  // Añadir idTutor como dependencia
  
  const formatTime = (timeString: any) => {
    const date = new Date(timeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Perfil del tutor</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="sm:grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-4 w-full">
          <div className="shadow rounded min-h-[25vh] sm:min-h-[40vh]">
            <div className="flex justify-center sm:mt-6">
              <img src={profileData?.fotoPerfil} className="mt-5 rounded-full w-[10vh] sm:w-[16vh] sm:h-[16vh]" alt="" />
            </div>
            <div className="flex flex-col text-sm mt-5 text-center">
              <p className="font-thin">{profileData?.nombre.primerNombre} {profileData?.nombre.primerApellido}</p>
              <p className="font-light">{profileData?.correo}</p>
              <p className="flex justify-center font-light">{profileData?.valoracion}
                <Star className="w-4 h-4 ml-1 text-yellow-500" />
              </p>
            </div>
          </div>

          <div className="col-start-2 col-end-4 h-full rounded py-3 mt-4 sm:mt-0 flex items-center justify-center shadow">
            <div className="flex flex-col space-y-2 sm:space-y-5 text-sm">
              <div className="flex mx-3 w-auto">
                <p>Nombre: </p>
                <p className="ml-2">{profileData?.nombre.primerApellido} {profileData?.nombre.segundoNombre} {profileData?.nombre.primerApellido} {profileData?.nombre.segundoApellido}</p>
              </div>
              <div className="flex mx-3 w-auto">
                <p>Edad: </p>
                <p className="ml-2">{profileData?.edad} años</p>
              </div>
              <div className="flex mx-3 w-auto">
                <p>Horario de inicio (inicio):</p>
                <p className="ml-2">{formatTime(profileData?.horarioDisponibleInicio)}</p>
              </div>
              <div className="flex mx-3 w-auto">
                <p>Hora disponible (fin):</p>
                <p className="ml-2">{formatTime(profileData?.horarioDisponibleFin)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3 sm:gap-2 lg:gap-4 w-full h-[30vh]">
          <div className="h-full shadow rounded">
            <div className="w-auto ml-2 mt-2 lg:ml-4">
              <p className="font-bold">Experiencia</p>
            </div>
          </div>
          <div className="shadow rounded">
            <div className="w-auto ml-2 mt-2 lg:ml-4">
              <p className="font-bold">Materias de interes</p>
            </div>
            <div className="ml-4 mb-2 text-sm">
              {profileData?.materia_tutor?.map((materia) => (
                <p className="flex" key={materia.materia.idMateria}>
                  <Dot />
                  {materia.materia.materia}</p>
              ))}
            </div>
          </div>
          <div className="h-full shadow rounded">
            <div className="w-auto ml-2 mt-2 lg:ml-4">
              <p className="font-bold">Conocimientos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Guest = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <GuestContent />
  </Suspense>
);

export default Guest;
