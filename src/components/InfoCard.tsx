import styles from "./InfoCard.module.css";

// Definir interfaz para las props del componente InfoCard
interface InfoCardProps {
  title: string;
  description: string;
  icon: string;
  nodeImage?: string;
  position?: 'top' | 'center' | 'bottom';
}

// Componente reutilizable para las tarjetas de información
const InfoCard = ({ title, description, icon, nodeImage, position = 'center' }: InfoCardProps) => {
  // Determinamos la clase de posición basada en el prop
  const positionClass = position ? `position-${position}` : '';

  return (
    <div className={`${styles.infoCard} ${styles[positionClass]}`}>
      {nodeImage && (
        <div className={styles.nodeConnector}>
          <img 
            src={nodeImage} 
            alt="" 
            className={styles.nodeImage}
          />
        </div>
      )}
      <div className={styles.cardContent}>
        <div className={styles.iconContainer}>
          <img className={styles.icon} alt="" src={icon} />
        </div>
        <b className={styles.title}>{title}</b>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};

export default InfoCard;