import styles from "../styles/Home.module.css";
import InfoCard from "./InfoCard";
import bladeIcon from "../assets/images/home/blade.png";

// Importar los nodos SVG
import node1 from "../assets/images/rcontent/node 1.svg";
import node2 from "../assets/images/rcontent/node2.svg";
import node3 from "../assets/images/rcontent/node 3.svg";
import { useTranslation } from "react-i18next";

const RightContentHome = () => {
  // Datos de ejemplo para las tarjetas en español

  const { t } = useTranslation();

  const cardData = [
    {
      title: "cards.1.title",
      description: "cards.1.description",
      icon: bladeIcon,
      nodeImage: node1,
      position: 'top'
    },
    {
      title: "cards.2.title",
      description: "cards.2.description",
      icon: bladeIcon,
      nodeImage: node2,
      position: 'center'
    },
    {
      title: "cards.3.title",
      description: "cards.3.description",
      icon: bladeIcon,
      nodeImage: node3,
      position: 'bottom'
    }
  ];

  return (
    <div className={styles.contentContainer}>
      <div className={styles.cardsContainer}>
        {cardData.map((card, index) => (
          <div key={index} className={styles.cardWrapper} style={{ position: 'relative', zIndex: 100, ...(card.position === 'center' ? { marginLeft: '300px' } : 
                {}) }}>
            <div style={{ 
              position: 'absolute', 
              left: '-150px', 
              width: '150px', 
              height: '60px', 
              zIndex: 200,
              pointerEvents: 'none',
              isolation: 'isolate',
              ...(card.position === 'top' ? { top: '10px' } : 
                card.position === 'center' ? { top: '50%', transform: 'translateY(-50%)' } : 
                { bottom: '10px' })
            }}>
              <img 
                src={card.nodeImage} 
                alt="" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 0px 3px rgba(0, 255, 136, 0.6))'
                }} 
              />
            </div>
            
            <InfoCard 
              title={t(card.title)} 
              description={t(card.description)} 
              icon={card.icon} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightContentHome;