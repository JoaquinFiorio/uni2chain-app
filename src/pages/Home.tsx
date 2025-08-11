import MainLayout from "../components/MainLayout";
import LeftContentHome from "../components/LeftContentHome";
import RightContentHome from "../components/RightContentHome";
import AnimatedCube from "../components/AnimatedCube";
import styles from "../components/MainLayout.module.css";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { bsc } from "@reown/appkit/networks";
import { useTranslation } from "react-i18next";

// 1. Get projectId
const projectId = "e77a902549c923188230c031a0e0378c";

// 2. Create a metadata object - optional
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata: metadata,
  networks: [bsc],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

const Home = () => {

  const { t } = useTranslation();

  return (
    <>
      {/* Banner móvil fuera del MainLayout para que esté arriba de todo */}
      <div className={styles.mobileTopBannerHome}>
        <div className={styles.oMaiorMarketplace}>EVM PoA Blockchain</div>
        <div className={styles.oMaiorMarketplacesubtitle}>{t('forASmartCommunity')}</div>
      </div>
      <MainLayout 
        leftContent={<LeftContentHome />} 
        rightContent={<RightContentHome />}
        centerContent={
          <div className={styles.cubeContainer}>
            <AnimatedCube />
          </div>
        }
      >
      </MainLayout>
    </>
  );
};

export default Home;
