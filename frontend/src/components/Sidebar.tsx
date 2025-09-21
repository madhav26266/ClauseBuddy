import { useState } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  MessageCircle,
  History, 
  Upload, 
  Menu,
  X,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  onLoginClick: () => void; 
  onSignupClick?: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isCollapsed, onCollapseChange, onLoginClick}: SidebarProps) {
  const { user } = useAuth();

  const navigationItems = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'uploads', label: 'Uploads', icon: Upload },
  ];

  const BowtieLogo = () => (
    <div className="relative">
      <svg width="32" height="32" viewBox="0 0 32 32" className="text-purple-400">
        <path
          d="M8 12 L16 16 L24 12 L24 20 L16 16 L8 20 Z"
          fill="currentColor"
          className="drop-shadow-lg"
        />
        <path
          d="M6 10 L16 8 L26 10 L16 14 Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M6 22 L16 24 L26 22 L16 18 Z"
          fill="currentColor"
          opacity="0.8"
        />
      </svg>
    </div>
  );

  return (
    <TooltipProvider>
      <div className={`
        fixed left-0 top-0 h-full bg-black/80 backdrop-blur-sm border-r border-purple-900/30 
        transition-all duration-300 z-10
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-purple-900/30">
            <div className="flex items-center space-x-3">
              <BowtieLogo />
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-semibold text-white">ClauseBuddy</h1>
                  <p className="text-xs text-purple-300">Legal Simplifier</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapseChange(!isCollapsed)}
              className="text-purple-300 hover:text-white hover:bg-purple-900/30"
            >
              {isCollapsed ? <Menu size={18} /> : <X size={18} />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`
                          w-full flex items-center justify-center transition-all duration-200
                          ${isActive 
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                            : 'text-purple-200 hover:text-white hover:bg-purple-900/30'
                          }
                          px-2
                        `}
                        onClick={() => onSectionChange(item.id)}
                      >
                        <Icon size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    w-full justify-start transition-all duration-200
                    ${isActive 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                      : 'text-purple-200 hover:text-white hover:bg-purple-900/30'
                    }
                    px-4
                  `}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon size={18} className="mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-purple-900/30">
            {user ? (
              isCollapsed ? (
                <div className="flex items-center justify-center">
                  <img
                    src={user.avatar || ''}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-purple-700 object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://www.gravatar.com/avatar/?d=mp'; }}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || ''}
                    alt={user.name}
                    className="h-9 w-9 rounded-full border border-purple-700 object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://www.gravatar.com/avatar/?d=mp'; }}
                  />
                  <div>
                    <p className="text-white font-medium truncate max-w-[10rem]">{user.name}</p>
                    <p className="text-xs text-purple-300 truncate max-w-[10rem]">{user.email}</p>
                  </div>
                </div>
              )
            ) : (
              isCollapsed ? (
                <div className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-full border-purple-600/50 text-purple-300 hover:text-white hover:bg-purple-900/30"
                        onClick={onLoginClick}
                      >
                        <LogIn size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Login</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-purple-600/50 text-purple-300 hover:text-white hover:bg-purple-900/30"
                      onClick={onLoginClick}
                    >
                      <LogIn size={16} className="mr-2" />
                      Login
                    </Button>
                  </div>
                  <div className="text-xs text-purple-300 text-center">
                    <p>© 2025 ClauseBuddy</p>
                    <p>Legal AI Assistant</p>
                  </div>
                </div>
              )
            )}
          </div>

        </div>
      </div>
    </TooltipProvider>
  );
}