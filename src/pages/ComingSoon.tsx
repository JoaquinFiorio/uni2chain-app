import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/ComingSoon.module.css';
import MainLayout from '../layouts/MainLayout';
import { useTranslation } from 'react-i18next';

const ComingSoon: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  // Función para obtener el nombre de la sección basado en la ruta
  const getSectionName = () => {
    const path = location.pathname.replace('/', '');

    // Mapeo de rutas a nombres legibles
    const pathNames: Record<string, string> = {
      'users': 'USUARIOS',
      'briefcase': 'MALETÍN',
      'anchor': 'Ecosistema',
      'raspi': 'RASPBERRY PI'
    };

    return pathNames[path] || 'ESTA SECCIÓN';
  };

  // Efecto para cambiar el título de la página según la sección
  useEffect(() => {
    const sectionName = getSectionName();
    document.title = `UNI2CHAIN - ${sectionName} (Próximamente)`;

    return () => {
      document.title = 'UNI2CHAIN';
    };
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className={styles.comingSoonContainer}>
        <h1 className={styles.title}>{t('comingSoon.title')}</h1>
        <div className={styles.content}>
          <p className={styles.message}>{t('comingSoon.message')}</p>
        </div>
      </div>
    </MainLayout >
  );
};

export default ComingSoon;