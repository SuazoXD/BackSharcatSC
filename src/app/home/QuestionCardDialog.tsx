import { useState } from "react";
import { Question } from "./interfaces/question-interface";
import { userPayload } from "./interfaces/userPayload-int";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import Carousel from "@/components/ui/carousel";
import QuestionOffers from "./offers/questionOffers";

interface QuestionCardDialogProps {
    question: Question;
    userData: userPayload | null;
    updateQuestions: () => Promise<void>;
}

const QuestionCardDialog:React.FC<QuestionCardDialogProps> = ({ question, userData, updateQuestions }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    
    const handleCardClick = () => {
        setIsOpen(true);
    };

    return (
        <>
            <Card onClick={handleCardClick} className="m-2 overflow-hidden shadow cursor-pointer">
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        {question.titulo}
                        <span className="text-xs">{question.materia.materia}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="line-clamp-3 overflow-hidden">
                        {question.descripcion}
                    </p>
                    <p className="pt-3">{new Date(question.fechaPublicacion).toLocaleString()}</p>
                </CardContent>
            </Card>

            {/* Question details */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <DialogContent
                        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 max-w-[80vh] rounded-xl sm:max-w-2xl w-full
                            outline-none max-h-[90vh] sm:max-h-[85vh] overflow-y-scroll
                        }`}
                    >
                        <DialogHeader>
                            <DialogTitle className="font-bold text-center">{question.titulo}</DialogTitle>
                            <div className="w-full border"></div>
                            <DialogDescription className="text-justify">{question.descripcion}</DialogDescription>
                        </DialogHeader>
                        <div className="w-full border my-2"></div>
                        
                        {/* Carrusel de imágenes */}
                        {question.imgpregunta && question.imgpregunta.length > 0 && (
                            <Carousel images={question.imgpregunta.map(img => img.img)} />
                        )}
                        <p className="text-sm mt-6">
                            Materia: {question.materia.materia}
                        </p>
                        <p className="text-sm">
                            Fecha de publicación: {new Date(question.fechaPublicacion).toLocaleString()}
                        </p>
                        <div className="w-full border my-2"></div>
                        
                        <QuestionOffers userData={userData} selectedQuestion={question} updateQuestions={updateQuestions} />
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    )
}

export default QuestionCardDialog;