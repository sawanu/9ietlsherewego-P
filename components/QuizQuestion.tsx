
import React from 'react';
import { VocabCard, CategoryStyle } from '../types';
import { HelpCircle } from 'lucide-react';

interface QuizQuestionProps {
  card: VocabCard;
  onAnswer: (selectedAnswer: string) => void;
  questionNumber: number;
  totalQuestions: number;
  categoryStyle: CategoryStyle;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ card, onAnswer, questionNumber, totalQuestions, categoryStyle }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
       <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-slate-400">Question {questionNumber}/{totalQuestions}</span>
        <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${categoryStyle.bg} transition-all duration-300`} 
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 ${categoryStyle.bgLight} ${categoryStyle.text} rounded-lg`}>
            <HelpCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wide mb-1">Definition</p>
            <p className="text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{card.definition}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
           <p className="text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Hint:</span> {card.vietnameseMeaning}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {card.quizOptions.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(option)}
            className={`w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 ${categoryStyle.hoverBorder} transition-all duration-200 font-medium text-slate-700 dark:text-slate-200 active:scale-[0.98]`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
