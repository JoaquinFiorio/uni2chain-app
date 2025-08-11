import { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import bubbleLampIcon from '../assets/images/navbar/Bubble Lamp.svg';
//import usergroupPersonIcon from '../assets/images/navbar/Group-person.svg';
//import briefcaseIcon from '../assets/images/navbar/Briefcase.svg';
import processorIcon from '../assets/images/navbar/Processor.svg';
import anchorNodesIcon from '../assets/images/navbar/anchornodes.svg';
import homeIcon from '../assets/images/navbar/home.svg';
//import raspberryPiZeroIcon from '../assets/images/navbar/raspberry.svg';
import { useNavContext } from '../context/NavContext';

// Define los elementos de navegación (7 elementos en total: 3 izquierda, 1 centro, 3 derecha)
const navItems = [
  { id: 0, icon: bubbleLampIcon, label: 'SOLUCIONES', path: '/soluciones' },
  { id: 1, icon: homeIcon, label: 'COMUNIDAD', path: '/community' },
  // { id: 1, icon: usergroupPersonIcon, label: 'USUARIOS', path: '/users' },
  // { id: 2, icon: briefcaseIcon, label: 'MALETÍN', path: '/briefcase' },
  { id: 2, icon: processorIcon, label: 'NODOS', path: '/nodes' },     // Elemento central por defecto
  { id: 3, icon: anchorNodesIcon, label: 'ECOSISTEMA', path: '/anchor' },
  { id: 4, icon: homeIcon, label: 'INICIO', path: '/' },
  { id: 5, icon: processorIcon, label: 'TOKENOMICS', path: '/tokenomics' }, 
  { id: 6, icon: processorIcon, label: 'SWAP', path: '/swap' },
  // { id: 6, icon: raspberryPiZeroIcon, label: 'RASPI', path: '/raspi' },
];

const Navbar: FunctionComponent = () => {
  // Use context instead of local state
  const { activeIndex, setActiveIndex, setTriggerCubeAnimation } = useNavContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para almacenar los elementos ordenados
  const [orderedItems, setOrderedItems] = useState(navItems);
  
  // Efecto para sincronizar el menú con la ruta actual cuando se carga la página
  useEffect(() => {
    const currentPath = location.pathname;
    const menuItemIndex = navItems.findIndex(item => item.path === currentPath);
    
    // Si encontramos un ítem de menú que coincide con la ruta actual, activarlo
    if (menuItemIndex !== -1 && menuItemIndex !== activeIndex) {
      setActiveIndex(menuItemIndex);
      
      // También activar el lightCone si corresponde
      const lightConeElement = document.querySelector(`.${styles.lightCone}`);
      if (lightConeElement) {
        if (menuItemIndex === 5 || menuItemIndex === 0) {
          lightConeElement.classList.add(styles.active);
        } else {
          lightConeElement.classList.remove(styles.active);
        }
      }
    }
  }, [location.pathname, setActiveIndex, activeIndex]);
  
  // Función para reorganizar los elementos basados en el índice activo
  const reorderItems = useCallback((currentActiveIndex: number) => {
    const centerPosition = 3; // Posición central (índice 3 de 7 elementos)
    const shift = currentActiveIndex - centerPosition;

    // Crear un nuevo arreglo reordenado
    const newOrderedItems = [...navItems];

    // Rotar el array para colocar el elemento activo en el centro
    if (shift > 0) {
      const itemsToMove = newOrderedItems.splice(0, shift);
      newOrderedItems.push(...itemsToMove);
    } else if (shift < 0) {
      const itemsToMove = newOrderedItems.splice(shift);
      newOrderedItems.unshift(...itemsToMove);
    }

    return newOrderedItems;
  }, []);
  
  // Recalcular el orden de los elementos cuando cambia el activeIndex
  useEffect(() => {
    const newOrderedItems = reorderItems(activeIndex);
    setOrderedItems(newOrderedItems);
  }, [activeIndex, reorderItems]);

  // Forzar un re-renderizado visual al actualizar el estado
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOrderedItems(reorderItems(activeIndex));
    }, 0);

    return () => clearTimeout(timeout);
  }, [activeIndex, reorderItems]);
  
  // Manejador de clic para activar animación del cubo
  const handleItemClick = (index: number) => {
    if (index !== activeIndex) {
      // Update the active index in context
      setActiveIndex(index);
      
      // Trigger the cube animation from context
      setTriggerCubeAnimation(true);
      
      setOrderedItems(reorderItems(index));

      // Forzar re-renderizado visual agregando y eliminando una clase
      const navbarElement = document.querySelector(`.${styles.navbar}`);
      if (navbarElement) {
        navbarElement.classList.remove(styles.animate);
        void (navbarElement as HTMLElement).offsetWidth; // Forzar reflujo
        navbarElement.classList.add(styles.animate);
      }
      
      // Animar el cono de luz solo para INICIO (5) y LAMP (0)
      const lightConeElement = document.querySelector(`.${styles.lightCone}`);
      if (lightConeElement) {
        if (index === 5 || index === 0) {
          lightConeElement.classList.remove(styles.active);
          void (lightConeElement as HTMLElement).offsetWidth; // Forzar reflujo
          lightConeElement.classList.add(styles.active);
        } else {
          lightConeElement.classList.remove(styles.active);
        }
      }
      
      // Navegar a la ruta correspondiente cuando se hace clic en un elemento
      const clickedItem = navItems[index];
      if (clickedItem && clickedItem.path) {
        navigate(clickedItem.path);
      }
    }
  };

  // Función para determinar la clase de estilo según la posición visual
  const getMenuClass = (visualPosition: number) => {
    // El centro siempre es la posición 3
    const centerPosition = 3;
    const distance = Math.abs(visualPosition - centerPosition);
    
    if (visualPosition === centerPosition) return styles.menu3; // Elemento destacado (más grande) en el centro
    if (distance === 1) return styles.menu2; // Elementos adyacentes (medianos)
    if (distance === 2) return styles.menu1; // Elementos más alejados (pequeños)
    return styles.menu; // Elementos muy alejados (muy pequeños)
  };

  // Verificar si debemos mostrar el lightCone basado en el índice activo actual
  const shouldShowLightCone = activeIndex === 5 || activeIndex === 0;

  // Agregar un efecto de luz que sale del menú y alumbra el cubo
  return (
    <div className={styles.navbar}>
      <div className={styles.menuParent}>
        {orderedItems.map((item, visualPosition) => {
          // Encontrar el índice original del elemento en navItems
          const originalIndex = navItems.findIndex(navItem => navItem.id === item.id);
          // Determinar si este elemento está en la posición central (posición 3)
          const isCenter = visualPosition === 3;
          
          return (
            <motion.div 
              key={item.id}
              className={`${getMenuClass(visualPosition)} ${styles.menuItem}`}
              onClick={() => handleItemClick(originalIndex)}
              animate={{
                scale: isCenter ? 1.2 : 1,
                opacity: isCenter ? 1 : 0.8,
                zIndex: isCenter ? 10 : 5,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <img 
                className={isCenter ? styles.centerIcon : styles.normalIcon} 
                alt="" 
                src={item.icon} 
                onDragStart={(e) => e.preventDefault()}
              />
              {isCenter && item.label && (
                <b className={styles.soluciones}>{item.label}</b>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className={`${styles.lightCone} ${shouldShowLightCone ? styles.active : ''}`}></div>
      
    </div>
  );
};

export default Navbar;
