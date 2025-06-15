
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center">
      <Languages className="h-5 w-5 text-muted-foreground mr-2" />
      <Select onValueChange={handleLanguageChange} defaultValue={i18n.language.split('-')[0]}>
        <SelectTrigger className="w-[120px] border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 pl-0">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
