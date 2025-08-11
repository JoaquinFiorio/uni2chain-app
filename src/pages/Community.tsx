import '../styles/Community.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import slider1 from '../assets/images/slider/slider-1.jpeg';
import slider2 from '../assets/images/slider/slider-2.jpeg';
import slider3 from '../assets/images/slider/slider-3.jpeg';
import slider4 from '../assets/images/slider/slider-4.jpeg';
import slider5 from '../assets/images/slider/slider-5.jpeg';
import slider6 from '../assets/images/slider/slider-6.jpeg';
import slider7 from '../assets/images/slider/slider-7.jpeg';
import AnimatedCube from '../components/AnimatedCube';
import AutoSlider from '../components/AutoSlider';
import { ArrowRight, TelegramIcon, TwitterIcon, FacebookIcon, DiscordIcon, YoutubeIcon, WhatsappIcon } from '../assets/icons';
import { useTranslation } from 'react-i18next';

export default function Community() {
    const { t } = useTranslation();

    return (
        <>
            <h1 className="title">{t('community.title')}</h1>
            <div className='container'>
                <div className="community-container">
                    <div className="community-description">
                        <h2>{t('community.globalCommunitiesTitle')}</h2>
                        <p>{t('community.globalCommunitiesDescription')}</p>
                    </div>
                    <div className="community-grid">
                        <div className="community-card">
                            <TelegramIcon />
                            Telegram<span>{t('community.general')}</span>
                        </div>
                        <div className="community-card">
                            <FacebookIcon />
                            Facebook<span>{t('community.general')}</span>
                        </div>
                        <div className="community-card">
                            <YoutubeIcon />
                            Youtube<span>{t('community.general')}</span>
                        </div>
                        <div className="community-card">
                            <TwitterIcon />
                            X (Twitter)<span>{t('community.general')}</span>
                        </div>
                        <div className="community-card">
                            <DiscordIcon />
                            Discord<span>{t('community.general')}</span>
                        </div>
                    </div>
                </div>

                <section className='builder-container'>
                    <div className='section-header'>
                        {[1, 2].map((i) => (
                            <div className="builder-section" key={i}>
                                <div className="builder-content">
                                    <AnimatedCube width='95%' width2='110%' />
                                    <div className="builder-text">
                                        <h2>{t('community.greenBuildersTitle')}</h2>
                                        <p>{t('community.greenBuildersDescription')}</p>
                                        <button className="join-button">{t('community.joinNow')}</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="builder-section" style={{ width: '100%' }}>
                        <div className="builder-content">
                            <AnimatedCube width='95%' width2='110%' />
                            <div className="builder-text">
                                <h2>{t('community.greenBuildersTitle')}</h2>
                                <p>{t('community.greenBuildersDescription')}</p>
                                <button className="join-button">{t('community.joinNow')}</button>
                            </div>
                        </div>
                    </div>
                </section>

                <AutoSlider images={[slider1, slider2, slider3, slider4]} reverse={true} />
                <AutoSlider images={[slider5, slider6, slider7, slider6]} reverse={false} />

                <div className="latest-updates">
                    <h1 className="title">{t('community.latestUpdates')}</h1>
                    {[slider1, slider4].map((img, idx) => (
                        <div className="latest-content" key={idx}>
                            <img src={img} alt="Newest dApps" className="latest-image" />
                            <div className="latest-text">
                                <div className="latest-header">
                                    <h3 className="latest-headline">{t('community.latestHeadline')}</h3>
                                    <p className="latest-date">{t('community.latestDate')}</p>
                                </div>
                                <ArrowRight />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="community-container">
                    <div className="community-description">
                        <h2>{t('community.announcementCommunitiesTitle')}</h2>
                        <p>{t('community.announcementCommunitiesDescription')}</p>
                    </div>
                    <div className="community-grid">
                        <div className="community-card">
                            <WhatsappIcon />
                            {t('community.announcements')}<span>{t('community.spanish')}</span>
                        </div>
                        <div className="community-card">
                            <WhatsappIcon />
                            {t('community.announcements')}<span>{t('community.english')}</span>
                        </div>
                        <div className="community-card">
                            <WhatsappIcon />
                            {t('community.announcements')}<span>{t('community.general')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <Navbar />
            <Footer />
        </>
    );
}
