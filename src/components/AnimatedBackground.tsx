import { useEffect, useRef } from 'react';
import '../styles/AnimatedBackground.css';
import bgColor from '../assets/images/bg/bgcolor.png';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Ajustar tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Carga la imagen de fondo como background pattern
    const bgImage = new Image();
    bgImage.src = bgColor;
    
    // Parámetros para el fondo
    const horizonY = canvas.height * 0.5; // AJUSTADO: El horizonte ahora está a la mitad de la pantalla
    let offsetZ = 0;
    const speed = 0.3;
    
    // Crear líneas verticales (lluvia inversa) - MEJORADO DEGRADADO
    const lines: { x: number; y: number; height: number; speed: number; maxOpacity: number }[] = [];
    const createLines = () => {
      // Aumentar la densidad de líneas para cubrir mejor toda la pantalla
      const lineCount = Math.floor(canvas.width / 40); // Más líneas (reducido de 70 a 40)
      
      for (let i = 0; i < lineCount; i++) {
        // Distribuir líneas uniformemente por todo el ancho de la pantalla
        // Calculamos la posición exacta y añadimos una pequeña variación aleatoria
        const x = (canvas.width / lineCount) * i + (Math.random() * 20 - 10);
        const height = 150 + Math.random() * 250; // Líneas más largas
        const maxOpacity = 0.1 + Math.random() * 0.2; // Aumentada la opacidad máxima
        
        lines.push({
          x: x,
          y: Math.random() * canvas.height,
          height: height,
          speed: 0.3 + Math.random() * 0.8, // Un poco más rápido y variable
          maxOpacity: maxOpacity
        });
      }
      
      // Asegurar que haya líneas en los extremos de la pantalla
      // Añadir algunas líneas adicionales en los bordes
      const edgeLineCount = Math.floor(lineCount * 0.2); // 20% más de líneas para los bordes
      
      for (let i = 0; i < edgeLineCount; i++) {
        // Líneas en el borde izquierdo
        lines.push({
          x: Math.random() * (canvas.width * 0.2), // Primer 20% de la pantalla
          y: Math.random() * canvas.height,
          height: 150 + Math.random() * 250,
          speed: 0.3 + Math.random() * 0.8,
          maxOpacity: 0.1 + Math.random() * 0.2
        });
        
        // Líneas en el borde derecho
        lines.push({
          x: canvas.width * 0.8 + Math.random() * (canvas.width * 0.2), // Último 20% de la pantalla
          y: Math.random() * canvas.height,
          height: 150 + Math.random() * 250,
          speed: 0.3 + Math.random() * 0.8,
          maxOpacity: 0.1 + Math.random() * 0.2
        });
      }
    };
    
    createLines();
    
    // Función para dibujar la cuadrícula del suelo con perspectiva
    const drawGrid = () => {
      // Dibujar fondo oscuro para la parte inferior
      ctx.fillStyle = 'rgba(0, 32, 24, 0.8)'; // Verde oscuro semitransparente
      ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);
      
      // Dibujar horizonte - línea fina más clara
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 200, 130, 0.3)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, horizonY);
      ctx.lineTo(canvas.width, horizonY);
      ctx.stroke();
      
      // Configuración para las líneas de la cuadrícula
      ctx.strokeStyle = 'rgba(0, 200, 130, 0.12)';
      ctx.lineWidth = 1;
      
      // Punto de fuga para la perspectiva
      const vanishingPointX = canvas.width / 2;
      const vanishingPointY = horizonY;
      
      // CORREGIDO: Pocas líneas verticales pero distribuidas por todo el ancho
      const numLinesX = 20;
      
      // Espacio entre líneas para abarcar todo el ancho
      const leftEdge = -canvas.width * 2;
      const rightEdge = canvas.width * 4;
      const totalWidth = rightEdge - leftEdge;
      const spacing = totalWidth / numLinesX;
      
      // Dibujar líneas verticales uniformemente espaciadas a través de todo el ancho
      for (let i = 0; i <= numLinesX + 1; i++) {
        const x = leftEdge + spacing * i;
        
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(vanishingPointX + (x - vanishingPointX) * 0.1, vanishingPointY);
        ctx.stroke();
      }
      
      // SIMPLIFICADO: Pocas líneas horizontales para cuadros más grandes
      const numLinesZ = 5;
      const baseStep = (canvas.height - horizonY) / numLinesZ;
      
      // Dibujar líneas horizontales en perspectiva
      for (let i = 0; i <= numLinesZ; i++) {
        const y = horizonY + offsetZ + (baseStep * i);
        
        // Solo dibujar si está por debajo del horizonte y dentro del canvas
        if (y >= horizonY && y <= canvas.height) {
          // Calculamos puntos iniciales y finales que cubran toda la pantalla
          const widthMultiplier = 2.0;
          const xStart = 0 - (canvas.width * widthMultiplier);
          const xEnd = canvas.width + (canvas.width * widthMultiplier);
          
          ctx.beginPath();
          ctx.moveTo(xStart, y);
          ctx.lineTo(xEnd, y);
          ctx.stroke();
        }
      }
      
      // Actualizar el offset para el movimiento (efecto de acercamiento)
      offsetZ = (offsetZ + speed) % baseStep;
    };
    
    // Animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // NUEVO: Aplicar un degradado complejo en lugar de un color plano
      if (bgImage.complete) {
        // Si la imagen está cargada, usarla como fondo
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      } else {
        // Degradado de respaldo similar a la imagen
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#003018');
        gradient.addColorStop(0.4, '#004028');
        gradient.addColorStop(0.8, '#003525');
        gradient.addColorStop(1, '#00251A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Dibujar la cuadrícula del suelo
      drawGrid();
      
      // Dibujar líneas verticales (lluvia inversa) - DEGRADADO INVERTIDO
      for (const line of lines) {
        // Crear un gradiente para cada línea desde la base hasta la parte superior
        // Invertimos las coordenadas para que el punto brillante esté en la parte superior
        const gradient = ctx.createLinearGradient(line.x, line.y - line.height, line.x, line.y);
        
        // Degradado invertido: punto brillante en la parte superior (punta) que se desvanece hacia abajo
        gradient.addColorStop(0, `rgba(255, 255, 255, ${line.maxOpacity * 1.5})`); // Punto más brillante (punta)
        gradient.addColorStop(0.2, `rgba(200, 255, 230, ${line.maxOpacity * 1.2})`); // Transición a verde claro
        gradient.addColorStop(0.5, `rgba(100, 255, 180, ${line.maxOpacity * 0.8})`); // Verde medio
        gradient.addColorStop(1, `rgba(0, 200, 130, ${line.maxOpacity * 0.4})`); // Verde oscuro (base)
        
        // Aplicar el gradiente a la línea
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y - line.height);
        ctx.stroke();
        
        // Mover líneas hacia arriba
        line.y -= line.speed;
        
        // Resetear posición si sale del canvas
        if (line.y + line.height < 0) {
          line.y = canvas.height + line.height;
          line.x = line.x + (Math.random() * 10 - 5);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
    />
  );
};

export default AnimatedBackground;