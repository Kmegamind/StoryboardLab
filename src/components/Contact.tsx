
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">准备好革新您的影视创作了吗？</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          访问我们的官方网站获取更多信息，或查阅详细文档深入了解分镜实验室。
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <a href="https://cinemaai.studio" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              访问官网
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <a href="https://docs.cinemaai.studio" target="_blank" rel="noopener noreferrer">
              <BookOpen className="mr-2 h-5 w-5" />
              阅读文档
            </a>
          </Button>
        </div>
        <p className="mt-10 text-muted-foreground">
          商业合作请联系: <a href="mailto:biz@cinemaai.studio" className="text-primary hover:underline">biz@cinemaai.studio</a>
        </p>
        <p className="text-muted-foreground">
          加入社区讨论: <a href="https://community.cinemaai.studio" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">community.cinemaai.studio</a>
        </p>
      </div>
    </section>
  );
};

export default Contact;
