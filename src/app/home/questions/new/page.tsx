import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormQuestion from "./formQuestion";
import { Suspense } from "react";

export default function QuestionsNewPage(){
    return(
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="">
                        Ingresa tu pregunta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <FormQuestion ></FormQuestion>
                    </Suspense>
                </CardContent>
            </Card>
        </>
    )
}