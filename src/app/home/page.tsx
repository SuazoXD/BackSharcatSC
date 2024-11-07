"use client"

import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import { getQuestionsPupilo, getQuestionsByTutorInteres } from "./home.api";
import { Question } from "./interfaces/question-interface";
import { userPayload } from "./interfaces/userPayload-int";
import QuestionCardDialog from './QuestionCardDialog';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage(){
    
    const [questions, setQuestions] = useState<Question[]>([]);;
    const [userData, setUserData] = useState<userPayload | null>(null)
    const [token, setToken] = useState<string | null>(null);
    const [acceptedQuestions, setAcceptedQuestions] = useState<Question[]>([]);

    const fetchQuestions = async (role: number) => {
        try {
            let data: Question[] = [];
            if (role === 2) {
                data = await getQuestionsPupilo();
            } else if (role === 1) {
                data = await getQuestionsByTutorInteres();
            }
            setQuestions(data);
        } catch (error) {
            console.error("Error al obtener preguntas:", error);
        }
    };
    
    // Obtener preguntas con oferta aceptada de tutor
    useEffect(() => {
        try {
            if(token){
                const fetchAcceptedQuestions = async () => {
                    const res = await fetch(`${apiUrl}/user/pregunta/tutor/oferta-aceptada`,{
                        method: "GET",
                        headers:{
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if(!res.ok){
                        console.error("Error al obtener preguntas aceptadas");
                    }

                    const data: Question[] = await res.json();
                    setAcceptedQuestions(data);
                }

                fetchAcceptedQuestions();
            }
        } catch (error) {
            console.error(`Error al obtener las preguntas aceptadas ${error}`);
        }
    }, [token]);

    // refrescar
    const updateQuestions = async () => {
        if (userData) {
            await fetchQuestions(userData.rol);
        }
    };

    useEffect(() => {
        const storedToken = sessionStorage.getItem('access_token');
        setToken(storedToken);

        const handleStorageChange = () => {
            const newToken = sessionStorage.getItem('access_token');
            setToken(newToken);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode<userPayload>(token);
            setUserData(decoded);
        } else {
            setUserData(null);
        }
    }, [token]);

    useEffect(() => {
        if (userData) {
            fetchQuestions(userData.rol);
        }
    }, [userData]);

    return (
        <>  

            {userData?.rol === 1 && acceptedQuestions.length > 0 && (
                <>
                    <div className="flex justify-center p-4 text-2xl">OFERTAS ACEPTADAS</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
                        {acceptedQuestions.map((question) => (
                            <QuestionCardDialog
                                key={question.idPregunta}
                                question={question}
                                userData={userData}
                                updateQuestions={updateQuestions}
                            />
                        ))}
                    </div>
                </>
            )}
            {userData?.rol === 2 && acceptedQuestions.length > 0 && (
                <>
                    <div className="flex justify-center p-4 text-2xl">PREGUNTAS EN PROCESO</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
                        {acceptedQuestions.map((question) => (
                            <QuestionCardDialog
                                key={question.idPregunta}
                                question={question}
                                userData={userData}
                                updateQuestions={updateQuestions}
                            />
                        ))}
                    </div>
                </>
            )}

            {userData?.rol === 1 && (
                <div className="flex justify-center p-4 text-2xl">PREGUNTAS RECOMENDADAS</div>
            )}
            {userData?.rol === 2 && (
                <div className="flex justify-center p-4 text-2xl">TUS PREGUNTAS</div>
            )}
 
            {/* CARD */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
                {questions.length > 0 ? (
                questions.map((question) => (    
                    <QuestionCardDialog 
                        key={question.idPregunta}
                        question={question}
                        userData={userData}
                        updateQuestions={updateQuestions}    
                    />    
                ))
                ) : (
                    <div key="no-questions" className="text-center p-4">No hay preguntas disponibles</div>
                )}
            </div>
        </>
    )
}