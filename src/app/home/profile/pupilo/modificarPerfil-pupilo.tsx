"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

interface ProfileData {
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    edad: number;
    telefono: string;
    dni: string;
}

interface ActualizarInfoPupiloProps {
    onGoBack: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Definimos apiUrl

export default function ActualizarInfoPupilo({ onGoBack }: ActualizarInfoPupiloProps) {
    const { register, handleSubmit, setValue } = useForm<ProfileData>();
    const [profilePhoto, setProfilePhoto] = useState<string>("https://via.placeholder.com/150");
    const [message, setMessage] = useState<string>("Cargando detalles del perfil...");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const access_token = sessionStorage.getItem("access_token");

            if (!access_token) {
                setMessage("No estás autenticado. Redirigiendo al inicio de sesión...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
                return;
            }

            // Realizar la solicitud GET usando apiUrl
            fetch(`${apiUrl}/user/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
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
                    console.log("Datos obtenidos del perfil:", data);

                    setValue("primerNombre", data.nombre.primerNombre);
                    setValue("segundoNombre", data.nombre.segundoNombre);
                    setValue("primerApellido", data.nombre.primerApellido);
                    setValue("segundoApellido", data.nombre.segundoApellido);
                    setValue("edad", data.edad);
                    setValue("telefono", data.telefono);
                    setValue("dni", data.dni);
                    setProfilePhoto(data.fotoPerfil);
                    setMessage("");
                })
                .catch((error) => {
                    console.error("Error al obtener los detalles del perfil:", error);
                    setMessage("Error al obtener los detalles del perfil.");
                });
        }
    }, [setValue]);

    const onSubmit = async (data: ProfileData) => {
        const access_token = sessionStorage.getItem("access_token");
        if (!access_token) return;

        console.log("Datos enviados al backend:", data);

        try {
            // Realizar la solicitud PATCH usando apiUrl
            const response = await fetch(`${apiUrl}/user/update-info`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar los detalles del perfil.");
            }

            console.log("Perfil actualizado con éxito");
            onGoBack();
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
        }
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

            {/* Campos del Perfil */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="primerNombre" className="text-gray-700 font-medium">Primer Nombre:</label>
                <Input id="primerNombre" {...register("primerNombre")} />

                <label htmlFor="segundoNombre" className="text-gray-700 font-medium">Segundo Nombre:</label>
                <Input id="segundoNombre" {...register("segundoNombre")} />

                <label htmlFor="primerApellido" className="text-gray-700 font-medium">Primer Apellido:</label>
                <Input id="primerApellido" {...register("primerApellido")} />

                <label htmlFor="segundoApellido" className="text-gray-700 font-medium">Segundo Apellido:</label>
                <Input id="segundoApellido" {...register("segundoApellido")} />

                <label htmlFor="edad" className="text-gray-700 font-medium">Edad:</label>
                <Input type="number" id="edad" {...register("edad")} />

                <label htmlFor="telefono" className="text-gray-700 font-medium">Número de Teléfono:</label>
                <Input id="telefono" {...register("telefono")} />

                <label htmlFor="dni" className="text-gray-700 font-medium">DNI:</label>
                <Input id="dni" {...register("dni")} />
            </div>

            <div className="flex justify-between">
                <Button type="button" onClick={onGoBack}>Regresar</Button>
                <Button type="submit">Guardar Cambios</Button>
            </div>
        </form>
    );
}
