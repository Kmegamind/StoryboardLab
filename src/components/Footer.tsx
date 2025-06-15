
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary py-8 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {currentYear} CinemaAI Studio. {t('footer.copyright')}</p>
        <p className="text-sm mt-2">
          {t('footer.license')}
        </p>
        <p className="text-sm mt-2">
          {t('footer.poweredBy')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
