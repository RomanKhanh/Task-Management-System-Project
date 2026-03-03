import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { LogIn, ShieldCheck, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Login = () => {
  const { users, login, register, resetData } = useAppContext();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager' | 'Member'>('Member');

  const hasAdmin = users.some(u => u.role === 'Admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (loginEmail && loginPassword) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      const success = login(loginEmail, loginPassword);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name && email && password) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      const result = register({ name, email, password, role });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Registration failed');
        setIsLoading(false);
      }
    }
  };

  const handleResetData = () => {
    resetData();
    setShowResetConfirm(false);
    setIsRegistering(true); // Switch to register mode since there are no users left
    setLoginEmail('');
    setLoginPassword('');
    setName('');
    setEmail('');
    setPassword('');
    setRole('Admin'); // Default to admin since it's a fresh start
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center h-20 w-20 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 mb-6"
          >
            {isRegistering ? <UserPlus className="h-10 w-10" /> : <LogIn className="h-10 w-10" />}
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">TaskFlow</h1>
          <p className="text-slate-500 mt-3 font-medium">
            {isRegistering ? 'Create a new account' : 'Sign in to your workspace'}
          </p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-600"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isRegistering ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!loginEmail || !loginPassword || isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setError('');
                    }}
                    className="w-full text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    Create a new account
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  >
                    {!hasAdmin && <option value="Admin">Admin</option>}
                    <option value="Manager">Manager</option>
                    <option value="Member">Member</option>
                  </select>
                  {hasAdmin && role === 'Admin' && (
                    <p className="text-xs text-rose-500 mt-2 ml-1 font-medium">An Admin account already exists.</p>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!name || !email || !password || isLoading || (hasAdmin && role === 'Admin')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Register & Enter
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setError('');
                    }}
                    className="w-full text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reset Confirmation Overlay */}
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 text-rose-600">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-3">Reset All Data?</h4>
                <p className="text-slate-500 mb-8 font-medium">
                  This will permanently delete all users, projects, and tasks. This action cannot be undone.
                </p>
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetData}
                    className="flex-1 py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all"
                  >
                    Yes, Reset Data
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Access</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-slate-200" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">v2.4.0</span>
          </div>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 transition-colors"
          >
            Reset App Data
          </button>
        </div>
      </motion.div>
    </div>
  );
};
