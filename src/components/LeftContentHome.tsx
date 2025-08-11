import { useTranslation } from "react-i18next";
import styles from "../styles/Home.module.css";
// import uni2ChainLogo from "../assets/images/home/uni2chain.png";
// import twitterIcon from "../assets/images/topnavbar/twitter.svg";
// import instagramIcon from "../assets/images/topnavbar/group.svg";
// import linkedinIcon from "../assets/images/topnavbar/linkedin.svg";

const LeftContentHome = () => {

  const { t } = useTranslation();

  return (
    <div className={styles.frameParent}>
      <div className={styles.mobileTopBanner}>
        <div className={styles.oMaiorMarketplace}>EVM PoA Blockchain</div>
        <div className={styles.oMaiorMarketplacesubtitle}>{t('forASmartCommunity')}</div>
      </div>
      {/* <img className={styles.frameChild} alt="" src={uni2ChainLogo} /> */}
      <div className={styles.oMaiorMarketplaceDeNftsDoWrapper}>
        <div className={styles.oMaiorMarketplace}>EVM PoA Blockchain</div>
        <div className={styles.oMaiorMarketplacesubtitle}>{t('forASmartCommunity')}</div>
      </div>
      {/* <div className={styles.twitterParent}>
        <div className={styles.twitter}>
          <img className={styles.vectorIcon} alt="" src={twitterIcon} />
        </div>
        <div className={styles.instagram}>
          <img className={styles.vectorIcon1} alt="" src={instagramIcon}/>
        </div>
        <div className={styles.linkedin}>
          <img className={styles.vectorIcon2} alt="" src={linkedinIcon} />
        </div>
      </div> */}
      {/* <div className={styles.buttonWrapper}>
        <div className={styles.button}>
          <div className={styles.oMaiorMarketplaceDeNftsDoWrapper}>
            <div className={styles.oMaiorMarketplaceDeNftsDoWrapper}>
              <div className={styles.children}>Button</div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default LeftContentHome;