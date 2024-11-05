"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileTutor from "./tutorProfile";
import { useEffect, useState } from "react";
import { userPayload } from "../interfaces/userPayload-int";
import { jwtDecode } from "jwt-decode";
import ActualizarInfoPupilo from "./modificarPerfil-pupilo";
import ProfileCard from "./cardProfile";

export default function ProfileTutorPage() {

  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<userPayload | null>(null);
  
  //
  const [isEditing, setIsEditing] = useState(false);

  // Función para cambiar al modo de edición
  const handleEditClick = () => {
      setIsEditing(true);
  };
  
  // Función para regresar al componente de visualización del perfil
  const handleGoBack = () => {
      setIsEditing(false);
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("access_token");
    
    if(storedToken){
      setToken(storedToken);
    }
  }, [])

  useEffect(() => {
    if(token){
      const decode = jwtDecode<userPayload>(token);
      setUserData(decode);
    }else{
      setUserData(null);
    }
  }, [token]);

  return (
    <>
      {userData?.rol == 1 && (
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Perfil del Tutor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Llama al componente ProfileTutor */}
              <ProfileTutor />
            </CardContent>
          </Card>
        </div>
      )}
      {userData?.rol == 2 && (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Perfil del pupilo</CardTitle>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <ActualizarInfoPupilo onGoBack={handleGoBack} />
                ) : (
                    <ProfileCard onEditClick={handleEditClick} />
                )}
            </CardContent>
        </Card>
      )}
    </>
  );
}