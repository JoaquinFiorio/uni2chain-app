import MainLayout from '../components/MainLayout'
import styles from '../styles/Soluciones.module.css'
import AnimatedCube from "../components/AnimatedCube"
import ConnectedContainer from "../components/ConnectedContainer"
import spinEtherSvg from '../assets/images/conectedContainer/spinether.svg'
import cubelogo from '../assets/images/cube/cubelogo.png';
import { useTranslation } from 'react-i18next'

const Soluciones = () => {
  // Contenido para la columna izquierda específico para la página de Soluciones

  const { t } = useTranslation();

  const leftContent = (
    <div className={styles.sideColumn}>
      <ConnectedContainer>
        <div className={styles.contentItem}>
          <div className={styles.iconWrapper}>
            <div className={styles.spinContainer}>
              <img src={spinEtherSvg} alt="Spinning Background" className={styles.spinBackground} />
              <img src={cubelogo} alt="Ethereum Icon" className={styles.ethereumIcon} />
            </div>
          </div>
          <h3 className={styles.itemTitle}>{t('solutions.left.0.title')}</h3>
          <p className={styles.itemDescription}>
            {t('solutions.left.0.description')}
          </p>
        </div>
        
        <div className={styles.contentItem}>
          <div className={styles.iconWrapper}>
            <div className={styles.spinContainer}>
              <img src={spinEtherSvg} alt="Spinning Background" className={styles.spinBackground} />
              <img src={cubelogo} alt="Ethereum Icon" className={styles.ethereumIcon} />
            </div>
          </div>
          <h3 className={styles.itemTitle}>{t('solutions.left.1.title')}</h3>
          <p className={styles.itemDescription}>
            {t('solutions.left.1.description')}
          </p>
        </div>
      </ConnectedContainer>
    </div>
  )

  // Contenido para la columna derecha específico para la página de Soluciones
  const rightContent = (
    <div className={styles.sideColumn}>
      <ConnectedContainer>
        <div className={styles.contentItem}>
          <div className={styles.iconWrapper}>
            <div className={styles.spinContainer}>
              <img src={spinEtherSvg} alt="Spinning Background" className={styles.spinBackground} />
              <img src={cubelogo} alt="Ethereum Icon" className={styles.ethereumIcon} />
            </div>
          </div>
          <h3 className={styles.itemTitle}>{t('solutions.right.0.title')}</h3>
          <p className={styles.itemDescription}>
           {t('solutions.right.0.description')}
          </p>
        </div>
        
        <div className={styles.contentItem}>
          <div className={styles.iconWrapper}>
            <div className={styles.spinContainer}>
              <img src={spinEtherSvg} alt="Spinning Background" className={styles.spinBackground} />
              <img src={cubelogo} alt="Ethereum Icon" className={styles.ethereumIcon} />
            </div>
          </div>
          <h3 className={styles.itemTitle}>{t('solutions.right.1.title')}</h3>
          <p className={styles.itemDescription}>
            {t('solutions.right.1.description')}
          </p>
        </div>
      </ConnectedContainer>
    </div>
  )

  // Contenido central con el título arriba y el cubo abajo
  const centerContent = (
    <div className={styles.centerContentContainer}>
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>{t('solutions.center.title')}</h1>
        <p className={styles.solutionsDescription}>
          {t('solutions.center.description')}
        </p>
      </div>
      
      <div className={styles.cubeSection}>
        <AnimatedCube />
      </div>
    </div>
  )

  return (
    <MainLayout
      leftContent={leftContent}
      rightContent={rightContent}
      centerContent={centerContent}
    >
    </MainLayout>
  )
}

export default Soluciones