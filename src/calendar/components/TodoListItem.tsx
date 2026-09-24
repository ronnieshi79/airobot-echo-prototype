import React from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Square, Clock, Bell } from 'lucide-react';
import { TodoItem, ScheduleItem } from '../../types';

interface TodoListItemProps {
  todo: TodoItem;
  isDarkMode: boolean;
  todayStr: string;
  onToggle: (id: string) => void;
  onTriggerReminder?: (item: { type: 'schedule' | 'todo'; item: ScheduleItem | TodoItem }) => void;
}

/**
 * TodoListItem
 * 单个待办卡片组件，封装勾选状态、高亮动画、逾期提示及快捷打开 AI 日程卡
 */
export const TodoListItem: React.FC<TodoListItemProps> = ({
  todo,
  isDarkMode,
  todayStr,
  onToggle,
  onTriggerReminder,
}) => {
  const isClosed = todo.status === 'closed';

  return (
    <motion.div
      onClick={() => onTriggerReminder?.({ type: 'todo', item: todo })}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
        isDarkMode
          ? 'bg-slate-800/60 border-white/5 hover:bg-slate-800 shadow-lg shadow-slate-950/20'
          : 'bg-white border-slate-100 shadow-sm hover:bg-slate-50'
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
        className={`flex-shrink-0 mt-0.5 transition-colors cursor-pointer ${
          isClosed
            ? 'text-emerald-500'
            : isDarkMode
            ? 'text-slate-500 hover:text-slate-400'
            : 'text-slate-300 hover:text-slate-400'
        }`}
      >
        {isClosed ? <CheckSquare size={20} /> : <Square size={20} />}
      </button>

      <div className="flex-1 min-w-0">
        <h4
          className={`text-sm font-black break-words ${
            isClosed
              ? isDarkMode
                ? 'text-slate-500 line-through'
                : 'text-slate-400 line-through'
              : isDarkMode
              ? 'text-slate-200'
              : 'text-slate-800'
          }`}
        >
          {todo.task}
        </h4>
        <div
          className={`flex items-center gap-2 mt-2 text-[10px] font-bold ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <span
            className={`px-2 py-0.5 rounded-md ${
              isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            待办
          </span>
          {todo.date && (
            <span
              className={`px-2 py-0.5 rounded-full ${
                !isClosed && todo.date < todayStr
                  ? 'bg-red-500/10 text-red-500'
                  : isDarkMode
                  ? 'bg-slate-700/50'
                  : 'bg-slate-100'
              }`}
            >
              {todo.date === todayStr ? '今天' : todo.date}
            </span>
          )}
          {todo.time && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {todo.time}
            </span>
          )}
        </div>
      </div>

      <div
        className={`flex-shrink-0 p-1.5 rounded-xl transition-all self-center ${
          isDarkMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-600 bg-indigo-50'
        }`}
        title="点击查看 AI 待办卡"
      >
        <Bell size={14} />
      </div>
    </motion.div>
  );
};
