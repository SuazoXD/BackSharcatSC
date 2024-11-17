"use client"

import { Input } from "@/components/ui/input";
import { OfferCreate } from "../interfaces/oferta";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import RouteGuard from "@/components/routeGuard";

type newOfferProps = {
    idPregunta?: number;
    updateQuestions: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const FormOferta: React.FC<newOfferProps> = ({idPregunta, updateQuestions}) => {

    const {register, handleSubmit, reset} = useForm<OfferCreate>();

    const alertOfferDuplicade = () => {
        toast.warning("Ya se envió una oferta para esta pregunta.", {
            position: "top-right"
        });
    }

    const alertOfferSuccess = () => {
        toast.success("Oferta enviada con éxito", {
            position: "top-right"
        });
    }

    const onSubmit: SubmitHandler<OfferCreate> = async (data) => {
        const defaultOfferState = 1;

        const offer = {
            idPregunta: idPregunta,
            idEstadoOferta : defaultOfferState,
            descripcion: data.descripcion,
            fechaOferta: new Date()
        }

        const accessToken = sessionStorage.getItem('access_token');

        try {
            const res = await fetch(`${apiUrl}/user/pregunta/send-offer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(offer)
            });

            if (!res.ok) {
        
                if (res.status === 409) {
                    alertOfferDuplicade();
                    reset();
                    return
                } else {
                    alert("Ocurrio un error inesperado, intentalo mas tarde")
                }
        
                return;
            }

            reset();
            alertOfferSuccess();
            updateQuestions();
        } catch (error) {
            console.log(error);
        }

        console.log(offer);
    }

    return(
        <>
            <RouteGuard>
                <form className="flex" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        className="mr-2"
                        placeholder="Descripcion"
                        {...register("descripcion",{required: true})}
                    ></Input>
                    <Button className="bg-blue-500 hover:bg-blue-600">Enviar oferta</Button>
                </form>
            </RouteGuard>
        </>
    )
}

export default FormOferta;