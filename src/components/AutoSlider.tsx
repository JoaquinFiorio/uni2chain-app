import './AutoSlider.css'; // Importá los estilos CSS

interface AutoSliderProps {
  images: string[];
  width?: number;
  height?: number;
  reverse?: boolean;
}

const AutoSlider: React.FC<AutoSliderProps> = ({ images = [], width = 200, height = 200, reverse = false }) => {
  const quantity = images.length;

  return (
    <div
      className="slider"
      style={
        {
          '--width': `${width}px`,
          '--height': `${height}px`,
          '--quantity': quantity,
        } as React.CSSProperties as any
      }
      data-reverse={reverse.toString()}
    >
      <div className="list">
        {images.map((src, index) => (
          <div key={index} className="item" style={{ '--position': index + 1 } as React.CSSProperties as any}>
            <img src={src} alt={`slide-${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;