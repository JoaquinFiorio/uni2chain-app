import { motion, Variants, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/AnimatedCube.css';
import { useNavContext } from '../context/NavContext';

// Importamos las imágenes del cubo
import cube1 from '../assets/images/cube/cube1.png';
import cube2 from '../assets/images/cube/cube2.png';
import cube3 from '../assets/images/cube/cube3.png';
import cubelogo from '../assets/images/cube/cubelogo.png';
import cubelogosoluciones from '../assets/images/cube/cubelogosoluciones.png';

interface AnimatedCubeProps {
  className?: string;
  width?: string;
  width2?: string;
}

const AnimatedCube: React.FC<AnimatedCubeProps> = ({ className, width, width2 }) => {
  // Usamos el contexto para detectar cuando se activa la animación
  const { triggerCubeAnimation, setTriggerCubeAnimation } = useNavContext();
  const location = useLocation();
  
  // Controladores de animación para cada parte del cubo
  const cube1Controls = useAnimation();
  const cube2Controls = useAnimation();
  const cube3Controls = useAnimation();
  const logoControls = useAnimation();
  const glowControls = useAnimation();

  // Definimos las animaciones para cada parte del cubo
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.50 } }
  };

  const cube1Variants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.50,
        delay: 0.25
      }
    }
  };

  const cube2Variants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.50, 
        delay: 0.35
      }
    }
  };

  const cube3Variants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.50, 
        delay: 0.40
      }
    }
  };

  const logoVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.50, 
        delay: 0.50,

      }
    }
  };

  const glowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0.5, 0.8, 0.5, 0.8, 0.5] as any, // Forzar tipo para compatibilidad
      transition: {
        delay: 0.3,
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  // Función para determinar qué logo mostrar según la ruta actual
  const getLogoForCurrentPath = () => {
    // Si estamos en la página de soluciones, mostrar el logo de soluciones
    if (location.pathname === '/soluciones') {
      return cubelogosoluciones;
    }
    // En cualquier otra página, mostrar el logo predeterminado
    return cubelogo;
  };

  // Función para animar el cubo
  const animateCube = async () => {
    // Resetear las animaciones actuales más rápido
    await Promise.all([
      cube1Controls.start({ 
        scale: 0.8, 
        opacity: 0,
        transition: { duration: 0.05 }
      }),
      cube2Controls.start({ 
        scale: 0.8, 
        opacity: 0,
        transition: { duration: 0.05 }
      }),
      cube3Controls.start({ 
        scale: 0.8, 
        opacity: 0,
        transition: { duration: 0.05 }
      }),
      logoControls.start({ 
        scale: 0, 
        opacity: 0,
        transition: { duration: 0.05 }
      })
    ]);

    // Reproducir la secuencia completa sin esperas entre elementos
    cube1Controls.start("visible");
    cube2Controls.start("visible");
    cube3Controls.start("visible");
    logoControls.start("visible");
    glowControls.start("visible");

    // Reiniciar el trigger para futuras animaciones después de un breve tiempo
    setTimeout(() => {
      setTriggerCubeAnimation(false);
    }, 400); // Tiempo suficiente para que complete la animación
  };

  // Efecto para iniciar la animación al cargar el componente
  useEffect(() => {
    // Iniciamos la animación del cubo automáticamente al cargar el componente
    animateCube();
  }, []); // El array de dependencias vacío hace que esto se ejecute solo una vez al montar el componente

  // Efecto para manejar la animación cuando cambia triggerCubeAnimation
  useEffect(() => {
    if (triggerCubeAnimation) {
      animateCube();
    }
  }, [triggerCubeAnimation]);

  return (
    <motion.div 
      className={`animated-cube-container ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Efecto de resplandor */}
      <motion.div 
        className="cube-glow"
        variants={glowVariants}
        initial="hidden"
        animate={glowControls}
      />
      
      {/* Las tres partes del cubo */}
      <motion.div className="cube-parts">
        <motion.img 
          src={cube1} 
          width={ width2 || '' }
          alt="Cube part 1" 
          className="cube-part cube-part-1"
          variants={cube1Variants}
          initial="hidden"
          animate={cube1Controls}
        />
        <motion.img 
          src={cube2} 
          width={ width || '' }
          alt="Cube part 2" 
          className="cube-part cube-part-2"
          variants={cube2Variants}
          initial="hidden"
          animate={cube2Controls}
        />
        <motion.img 
          src={cube3} 
          width={ width || '' }
          alt="Cube part 3" 
          className="cube-part cube-part-3"
          variants={cube3Variants}
          initial="hidden"
          animate={cube3Controls}
        />
        
        {/* Logo central - cambia según la página actual */}
        <motion.img 
          src={getLogoForCurrentPath()} 
          width={ width || '' }
          alt="Cube logo" 
          className="cube-logo"
          variants={logoVariants}
          initial="hidden"
          animate={logoControls}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCube;