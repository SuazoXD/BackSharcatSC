"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface ProfileData {
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    imgPerfil?: string;
    edad: number;
    telefono: string;
    dni: string;
    valoracion: number; // Nuevo campo para la valoración
}

interface ProfileCardProps {
    onEditClick: () => void; // Definir la prop onEditClick
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Definimos apiUrl

export default function ProfileCard({ onEditClick }: ProfileCardProps) {
    const { register, handleSubmit, setValue } = useForm<ProfileData>();
    const [profilePhoto, setProfilePhoto] = useState<string>("https://via.placeholder.com/150");
    const [message, setMessage] = useState<string>("Cargando detalles del perfil...");
    const [valoracion, setValoracion] = useState<number>(0); // Estado para la valoración

    // useEffect para obtener el token al cargar la página y realizar la solicitud GET
    useEffect(() => {
        if (typeof window !== "undefined") {
            const access_token = sessionStorage.getItem("access_token");

            if (!access_token) {
                setMessage("No estás autenticado. Redirigiendo al inicio de sesión...");
                setTimeout(() => {
                    window.location.href = "/login"; // Redirigir si no hay token
                }, 3000);
                return;
            }

            // Realizar la solicitud GET usando fetch con apiUrl
            fetch(`${apiUrl}/user/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`, // Usar el token en los headers
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al obtener los detalles del perfil.");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Datos obtenidos del perfil:", data); // Mostrar la información obtenida

                    // Asignar los datos obtenidos a los campos de entrada
                    setValue("primerNombre", data.nombre.primerNombre);
                    setValue("segundoNombre", data.nombre.segundoNombre);
                    setValue("primerApellido", data.nombre.primerApellido);
                    setValue("segundoApellido", data.nombre.segundoApellido);
                    setValue("edad", data.edad);
                    setValue("telefono", data.telefono);
                    setValue("dni", data.dni);
                    setValoracion(data.valoracion); // Guardar la valoración
                    // setProfileData(data);
                    setProfilePhoto(data.fotoPerfil);
                    setMessage(""); // Limpiar el mensaje al cargar los datos
                    // console.log(data);
                })
                .catch((error) => {
                    console.error("Error al obtener los detalles del perfil:", error);
                    setMessage("Error al obtener los detalles del perfil.");
                });
        }
    }, [setValue]);

    const onSubmit = (data: ProfileData) => {
        console.log("Datos del perfil:", data);
        // Aquí se llamará al servicio de actualización
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const photoURL = URL.createObjectURL(file);
            setProfilePhoto(photoURL);
        }
    };

    if (message) {
        return <p>{message}</p>;
    }

    // Generar estrellas basadas en la valoración, teniendo en cuenta los valores decimales
    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < Math.floor(valoracion)) {
                // Estrella completa
                stars.push(<Star key={i} color="rgb(253, 158, 7)" fill="rgb(253, 158, 7)" />);
            } else if (i < valoracion) {
                // Estrella parcial
                stars.push(<Star key={i} color="rgb(253, 158, 7)" fill="url(#halfGradient)" />);
            } else {
                // Estrella vacía
                stars.push(<Star key={i} color="gray" fill="none" />);
            }
        }
        return (
            <>
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="halfGradient" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="50%" stopColor="rgb(253, 158, 7)" />
                            <stop offset="50%" stopColor="gray" />
                        </linearGradient>
                    </defs>
                </svg>
                {stars}
            </>
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center space-y-2">
                <img
                    src={profilePhoto}
                    alt="Foto de Perfil"
                    className="w-24 h-24 rounded-full object-cover"
                />
                <label htmlFor="photoUpload" className="text-blue-500 cursor-pointer">
                    Cambiar Foto
                </label>
                <input
                    type="file"
                    id="photoUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                />
            </div>

            {/* Campos del Perfil (no editables) */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="primerNombre" className="text-gray-700 font-medium">Primer Nombre:</label>
                <Input id="primerNombre" {...register("primerNombre")} disabled />

                <label htmlFor="segundoNombre" className="text-gray-700 font-medium">Segundo Nombre:</label>
                <Input id="segundoNombre" {...register("segundoNombre")} disabled />

                <label htmlFor="primerApellido" className="text-gray-700 font-medium">Primer Apellido:</label>
                <Input id="primerApellido" {...register("primerApellido")} disabled />

                <label htmlFor="segundoApellido" className="text-gray-700 font-medium">Segundo Apellido:</label>
                <Input id="segundoApellido" {...register("segundoApellido")} disabled />

                <label htmlFor="edad" className="text-gray-700 font-medium">Edad:</label>
                <Input type="number" id="edad" {...register("edad")} disabled />

                <label htmlFor="telefono" className="text-gray-700 font-medium">Número de Teléfono:</label>
                <Input id="telefono" {...register("telefono")} disabled />

                <label htmlFor="dni" className="text-gray-700 font-medium">DNI:</label>
                <Input id="dni" {...register("dni")} disabled />
            </div>

            {/* Estrellas de valoración */}
            <div className="flex space-x-1">{renderStars()}</div>

            <Button type="button" onClick={onEditClick}>Actualizar Información</Button>
        </form>
    );
}
