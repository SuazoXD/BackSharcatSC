"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Validaciones con Zod
const firstStepSchema = z.object({
  primerNombre: z.string().min(1, "El primer nombre es obligatorio"),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(1, "El primer apellido es obligatorio"),
  segundoApellido: z.string().optional(),
  correo: z.string().email("El correo debe ser válido"),
});

const secondStepSchema = z.object({
  contrasenia: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-])/, {
      message: "La contraseña debe tener al menos una letra mayúscula y un símbolo especial",
    }),
  confirmarContrasenia: z.string(),
}).refine((data) => data.contrasenia === data.confirmarContrasenia, {
  path: ["confirmarContrasenia"],
  message: "Las contraseñas no coinciden",
});

const thirdStepSchema = z.object({
  edad: z.number().min(1, "La edad es obligatoria"),
  dni: z.string().optional(),
  telefono: z.string().optional(),
  idRol: z.enum(["1", "2"]),
  codigoVerificacion: z.string().optional(),
});

// Infiriendo tipos con z.infer
type FirstStepData = z.infer<typeof firstStepSchema>;
type SecondStepData = z.infer<typeof secondStepSchema>;
type ThirdStepData = z.infer<typeof thirdStepSchema>;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Register() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [imgPerfil, setImgPerfil] = useState<File | null>(null);
  const [filePreviews, setFilePreviews] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();


  // Hooks de react-hook-form para cada paso
  const firstStepForm = useForm<FirstStepData>({
    resolver: zodResolver(firstStepSchema),
  });
  const secondStepForm = useForm<SecondStepData>({
    resolver: zodResolver(secondStepSchema),
  });
  const thirdStepForm = useForm<ThirdStepData>({
    resolver: zodResolver(thirdStepSchema),
    defaultValues: {
      idRol: "1",
    },
  });

  const handleNextStep = () => {
    if (step === 1) {
      firstStepForm.handleSubmit(() => setStep(2))();
    } else if (step === 2) {
      secondStepForm.handleSubmit(() => setStep(3))();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if(selectedFiles && selectedFiles[0]){
      const selectedImg = selectedFiles[0];
      setImgPerfil(selectedImg);

      const preview = URL.createObjectURL(selectedImg);
      setFilePreviews(preview);
    }
  };

  const removeFile = () => {
    setImgPerfil(null);
    setFilePreviews(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  }

  const handleRegister = async (data: ThirdStepData) => {

    const dataForm = new FormData();

    Object.entries(firstStepForm.getValues()).forEach(([key, value]) => {
      dataForm.append(key, value);
    });

    Object.entries(secondStepForm.getValues()).forEach(([key, value]) => {
      dataForm.append(key, value);
    });

    Object.entries(data).forEach(([key, value]) => {
      dataForm.append(key, String(value));
    });

    if(imgPerfil){
      dataForm.append('file', imgPerfil);
    }

    for (const [key, value] of dataForm.entries()) {
      console.log(`${key}:`, value);
    }
    
    try {
      const response = await fetch(`${apiUrl}/auth/sign-up`, {
        method: "POST",
        body: dataForm,
      });

      if (!response.ok) {
        throw new Error("Error en el registro.");
      }

      setMessage("Registro exitoso. Ahora ingrese el código de verificación.");
      setShowPopup(true);
      setStep(4);
    } catch (error) {
      setMessage("Error en el registro. Inténtalo de nuevo.");
      setShowPopup(true);
      console.log(error);
    }
  };

  const handleValidateCode = async () => {
    const code = thirdStepForm.getValues("codigoVerificacion");
    try {
      const response = await fetch(`${apiUrl}/auth/sign-up/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        router.push("/auth/login")
      } else {
        setMessage("Código incorrecto. Inténtalo de nuevo.");
        setShowPopup(true);
      }
    } catch (error) {
      setMessage("Error al validar el código.");
      setShowPopup(true);
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="sm:w-[60vh]  bg-white p-10 rounded-lg shadow-lg space-y-6">
        {step === 1 && (
          <form onSubmit={firstStepForm.handleSubmit(handleNextStep)} className="space-y-6">
            <h2 className="text-gray-700 font-semibold text-2xl text-center">Datos Básicos</h2>
            <Input
              placeholder="Primer Nombre"
              {...firstStepForm.register("primerNombre")}
            />
            {firstStepForm.formState.errors.primerNombre && (
              <span className="text-red-500 text-sm">{firstStepForm.formState.errors.primerNombre.message}</span>
            )}
            <Input
              placeholder="Segundo Nombre"
              {...firstStepForm.register("segundoNombre")}
            />
            <Input
              placeholder="Primer Apellido"
              {...firstStepForm.register("primerApellido")}
            />
            {firstStepForm.formState.errors.primerApellido && (
              <span className="text-red-500 text-sm">{firstStepForm.formState.errors.primerApellido.message}</span>
            )}
            <Input
              placeholder="Segundo Apellido"
              {...firstStepForm.register("segundoApellido")}
            />
            <Input
              placeholder="Correo Electrónico"
              type="email"
              {...firstStepForm.register("correo")}
            />
            {firstStepForm.formState.errors.correo && (
              <span className="text-red-500 text-sm">{firstStepForm.formState.errors.correo.message}</span>
            )}
            <div className="flex justify-end">
              <span className="text-sm text-gray-600">¿Ya tienes una cuenta?</span>
              <a href="/auth/login" className="text-sm ml-1 text-blue-700">Inicia sesion</a>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Continuar
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={secondStepForm.handleSubmit(handleNextStep)} className="space-y-6">
            <h2 className="text-gray-700 font-semibold text-2xl text-center">Contraseñas</h2>
            <Input
              placeholder="Contraseña"
              type="password"
              {...secondStepForm.register("contrasenia")}
            />
            {secondStepForm.formState.errors.contrasenia && (
              <span className="text-red-500 text-sm">{secondStepForm.formState.errors.contrasenia.message}</span>
            )}
            <Input
              placeholder="Verificar Contraseña"
              type="password"
              {...secondStepForm.register("confirmarContrasenia")}
            />
            {secondStepForm.formState.errors.confirmarContrasenia && (
              <span className="text-red-500 text-sm">{secondStepForm.formState.errors.confirmarContrasenia.message}</span>
            )}
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Continuar
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={thirdStepForm.handleSubmit(handleRegister)} className="space-y-6">
            <h2 className="text-gray-700 font-semibold text-2xl text-center">Información Adicional</h2>
            <Input
              placeholder="Edad"
              type="number"
              {...thirdStepForm.register("edad", { valueAsNumber: true })}
            />
            {thirdStepForm.formState.errors.edad && (
              <span className="text-red-500 text-sm">{thirdStepForm.formState.errors.edad.message}</span>
            )}
            <Input
              placeholder="DNI"
              {...thirdStepForm.register("dni")}
            />
            <Input
              placeholder="Número de Teléfono"
              type="tel"
              {...thirdStepForm.register("telefono")}
            />
            <div>
              <label className="text-sm text-gray-500" htmlFor="">Imagen de perfil</label>
              <Input
                type="file"
                id="file"
                accept="images/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>

            {/* Previsualizar imagen */}
            <div className="flex flex-wrap gap-4 mt-4">
              {filePreviews && (
                <div className="relative">
                  <img 
                      src={filePreviews} 
                      alt={`Preview img`} 
                      className="max-w-[29vh]  object-cover rounded"
                  />
                  <button
                      type="button"
                      onClick={() => removeFile()}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                      X
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="2"
                  {...thirdStepForm.register("idRol")}
                />
                Soy Pupilo
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="1"
                  {...thirdStepForm.register("idRol")}
                />
                Soy Tutor
              </label>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Registrar
            </Button>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={(e) =>{e.preventDefault(); handleValidateCode()}} className="space-y-6">
            <h2 className="text-gray-700 font-semibold text-2xl text-center">Validación de Código</h2>
            <Input
              placeholder="Inserte código de verificación"
              {...thirdStepForm.register("codigoVerificacion")}
            />
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Validar
            </Button>
          </form>
        )}

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <h2 className="text-gray-700 font-semibold">Mensaje</h2>
              <p>{message}</p>
              <Button onClick={() => setShowPopup(false)} className="w-full bg-red-500 hover:bg-red-600">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
