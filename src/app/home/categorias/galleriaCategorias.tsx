"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import styles from "../../../styles/galleryCategories.module.css";
import { Button, buttonVariants } from "@/components/ui/button";
import { userPayload } from "../interfaces/userPayload-int";
import { jwtDecode } from "jwt-decode";

interface Category {
  idCategoria: number;
  categoria: string;
  imgCategoria: string;
}

interface Subcategory {
  idMateria: number;
  materia: string;
  imgMateria: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function GalleryCategories() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [userData, setUserData] = useState<userPayload | null>(null);
  const router = useRouter(); 

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');

    if(token){
      const decoded = jwtDecode<userPayload>(token);
      setUserData(decoded);
    }
  }, []);

  // useEffect para obtener las categorías desde la base de datos
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories`);
        if (!response.ok) {
          throw new Error("Error al obtener las categorías.");
        }
        const data = await response.json();
        setCategories(data);
        console.log("Categorías obtenidas:", data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  // Función para manejar el clic en una categoría
  const handleCategoryClick = async (category: Category) => {
    setCurrentCategory(category);
    setModalOpen(true);

    try {
      const response = await fetch(
        `${apiUrl}/categories/materia/${category.idCategoria}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener las subcategorías.");
      }
      const data = await response.json();
      setSubcategories(data);
      console.log("Subcategorías obtenidas:", data);
    } catch (error) {
      console.error("Error al obtener las subcategorías:", error);
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategory(null);
    setSubcategories([]);
  };

  // Función para manejar la redirección al formulario de preguntas
  const handleAskQuestionClick = (idMateria: number) => {
    if (currentCategory) {
      console.log(`Redirigiendo con idCategoria: ${currentCategory.idCategoria} e idMateria: ${idMateria}`);
      router.push(`/home/questions/new?idCategoria=${currentCategory.idCategoria}&idMateria=${idMateria}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sección de Categorías */}
      <section className="flex flex-col items-center w-auto">
        <h3 className={styles.categoriesTitle}>Categorías Disponibles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center mt-5">
          {categories.map((category) => (
            <div
              key={category.idCategoria}
              className={styles.categoryCard}
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={category.imgCategoria}
                alt={category.categoria}
                width={200}
                height={100}
              />
              <p>{category.categoria}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className="bg-white p-4 rounded shadow min-w-96 max-w-[70vh] sm:min-w-[80vh] lg:min-w-[70vh] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Subcategorías de {currentCategory?.categoria}</h2>
            <ul className={styles.subcategoryList}>
              {subcategories.length > 0 ? (
                subcategories.map((subcategory) => (
                  <li key={subcategory.idMateria} className={styles.subcategoryItem}>
                    <img
                      src={subcategory.imgMateria}
                      alt={subcategory.materia}
                      className="w-[10vh] "
                    />
                    <p className="text-sm">{subcategory.materia}</p>
                    {userData?.rol == 2 && (
                      <button
                        className={`${buttonVariants({size: "sm"})}`}
                        onClick={() => handleAskQuestionClick(subcategory.idMateria)}
                      >
                        Preguntar
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p>No hay subcategorías disponibles.</p>
              )}
            </ul>
            <Button className="bg-blue-500 hover:bg-blue-600 mt-6" onClick={closeModal}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
