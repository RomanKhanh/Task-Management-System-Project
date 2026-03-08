import React from 'react';
import { Outlet, NavLink, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Bell, LogOut, Menu, X, Search, Users } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import * as notificationService from "../services/notificationService";
import { useEffect } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Layout = () => {
  const { currentUser, logout, notifications, markNotificationRead, markAllRead, loadSubtasks } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;
  
  const userNotifications = notifications.filter(n => n.userId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
  ];

  if (currentUser.role === 'Admin') {
    navItems.push({ to: '/members', icon: Users, label: 'Members' });
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow</h1>
          </div>
        </div>
        
        <nav className="mt-4 px-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                location.pathname === item.to ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-xl shadow-slate-200 overflow-hidden relative">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 blur-xl" />
            <p className="text-xs font-medium text-slate-400">Current Plan</p>
            <p className="mt-1 text-sm font-bold">Pro Team</p>
            <button className="mt-3 w-full rounded-lg bg-white/10 py-2 text-xs font-semibold hover:bg-white/20 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 z-40">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200/50 w-64">
              <Search className="h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                className={cn(
                  "relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all duration-200",
                  showNotifications && "bg-slate-50 text-indigo-600"
                )}
                // onClick={() => setShowNotifications(!showNotifications)}
                onClick={() => {
                  setShowNotifications(!showNotifications);

                  if (!showNotifications && unreadCount > 0) {
                    markAllRead(currentUser.id);
                  }
                }}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {userNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                            <Bell className="h-6 w-6 text-slate-300" />
                          </div>
                          <p className="text-sm text-slate-500">All caught up!</p>
                        </div>
                      ) : (
                        userNotifications.map(n => (
                          <div 
                            key={n.id} 
                            className={cn(
                              "p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50", 
                              !n.isRead && "bg-indigo-50/30"
                            )}
                            onClick={() => markNotificationRead(n.id)}
                          >
                            <p className={cn("text-sm leading-snug", !n.isRead ? "font-semibold text-slate-900" : "text-slate-600")}>
                              {n.message}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1.5 uppercase tracking-wider">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                      <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                        View All Activity
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-slate-900 leading-none">{currentUser.name}</span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{currentUser.role}</span>
              </div>
              <div className="relative group">
                <img 
                  src={currentUser.avatar} 
                  alt="Avatar" 
                  className="h-10 w-10 rounded-xl border-2 border-white shadow-md group-hover:shadow-indigo-100 transition-all duration-300 cursor-pointer" 
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-200"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
