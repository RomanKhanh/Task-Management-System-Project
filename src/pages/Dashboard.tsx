import React from 'react';
import { useAppContext } from '../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, Clock, XCircle, ListTodo, TrendingUp, Users, Target } from 'lucide-react';
import { motion } from 'motion/react';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444'];

export const Dashboard = () => {
  const { tasks, projects, users } = useAppContext();

  const taskStats = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length, icon: ListTodo, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { name: 'Done', value: tasks.filter(t => t.status === 'Done').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { name: 'Cancel', value: tasks.filter(t => t.status === 'Cancel').length, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  const projectProgress = projects.map(p => {
    const projectTasks = tasks.filter(t => t.projectId === p.id);
    const doneTasks = projectTasks.filter(t => t.status === 'Done').length;
    const progress = projectTasks.length > 0 ? Math.round((doneTasks / projectTasks.length) * 100) : 0;
    return { name: p.name, progress };
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Workspace Overview</h2>
          <p className="text-slate-500 mt-1 font-medium"> Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex -space-x-2 overflow-hidden px-2">
            {users.slice(0, 4).map((user) => (
              <img
                key={user.id}
                lassName="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src={user.avatar}
                alt={user.name}
              />
            ))}
          </div>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <span className="text-xs font-bold text-slate-600 pr-3">{users.length} Team Members</span>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {taskStats.map((stat) => (
          <motion.div 
            key={stat.name} 
            variants={item}
            whileHover={{ y: -4 }}
            className={`rounded-3xl border ${stat.border} bg-white p-6 shadow-sm shadow-slate-100 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.name}</p>
                <p className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} shadow-inner`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Project Progress */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Project Performance</h3>
            </div>
            <select className="text-xs font-bold text-slate-500 bg-slate-50 border-none rounded-lg px-3 py-1.5 focus:ring-0">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgress} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar 
                  dataKey="progress" 
                  fill="#6366f1" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Task Load</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {taskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {taskStats.map((stat, i) => (
              <div key={stat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
