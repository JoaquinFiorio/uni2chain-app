import React, { ReactNode } from 'react';
import styles from './ConnectedContainer.module.css';

interface ConnectedContainerProps {
  children: ReactNode;
}

const ConnectedContainer: React.FC<ConnectedContainerProps> = ({ children }) => {
  return (
    <div className={styles.containerWrapper}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={styles.itemWrapper}>
          <div className={styles.glowingContainer}>
            {child}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectedContainer;