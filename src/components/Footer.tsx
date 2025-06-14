
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary py-8 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {currentYear} CinemaAI Studio. 版权所有。</p>
        <p className="text-sm mt-2">
          影视作品版权遵循CC BY-NC 4.0协议，禁止商业用途需额外授权。
        </p>
        <p className="text-sm mt-2">
          由 Lovable AI 驱动生成 ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;
