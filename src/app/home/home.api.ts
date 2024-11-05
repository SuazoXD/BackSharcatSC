const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const access_token = typeof window !== "undefined" ? sessionStorage.getItem('access_token') : null;

// Obtener preguntas pupilo
export async function getQuestionsPupilo(){    
    const data = await fetch(`${apiUrl}/user/preguntas`,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`,
            "Content-Type": "application/json"
        }
    });

    return await data.json();
}

export async function getQuestionsByTutorInteres() {
    const data = await fetch(`${apiUrl}/user/pregunta/interes-tutor`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`,
            "Content-Type": "application/json"
        }
    });

    return await data.json();
}

// Obtener categorias
export async function getCategories(){
    const data = await fetch(`${apiUrl}/categories`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await data.json();
}