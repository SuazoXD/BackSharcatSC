"use client"

import { useEffect, useState } from "react";
import { Categoria, Materia, MateriaTutor } from "../../interfaces/categories";
import { getCategories } from "../../home.api";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FormCategoriaMateria() {
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedMateria, setSelectedMateria] = useState<number | null>(null);

    const router = useRouter();

    const {register, handleSubmit, reset} = useForm<MateriaTutor>();

    const alertAddMateriaSuccess = () => {
        toast.success("Materia agregada con exito", {
            position: "top-right"
        });
    }

    // Llenar las categorias
    useEffect(()=>{
        const fetchCategorias =async () => {
            try {
                const data: Categoria[] = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error al obtener categorias:", error);
            }
        }
        fetchCategorias();
    }, [])

    // Llenar las materias
    useEffect(() => {
        if(selectedCategory !== null){
            fetch(`${apiUrl}/categories/materia/${selectedCategory}`)
                .then(response => response.json())
                .then((data: Materia[]) => setMaterias(data))
                .catch(error => console.error('Error al cargar las materias:', error));
        } else {
            setMaterias([]);
        }
    },[selectedCategory]);

    // Enviar el interes del tutor al servidor
    const onSubmit:SubmitHandler<MateriaTutor> = async (data) => {

        const materiaInteres = {
            "idMateria": data.idMateria   
        }

        const access_token = sessionStorage.getItem("access_token");

        if(!access_token){
            console.error("Token de autenticación no encontrado.");
            return; 
        }

        try {
            const res = await fetch(`${apiUrl}/user/materia-interes/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`
                },
                body: JSON.stringify(materiaInteres)
            });

            if(!res.ok){
                const errData = res.json();
                console.error(errData);
            }

            alertAddMateriaSuccess();
            reset();
            router.refresh();
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="categorySelect" className="text-gray-700 font-medium">
                        Seleccione una categoria
                    </label>

                    <select 
                        id="cbCategories"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCategory ?? ''}
                        onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
                    >
                        {
                            categories.map(category => (
                                <option value={category.idCategoria} key={category.idCategoria}>
                                    {category.categoria}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Materia */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="materiaSelect" className="text-gray-700 font-medium">
                        Selecciona una materia:
                    </label>

                    <select
                        id="MateriaSelect"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedMateria ?? ''}
                        disabled={!selectedCategory}
                        {...register("idMateria", {
                            required: true,
                            onChange: (e) => {
                                const value = Number(e.target.value) || null;
                                setSelectedMateria(value); 
                            }
                        })}
                    >
                        {
                            materias.map(materia => (
                                <option key={materia.idMateria} value={materia.idMateria}>
                                    {materia.materia}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <Button type={"submit"}>Enviar</Button>
            </form>
        </>
    )    
}