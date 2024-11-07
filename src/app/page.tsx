"use client";

import { useState, useEffect } from "react";
import styles from "../styles/home.module.css";
import NavBar from "../components/navBar"
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

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Definimos apiUrl

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    // Obtener las subcategorías asociadas a la categoría seleccionada
    try {
      const response = await fetch(`${apiUrl}/categories/materia/${category.idCategoria}`);
      if (!response.ok) {
        throw new Error("Error al obtener las subcategorías.");
      }
      const data = await response.json();
      setSubcategories(data);
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

  // Cambiar la imagen del carrusel automáticamente cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % categories.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [categories]);

  return (
    <>
      <NavBar></NavBar>
      <div className="mt-[8vh]">
        {/* Modal */}
        {modalOpen && currentCategory && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Subcategorías de {currentCategory.categoria}</h2>
              <ul className={styles.subcategoryList}>
                {subcategories.length > 0 ? (
                  subcategories.map((subcategory) => (
                    <li
                      key={subcategory.idMateria}
                      className={styles.subcategoryItem}
                    >
                      <img
                        src={subcategory.imgMateria}
                        alt={subcategory.materia}
                        width={100}
                        height={100}
                      />
                      <p>{subcategory.materia}</p>
                    </li>
                  ))
                ) : (
                  <p>No hay subcategorías disponibles.</p>
                )}
              </ul>
              <button className={styles.closeModalButton} onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <main className={styles.main}>
          <h1 className={styles.subtitle}>Bienvenido a SharkCat</h1>

          {/* Galería vertical (Carrusel) */}
          <section className={styles.carouselSection}>
            <div className={styles.carouselTitle}>
              <h2>Acerca de SharkCat</h2>
              <p>
                SharkCat es una plataforma diseñada para ofrecer apoyo académico
                en diferentes disciplinas, brindando una experiencia de
                aprendizaje personalizada y efectiva. Explora cursos, clases y
                recursos que te ayudarán a mejorar tu conocimiento y habilidades.
              </p>
            </div>

            {categories.length > 0 && (
              <div className={styles.imageContainer}>
                <img
                  src={categories[currentImageIndex].imgCategoria}
                  alt={categories[currentImageIndex].categoria}
                  width={200}
                  height={200}
                />
              </div>
            )}
          </section>

          {/* Categorías */}
          <section className={styles.categoriesSection}>
            <h3 className={styles.categoriesTitle}>Categorías Disponibles</h3>
            <div className={styles.categoryGrid}>
              {categories.map((category) => (
                <div
                  key={category.idCategoria}
                  className={styles.categoryCard}
                  onClick={() => handleCategoryClick(category)}
                >
                  <img
                    src={category.imgCategoria}
                    alt={category.categoria}
                    width={300}
                    height={100}
                  />
                  <p>{category.categoria}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
