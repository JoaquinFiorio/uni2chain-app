import '../styles/Swap.css';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

export default function Swap() {

    const [token, setToken] = useState("UNI2");

    const handleChange = (e: any) => {
        setToken(e.target.value);
    };

    const { t } = useTranslation();

    return (
        <>
                <div className='swap-container'>
                    <h1 className="title">{t('swap')}</h1>
                    <div className="swap-wrapper">
                        <div className="section">
                            <div className="label">{t('amount')}</div>
                            <div className="input-row">
                                <input className="input-value" type='number' />
                                <div className="token-info">
                                    <div className="custom-select-wrapper">
                                        <select value={token} onChange={handleChange} className="custom-select">
                                            <option value="UNI2">UNI2</option>
                                            <option value="ETH">ETH</option>
                                            <option value="BNB">BNB</option>
                                            <option value="USDT">USDT</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='balance-row'>
                                <div className="balance-label">{t('balance')}:</div>
                                <span className="token-balance">1.245 {token}</span>
                            </div>
                        </div>

                        <div className="arrow-container">
                            <div className="arrow-circle">↓</div>
                        </div>

                        <div className="section">
                            <div className="label">{t('willReceive')} (aprox.)</div>
                            <div className='balance-row'>
                                <div className="output-value">434.78 {token}</div>
                                <div className="custom-select-wrapper">
                                    <select value={token} onChange={handleChange} className="custom-select">
                                        <option value="UNI2">UNI2</option>
                                        <option value="ETH">ETH</option>
                                        <option value="BNB">BNB</option>
                                        <option value="USDT">USDT</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button className="comprar-button">{t('swap')}</button>
                    </div>
                </div>
                <Navbar/>
                <Footer/>
        </>
    );
}