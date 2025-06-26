
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="bg-background py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">准备好革新您的影视创作了吗？</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          访问我们的官方网站获取更多信息，或查阅详细文档深入了解CinemaAI Studio。
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Button asChild size="lg" className="btn-primary hover-lift px-8 py-4 text-base">
            <a href="https://cinemaai.studio" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              访问官网
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="btn-secondary px-8 py-4 text-base">
            <a href="https://docs.cinemaai.studio" target="_blank" rel="noopener noreferrer">
              <BookOpen className="mr-2 h-5 w-5" />
              阅读文档
            </a>
          </Button>
        </div>
        <div className="mt-10 space-y-2 text-muted-foreground text-sm">
          <p>
            商业合作请联系: <a href="mailto:biz@cinemaai.studio" className="text-primary hover:underline transition-all duration-200">biz@cinemaai.studio</a>
          </p>
          <p>
            加入社区讨论: <a href="https://community.cinemaai.studio" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all duration-200">community.cinemaai.studio</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
