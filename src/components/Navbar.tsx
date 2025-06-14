import React, { useState, useEffect } from 'react';
import { Film, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components
import { Button } from "@/components/ui/button"; // Import Button for trigger styling

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Updated mainNavLinks to remove the specified items
  const mainNavLinks = [
    // { href: '/#overview', label: '产品概述', isRouterLink: false },
    // { href: '/#features', label: '核心功能', isRouterLink: false },
    // { href: '/#technology', label: '技术亮点', isRouterLink: false },
    // { href: '/#contact', label: '联系我们', isRouterLink: false },
  ];

  const agentNavLinks = [
    { to: '/agents/screenwriter', label: '编剧 Agent' },
    { to: '/agents/director', label: '导演 Agent' },
    { to: '/agents/cinematographer', label: '摄像 Agent' },
    { to: '/agents/art-director', label: '美术指导 Agent' },
  ];

  const debugAgentNavLinks = [
    { to: '/agents/screenwriter', label: '调试编剧 Agent' },
    { to: '/agents/director', label: '调试导演 Agent' },
    { to: '/agents/cinematographer', label: '调试摄像 Agent' },
    { to: '/agents/art-director', label: '调试美术指导 Agent' },
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
    // Only render if href is defined, which it won't be for the removed items if array is empty.
    // If mainNavLinks becomes empty, this component won't be called for those items.
    // For safety, we can add a check here.
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
            <span>CinemaAI Studio</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {/* Render mainNavLinks only if it's not empty */}
            {mainNavLinks.length > 0 && mainNavLinks.map((link) => (
              <NavLinkItem key={link.label} href={link.href} label={link.label} isRouterLink={link.isRouterLink} />
            ))}
            {/* Agent Links Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium px-0">
                  Agents <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border-border shadow-lg"> {/* Ensure dropdown has background */}
                {agentNavLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild className="hover:bg-muted/50 cursor-pointer">
                    <Link to={link.to} className="w-full text-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Agent Debug Links Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium px-0">
                  调试 Agents <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border-border shadow-lg"> {/* Ensure dropdown has background */}
                {debugAgentNavLinks.map((link) => (
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
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md pb-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-4">
            {/* Render mainNavLinks in mobile only if it's not empty */}
            {mainNavLinks.length > 0 && mainNavLinks.map((link) => (
              <NavLinkItem key={link.label} href={link.href} label={link.label} onClick={() => setIsMenuOpen(false)} isRouterLink={link.isRouterLink} />
            ))}
            {/* Agent Links in Mobile Menu */}
            <p className="text-muted-foreground px-2 pt-2 text-sm">Agents:</p>
            {agentNavLinks.map((link) => (
               <NavLinkItem key={link.to} to={link.to} label={link.label} onClick={() => setIsMenuOpen(false)} isRouterLink={true}/>
            ))}
            {/* Agent Debug Links in Mobile Menu */}
            <p className="text-muted-foreground px-2 pt-2 text-sm">调试 Agents:</p>
            {debugAgentNavLinks.map((link) => (
               <NavLinkItem key={link.to} to={link.to} label={link.label} onClick={() => setIsMenuOpen(false)} isRouterLink={true}/>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
