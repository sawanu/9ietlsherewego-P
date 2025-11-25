import React from 'react';
import * as LucideIcons from 'lucide-react';
import { TopicDef, CategoryStyle } from '../types';

interface TopicCardProps {
  topic: TopicDef;
  onClick: (topic: TopicDef) => void;
  disabled: boolean;
  categoryStyle: CategoryStyle;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick, disabled, categoryStyle }) => {
  // Dynamically resolve icon component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[topic.icon] || LucideIcons.Zap;

  return (
    <button
      onClick={() => onClick(topic)}
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md ${categoryStyle.hoverBorder} transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group h-40`}
    >
      <div className={`mb-4 ${categoryStyle.bgLight} p-3 rounded-full group-hover:scale-110 transition-transform duration-200`}>
        <IconComponent className={`w-8 h-8 ${categoryStyle.text}`} />
      </div>
      <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-center text-sm sm:text-base">{topic.label}</h3>
    </button>
  );
};

export default TopicCard;