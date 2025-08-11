import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TopNavbar.module.css';
import logo from '../assets/images/topnavbar/frame-9.png';
import twitter from '../assets/images/topnavbar/twitter-2.svg';
import instagram from '../assets/images/topnavbar/group.svg';
import { useUserContext } from '../context/UserContext';
import { FaWallet, FaBars, FaTimes } from 'react-icons/fa';
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { TranslationLanguagesSelection } from '../utils/TranslationLanguages';
import { useTranslation } from "react-i18next";
import { DiscordIcon } from '../assets/icons';
import { WhitepaperIcon } from '../assets/icons/Whitepaper';

const TopNavbar: FunctionComponent = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, addWalletAddress } = useUserContext();
  const { i18n } = useTranslation();

  // AppKit hooks para gestión de wallet
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  // Estado para controlar el menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Obtener la primera letra del nombre de usuario para el avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Función para cerrar el menú móvil al hacer clic en una opción
  const handleMenuItemClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleChangeLanguage = (id: any) => {
    localStorage.setItem("language", id)
    i18n.changeLanguage(id);
  };

  return (
    <>
      <div className={styles.frameParent}>
        <img
          className={styles.frameChild}
          alt=""
          src={logo}
          onClick={() => {
            navigate('/');
            handleMenuItemClick();
          }}
        />

        {/* Botón del menú móvil */}
        <div className={styles.mobileMenuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`${styles.rightSection} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.twitterParent}>
            <a href={localStorage.getItem('language') === 'es' ? 'https://whitepaper.uni2chain.org/' : 'https://whitepaper-en.uni2chain.org/'} target='_blank' className={styles.twitter} onClick={handleMenuItemClick}>
              <WhitepaperIcon />
            </a>
            <a href='https://discord.com/channels/1394370746523844752/1394375301177282741' target='_blank' className={styles.twitter} onClick={handleMenuItemClick}>
              <DiscordIcon color='white' />
            </a>
            <a href='https://x.com/uni2chain' target='_blank' className={styles.twitter} onClick={handleMenuItemClick}>
              <img className={styles.vectorIcon} alt="" src={twitter} />
            </a>
            <a href='https://www.instagram.com/uni2chainofficial' target='_blank' className={styles.instagram} onClick={handleMenuItemClick}>
              <img className={styles.vectorIcon1} alt="" src={instagram} />
            </a>
          </div>
          <div className={styles.userSection}>
            {isLoggedIn ? (
              <>
                <div className={styles.walletButtons}>
                  <button
                    onClick={() => {
                      isConnected ? disconnect() : open();
                      handleMenuItemClick();
                    }}
                    className={isConnected ? styles.disconnectWalletButton : styles.connectWalletButton}
                  >
                    <FaWallet className={styles.walletIcon} />
                    {isConnected ?
                      `${address?.slice(0, 6)}...${address?.slice(-4)} Desconectar` :
                      'Conectar Wallet'}
                  </button>

                  {isConnected && address && user?.walletAddress !== address && (
                    <button
                      onClick={() => {
                        addWalletAddress(address);
                        handleMenuItemClick();
                      }}
                      className={styles.saveWalletButton}
                    >
                      Guardar Wallet
                    </button>
                  )}
                </div>

                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} />
                    ) : (
                      getInitial(user?.username || '')
                    )}
                  </div>
                  <span className={styles.username}>{user?.username}</span>
                  <button
                    onClick={() => {
                      logout();
                      handleMenuItemClick();
                    }}
                    className={styles.logoutButton}
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <select
                  className={styles.loginButton}
                  id="language-select"
                  onChange={(e) => handleChangeLanguage(e.target.value)}
                >
                  {TranslationLanguagesSelection.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </>

            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
