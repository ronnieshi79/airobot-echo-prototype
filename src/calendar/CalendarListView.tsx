import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListTodo, ChevronUp, ChevronDown } from 'lucide-react';
import { TodoItem, ScheduleItem, MainCategory, SubCategory } from '../types';
import { SchedulePlannerOverlay } from './SchedulePlannerOverlay';
import { getTodayInfo, getLocalDateString } from './utils';
import { TodoListItem } from './components/TodoListItem';
import { CalendarAetherTip } from './components/CalendarAetherTip';

interface CalendarListViewProps {
  isDarkMode: boolean;
  todos: TodoItem[];
  schedules: ScheduleItem[];
  time: Date;
  onNavigate: (cat: MainCategory, sub: SubCategory) => void;
  onToggleTodo: (id: string) => void;
  onAddTodo: (task: string, date?: string, time?: string) => void;
  onToggleSchedule: (id: string) => void;
  onShowPlanner?: (item?: ScheduleItem | TodoItem, date?: Date) => void;
  onTriggerReminder?: (item: { type: 'schedule' | 'todo'; item: ScheduleItem | TodoItem }) => void;
}

/**
 * CalendarListView
 * AI 待办视图 (View Layer)
 * 包含多维度时态筛选、待办卡片列表、可折叠已完成清单与 AETHER 待办流态分析
 */
export const CalendarListView: React.FC<CalendarListViewProps> = ({ 
  isDarkMode, 
  todos = [], 
  schedules = [],
  time,
  onNavigate,
  onToggleTodo,
  onAddTodo,
  onToggleSchedule,
  onShowPlanner,
  onTriggerReminder
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'open' | 'closed' | 'today' | 'week'>('all');
  const [completedCollapsed, setCompletedCollapsed] = useState(true);
  
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [activePlannerItem, setActivePlannerItem] = useState<{ id: string; type: 'schedule' | 'todo' } | undefined>(undefined);

  const openPlanner = (item?: { id: string; type: 'schedule' | 'todo' }, targetDate?: Date) => {
    let itemObj: ScheduleItem | TodoItem | undefined = undefined;
    if (item) {
      if (item.type === 'todo') itemObj = todos.find(t => t.id === item.id);
      else itemObj = schedules.find(s => s.id === item.id);
    }
    if (onShowPlanner) {
      onShowPlanner(itemObj, targetDate || time);
    } else {
      setActivePlannerItem(item);
      setPlannerOpen(true);
    }
  };
  
  const dayInfo = getTodayInfo(time);
  const todayStr = getLocalDateString(time);
  const nextWeekTime = time.getTime() + 7 * 86400000;
  const nextWeekStr = getLocalDateString(new Date(nextWeekTime));

  const filteredTodos = todos.filter(todo => {
    const todoDate = todo.date || '';
    switch (timeFilter) {
      case 'open':
        return todo.status === 'open';
      case 'closed':
        return todo.status === 'closed';
      case 'today':
        return todoDate === todayStr;
      case 'week':
        return todoDate && todoDate >= todayStr && todoDate <= nextWeekStr;
      case 'all':
      default:
        return true;
    }
  });

  const timeTabs = [
    { id: 'all', label: '全部' },
    { id: 'open', label: '进行中' },
    { id: 'closed', label: '已完成' },
    { id: 'today', label: '今天' },
    { id: 'week', label: '最近7天' },
  ] as const;

  const openTodos = filteredTodos.filter(t => t.status === 'open');
  const closedTodos = filteredTodos.filter(t => t.status === 'closed');

  // Aether 提示文案计算
  const computeAetherTip = () => {
    const allOpen = todos.filter(t => t.status === 'open');
    const overdues = allOpen.filter(t => t.date && t.date < todayStr);
    const upcoming = allOpen.filter(t => t.date === todayStr);
    
    if (allOpen.length === 0) return '主人，太棒了！所有待办均已清空，尽情享受属于你的时间吧。';

    let summary = `主人，目前您共有 ${allOpen.length} 项待办进行中。`;
    if (overdues.length > 0) {
      summary += `其中有 ${overdues.length} 项已逾期，建议优先处理哦！`;
    } else if (upcoming.length > 0) {
      summary += `其中 ${upcoming.length} 项将于今日到期，请把握进度。`;
    } else {
      summary += `所有任务均在计划内，待办流态非常健康，记得按时完成哦！`;
    }
    return summary;
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      {/* 1. Header */}
      <div className="mb-4 flex-shrink-0 pr-12">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <ListTodo size={20} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            AI 待办
          </h2>
        </div>
        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          智能助手助你高效规划并管理每一项待办任务
        </p>
      </div>

      {/* 2. Filters & Controls */}
      <div className="flex flex-col gap-3 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 flex-1">
            {timeTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeFilter(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap transition-colors cursor-pointer ${
                  timeFilter === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. List */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3.5 rounded-[2rem] p-4 ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
        <AnimatePresence mode="wait">
          {timeFilter === 'all' ? (
            <div key="all-list" className="flex flex-col gap-3">
              {/* Active / Uncompleted Section */}
              {openTodos.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {openTodos.map(todo => (
                    <TodoListItem
                      key={`todo-${todo.id}`}
                      todo={todo}
                      isDarkMode={isDarkMode}
                      todayStr={todayStr}
                      onToggle={onToggleTodo}
                      onTriggerReminder={onTriggerReminder}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    暂无未完成的待办任务
                  </p>
                </div>
              )}

              {/* Completed Section (Collapsible) */}
              {closedTodos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200/10">
                  <button
                    onClick={() => setCompletedCollapsed(!completedCollapsed)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors text-xs font-black cursor-pointer ${
                      isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-200/50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>已完成 ({closedTodos.length})</span>
                    </span>
                    {completedCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </button>
                  
                  <AnimatePresence>
                    {!completedCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-3 mt-2 overflow-hidden"
                      >
                        {closedTodos.map(todo => (
                          <TodoListItem
                            key={`todo-closed-${todo.id}`}
                            todo={todo}
                            isDarkMode={isDarkMode}
                            todayStr={todayStr}
                            onToggle={onToggleTodo}
                            onTriggerReminder={onTriggerReminder}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ) : (
            <div key="filtered-list" className="flex flex-col gap-3">
              {filteredTodos.length > 0 ? (
                filteredTodos.map(todo => (
                  <TodoListItem
                    key={`todo-filtered-${todo.id}`}
                    todo={todo}
                    isDarkMode={isDarkMode}
                    todayStr={todayStr}
                    onToggle={onToggleTodo}
                    onTriggerReminder={onTriggerReminder}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    当前筛选条件下没有待办
                  </p>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Bottom Modular Aether Prompt */}
      <CalendarAetherTip
        isDarkMode={isDarkMode}
        text={computeAetherTip()}
      />
      
      <SchedulePlannerOverlay 
        isOpen={plannerOpen} 
        onClose={() => setPlannerOpen(false)} 
        isDarkMode={isDarkMode}
        schedules={schedules}
        todos={todos}
        initialItem={activePlannerItem}
        todayInfo={dayInfo}
        time={time}
      />
    </div>
  );
};
