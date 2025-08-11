import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'

import { TranslationConfig } from "./utils/TranslationConfig.ts";
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
i18n.use(initReactI18next).init(TranslationConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
