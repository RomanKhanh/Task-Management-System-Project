import React, { useMemo } from 'react';
import { Task, Subtask } from '../types';
import { format, addDays, differenceInDays, startOfDay, isSameDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GanttChartProps {
  tasks: Task[];
  subtasks: Subtask[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks, subtasks }) => {
  const { startDate, endDate, days } = useMemo(() => {
    if (tasks.length === 0) {
      const today = startOfDay(new Date());
      return {
        startDate: today,
        endDate: addDays(today, 14),
        days: Array.from({ length: 15 }).map((_, i) => addDays(today, i)),
      };
    }

    let minDate = new Date(tasks[0].startDate);
    let maxDate = new Date(tasks[0].deadline);

    tasks.forEach(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.deadline);
      if (taskStart < minDate) minDate = taskStart;
      if (taskEnd > maxDate) maxDate = taskEnd;
    });

    subtasks.forEach(st => {
      const stStart = new Date(st.startDate);
      const stEnd = new Date(st.deadline);
      if (stStart < minDate) minDate = stStart;
      if (stEnd > maxDate) maxDate = stEnd;
    });

    minDate = startOfDay(minDate);
    maxDate = startOfDay(maxDate);
    
    // Add some padding
    minDate = addDays(minDate, -2);
    maxDate = addDays(maxDate, 2);

    const totalDays = differenceInDays(maxDate, minDate) + 1;
    const days = Array.from({ length: totalDays }).map((_, i) => addDays(minDate, i));

    return { startDate: minDate, endDate: maxDate, days };
  }, [tasks, subtasks]);

  const getPositionStyles = (start: string, end: string) => {
    const itemStart = startOfDay(new Date(start));
    const itemEnd = startOfDay(new Date(end));
    
    // Ensure itemStart is not before startDate
    const effectiveStart = itemStart < startDate ? startDate : itemStart;
    const effectiveEnd = itemEnd > endDate ? endDate : itemEnd;

    const leftDays = differenceInDays(effectiveStart, startDate);
    const durationDays = differenceInDays(effectiveEnd, effectiveStart) + 1;
    const totalDays = days.length;

    return {
      left: `${(leftDays / totalDays) * 100}%`,
      width: `${(durationDays / totalDays) * 100}%`,
    };
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
        <p className="text-slate-500 font-medium">No tasks to display in Gantt chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <div className="min-w-[800px] inline-block w-full">
          {/* Header */}
          <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
            <div className="w-64 shrink-0 border-r border-slate-200 p-4 font-bold text-slate-700 text-sm flex items-center bg-slate-50 sticky left-0 z-20">
              Task Name
            </div>
            <div className="flex-1 flex relative">
              {days.map((day, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 min-w-[40px] border-r border-slate-100 flex flex-col items-center justify-center py-2 text-xs",
                    isSameDay(day, new Date()) ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-500"
                  )}
                >
                  <span className="font-medium">{format(day, 'EEE')}</span>
                  <span>{format(day, 'd')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col">
            {tasks.map(task => {
              const taskSubtasks = subtasks.filter(st => st.taskId === task.id);
              
              return (
                <React.Fragment key={task.id}>
                  {/* Task Row */}
                  <div className="flex border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <div className="w-64 shrink-0 border-r border-slate-200 p-3 flex items-center bg-white group-hover:bg-slate-50 sticky left-0 z-10">
                      <span className="font-bold text-sm text-slate-800 truncate" title={task.title}>{task.title}</span>
                    </div>
                    <div className="flex-1 relative py-2">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        {days.map((_, i) => (
                          <div key={i} className="flex-1 border-r border-slate-100/50" />
                        ))}
                      </div>
                      
                      {/* Task Bar */}
                      <div className="relative h-8 w-full">
                        <div 
                          className="absolute top-1 bottom-1 bg-indigo-500 rounded-lg shadow-sm flex items-center px-3 overflow-hidden"
                          style={getPositionStyles(task.startDate, task.deadline)}
                        >
                          <span className="text-xs font-bold text-white truncate">{task.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtask Rows */}
                  {taskSubtasks.map(st => (
                    <div key={st.id} className="flex border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <div className="w-64 shrink-0 border-r border-slate-200 p-2 pl-8 flex items-center bg-white group-hover:bg-slate-50/50 sticky left-0 z-10">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mr-2" />
                        <span className="font-medium text-xs text-slate-600 truncate" title={st.title}>{st.title}</span>
                      </div>
                      <div className="flex-1 relative py-1.5">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex pointer-events-none">
                          {days.map((_, i) => (
                            <div key={i} className="flex-1 border-r border-slate-100/50" />
                          ))}
                        </div>
                        
                        {/* Subtask Bar */}
                        <div className="relative h-6 w-full">
                          <div 
                            className={cn(
                              "absolute top-0.5 bottom-0.5 rounded-md shadow-sm flex items-center px-2 overflow-hidden",
                              st.status === 'Done' ? 'bg-emerald-400' : 
                              st.status === 'In Progress' ? 'bg-amber-400' : 'bg-slate-300'
                            )}
                            style={getPositionStyles(st.startDate, st.deadline)}
                          >
                            <span className="text-[10px] font-bold text-white truncate">{st.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
