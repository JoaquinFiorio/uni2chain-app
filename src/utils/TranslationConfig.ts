import { TranslationLanguages } from "./TranslationLanguages";

export const TranslationConfig = {
    resources: TranslationLanguages,
    lng: 'en', // DEFAULT
    fallbackLng: 'en', // USE IF NO TRANSLATION EXIST
    interpolation: {
        escapeValue: false,
    }
};