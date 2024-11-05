"use client"

import { getCategories } from "../../home.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { number } from "zod";
import { Categoria, Materia } from "../../interfaces/categories";

interface Pregunta{
    idMateria: number,
    titulo: string,
    descripcion: string,
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function FormQuestion(){

    const [categories, setCategories] = useState<Categoria[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedMateria, setSelectedMateria] = useState<number | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    //manejar envio de pregunta
    const {register, handleSubmit, reset, setValue} = useForm<Pregunta>();
    const [files, setFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    

    useEffect(() => {
        const idCategoria = searchParams.get("idCategoria");
        const idMateria = searchParams.get("idMateria");
    
        if (idCategoria) {
          setSelectedCategory(Number(idCategoria));
        }
        if (idMateria) {
          setSelectedMateria(Number(idMateria));
          setValue("idMateria", Number(idMateria));
        }
      }, []);

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

    // Manejar el cambio de archivos
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);

        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setFilePreviews(previews);
    }

    const removeFile = (index: number) => {
        const newFiles = [...files];
        const newPreviews = [...filePreviews];

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setFiles(newFiles);
        setFilePreviews(newPreviews);
    }
    
    // Enviar pregunta al servidor
    const onSubmit:SubmitHandler<Pregunta> = async (data) => {
        const formData = new FormData();
        const defaultQuestionState:number = 1;

        formData.append("titulo",data.titulo);
        formData.append("descripcion",data.descripcion);
        formData.append("idMateria", data.idMateria.toString());
        formData.append("idEstadoPregunta",defaultQuestionState.toString());

        files.map(file => {
            formData.append("files", file);
        });
        console.log("Contenido de FormData:");
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        //JWT

        const access_token = sessionStorage.getItem("access_token");

        if (!access_token) {
            console.error("Token de autenticación no encontrado.");
            return; 
        }

        try {
            const res = await fetch(`${apiUrl}/user/pregunta/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.text(); 
                console.error("Error del servidor:", errorData);
            }
            
            router.push('/home');
            router.refresh();

            reset();
            setFiles([]);
            setFilePreviews([]);
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    useEffect(() => {
        if (selectedMateria !== null) {
            setValue("idMateria", selectedMateria);
        }
    }, [selectedMateria]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
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

                {/* Materias */}
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
                                setSelectedMateria(value); // Actualiza el estado
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
                <div>
                    <label 
                        htmlFor="lblTitulo" className="text-gray-700 font-medium"
                    >
                        Titulo:
                    </label>
                    <Input className="my-2"
                        {...register("titulo", {required: true})}
                    ></Input>

                    <label htmlFor="lblDescripcion" className="text-gray-700 font-medium">Descripcion:</label>
                    <Input className="my-2"
                        {...register("descripcion", {required: true})}
                    ></Input>

                    <label htmlFor="lblImages" className="text-gray-700 font-medium">Imagenes(opcional):</label>
                    <Input 
                        type="file" 
                        id="file" 
                        accept="images/*" 
                        multiple className="my-2"
                        onChange={handleFileChange}
                    ></Input>

                    {/* Vista previa de las imgs */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        {filePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img 
                                    src={preview} 
                                    alt={`Preview ${index}`} 
                                    className="w-22 h-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                >
                                    X
                                </button>
                            </div>

                        ))}
                    </div>
                </div>
                <Button type={"submit"}>Enviar</Button>
            </form>
        </>
    )
}