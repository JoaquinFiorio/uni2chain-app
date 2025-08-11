import Navbar from '../components/Navbar'

import Footer from '../components/Footer'
import { useEffect, useState, ReactNode } from 'react'
import styles from '../components/MainLayout.module.css'

interface MainLayoutProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  centerContent?: ReactNode;
  children?: ReactNode;
}

const MainLayout = ({ leftContent, rightContent, centerContent, children }: MainLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // Función para detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar al cargar la página
    checkIfMobile();
    
    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className={styles.mainContainer}>

      {/* Contenedor principal que cambia entre columnas y filas según el tamaño de pantalla */}
      <div className={`${styles.contentContainer} ${isMobile ? styles.mobileContentContainer : styles.desktopContentContainer}`}>
        {!isMobile ? (
          // Vista de escritorio: tres columnas
          <>
            {/* Columna izquierda */}
            <div className={styles.leftColumn}>
              {leftContent}
            </div>

            {/* Columna central */}
            <div className={styles.centerColumn}>
              {centerContent}
              {children}
            </div>

            {/* Columna derecha */}
            <div className={styles.rightColumn}>
              {rightContent}
            </div>
          </>
        ) : (          // Vista móvil: apilado vertical, sin mostrar contenido lateral
          <>
            {/* Contenedor del cubo - Ajustado para que no se corte */}
            <div className={styles.mobileCubeSection}>
              {isMobile && centerContent && (
                <div className={styles.mobileCubeContainer}>
                  {centerContent}
                </div>
              )}
              {children}
            </div>
          </>
        )}
      </div>
      <div className={styles.footerNavWrapper}>
        <Navbar/>
        <Footer/>
      </div>
    </div>
  )
}

export default MainLayout