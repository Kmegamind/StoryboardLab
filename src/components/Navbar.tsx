
import React, { useState, useEffect } from 'react';
import { Film, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const mainNavLinks = [
    // 主导航链接已移除，如需要可重新添加
  ];

  const agentNavLinks = [
    { to: '/agents/screenwriter', label: '编剧智能体' },
    { to: '/agents/director', label: '导演智能体' },
    { to: '/agents/cinematographer', label: '摄影师智能体' },
    { to: '/agents/art-director', label: '美术指导智能体' },
  ];

  const testAgentNavLinks = [
    { to: '/agents/test-config', label: '智能体配置管理' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinkItem = ({ href, to, label, onClick, isRouterLink }: { href?: string, to?: string, label: string, onClick?: () => void, isRouterLink: boolean }) => {
    if (isRouterLink && to) {
      return (
        <Link
          to={to}
          onClick={onClick}
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          {label}
        </Link>
      );
    }
    if (!href) return null;
    return (
      <a
        href={href}
        onClick={onClick}
        className="text-foreground hover:text-primary transition-colors font-medium"
      >
        {label}
      </a>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary-foreground transition-colors">
            <Film className="h-8 w-8" />
            <span>分镜实验室</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {mainNavLinks.length > 0 && mainNavLinks.map((link) => (
              <NavLinkItem key={link.label} href={link.href} label={link.label} isRouterLink={link.isRouterLink} />
            ))}
            {/* 智能体链接下拉 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium px-0">
                  智能体 <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border-border shadow-lg">
                {agentNavLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild className="hover:bg-muted/50 cursor-pointer">
                    <Link to={link.to} className="w-full text-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* 测试智能体配置下拉 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium px-0">
                  测试智能体 <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border-border shadow-lg">
                {testAgentNavLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild className="hover:bg-muted/50 cursor-pointer">
                    <Link to={link.to} className="w-full text-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md pb-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-4">
            {mainNavLinks.length > 0 && mainNavLinks.map((link) => (
              <NavLinkItem key={link.label} href={link.href} label={link.label} onClick={() => setIsMenuOpen(false)} isRouterLink={link.isRouterLink} />
            ))}
            {/* 移动端智能体链接 */}
            <p className="text-muted-foreground px-2 pt-2 text-sm">智能体:</p>
            {agentNavLinks.map((link) => (
               <NavLinkItem key={link.to} to={link.to} label={link.label} onClick={() => setIsMenuOpen(false)} isRouterLink={true}/>
            ))}
            {/* 移动端测试智能体配置 */}
            <p className="text-muted-foreground px-2 pt-2 text-sm">测试智能体:</p>
            {testAgentNavLinks.map((link) => (
               <NavLinkItem key={link.to} to={link.to} label={link.label} onClick={() => setIsMenuOpen(false)} isRouterLink={true}/>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
