
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Film, Menu, X, User, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const mainNavLinks = [
    { href: '#features', label: '功能特点' },
    { href: '#technology', label: '技术亮点' },
    { href: '#contact', label: '联系我们' },
  ];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary-foreground transition-colors">
            <Film className="h-8 w-8" />
            <span>分镜实验室</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {location.pathname === '/' && mainNavLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            {user ? (
              <div className="flex items-center space-x-4">
                <Button asChild variant="outline">
                  <Link to="/dashboard">工作台</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button asChild variant="outline">
                  <Link to="/dashboard">开始创作</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">登录</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {location.pathname === '/' && mainNavLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                >
                  {link.label}
                </button>
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    工作台
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    开始创作
                  </Link>
                  <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                    登录
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
