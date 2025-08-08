import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="absolute top-4 right-4 z-50 text-sm space-x-2 font-sans">
      <button
        onClick={() => i18n.changeLanguage('pt')}
        className={i18n.language === 'pt' ? 'font-bold underline' : ''}
      >
        PT
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={i18n.language === 'en' ? 'font-bold underline' : ''}
      >
        ENG
      </button>
    </div>
  );
}
