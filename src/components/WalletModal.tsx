import React, { useState } from 'react';
import { FaWallet, FaTimes } from 'react-icons/fa';
import styles from './WalletModal.module.css';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (walletAddress: string) => Promise<boolean>;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dirección de wallet (formato Ethereum)
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setError('Por favor ingresa una dirección de wallet Ethereum válida');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await onSubmit(walletAddress);
      
      if (result) {
        setSuccess(true);
        // Cerrar el modal después de un breve delay para mostrar el mensaje de éxito
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      } else {
        setError('No se pudo guardar la dirección de wallet. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Ocurrió un error al guardar la dirección de wallet.');
      console.error('Error guardando wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className={styles.modalHeader}>
          <FaWallet className={styles.walletIcon} />
          <h2>Añadir Wallet</h2>
        </div>
        
        {success ? (
          <div className={styles.successMessage}>
            ¡Wallet añadida con éxito!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.description}>
              Para poder comprar nodos, necesitas agregar una dirección de wallet Ethereum.
            </p>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label htmlFor="walletAddress">Dirección de Wallet Ethereum</label>
              <input
                type="text"
                id="walletAddress"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                disabled={isLoading}
                className={styles.input}
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WalletModal;