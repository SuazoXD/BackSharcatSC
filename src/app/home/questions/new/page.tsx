import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormQuestion from "./formQuestion";

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
                    <FormQuestion></FormQuestion>
                </CardContent>
            </Card>
        </>
    )
}