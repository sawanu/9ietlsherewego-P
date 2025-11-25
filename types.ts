

export enum AppStage {
  HOME = 'HOME',
  CATEGORY_SELECTION = 'CATEGORY_SELECTION',
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  LOADING = 'LOADING',
  STUDY = 'STUDY',
  SUMMARY = 'SUMMARY',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}

export enum CategoryId {
  DAILY = 'DAILY',
  WORK_SCHOOL = 'WORK_SCHOOL'
}

export enum DifficultyLevel {
  EASY = 'EASY',     // Band 0-5.0
  MEDIUM = 'MEDIUM', // Band 5.0-7.0
  HARD = 'HARD'      // Band 7.0-9.0
}

export interface TopicDef {
  id: string;
  label: string;
  icon: string;
}

export interface CategoryStyle {
  text: string;
  bg: string;
  bgLight: string;
  border: string;
  hoverBorder: string;
  icon: string;
}

export interface CategoryDef {
  label: string;
  description: string;
  icon: string;
  style: CategoryStyle;
}

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  [CategoryId.DAILY]: { 
    label: "Daily Life",
    description: "Communication, Travel & Hobbies",
    icon: "Coffee",
    style: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-600",
      bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      hoverBorder: "hover:border-emerald-500",
      icon: "text-emerald-500"
    }
  },
  [CategoryId.WORK_SCHOOL]: { 
    label: "Work & School", 
    description: "Marketing Specific & General Business",
    icon: "Briefcase",
    style: {
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-600",
      bgLight: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      hoverBorder: "hover:border-blue-500",
      icon: "text-blue-500"
    }
  }
};

export const TOPICS_BY_CATEGORY: Record<CategoryId, TopicDef[]> = {
  [CategoryId.DAILY]: [
    { id: 'travel', label: 'Travel & Tourism', icon: 'Plane' },
    { id: 'food', label: 'Food & Dining', icon: 'Utensils' },
    { id: 'hobbies', label: 'Hobbies & Interests', icon: 'Gamepad2' },
    { id: 'socializing', label: 'Socializing', icon: 'MessageCircle' },
    { id: 'shopping', label: 'Shopping & Fashion', icon: 'ShoppingBag' },
    { id: 'health', label: 'Health & Wellness', icon: 'Heart' }
  ],
  [CategoryId.WORK_SCHOOL]: [
    // Marketing Specific
    { id: 'digital_marketing', label: 'Digital Marketing', icon: 'Megaphone' },
    { id: 'branding', label: 'Branding & Identity', icon: 'Target' },
    { id: 'content', label: 'Content Strategy', icon: 'PenTool' },
    { id: 'social_media', label: 'Social Media Mgmt', icon: 'Users' },
    // General Business
    { id: 'emails', label: 'Professional Emails', icon: 'Mail' },
    { id: 'meetings', label: 'Meetings & Presentations', icon: 'Presentation' },
    { id: 'negotiation', label: 'Negotiation Skills', icon: 'Handshake' },
    { id: 'project_mgmt', label: 'Project Management', icon: 'Kanban' }
  ]
};

export interface VocabCard {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  vietnameseMeaning: string;
  example: string;
  exampleVietnamese: string;
  wordFamily?: string;
  collocations?: string[];
  synonyms?: string[];
  quizOptions: string[]; // Contains the correct word mixed with distractors
}

export interface QuizResult {
  word: string;
  isCorrect: boolean;
  correctAnswer: string;
}

export interface GameState {
  score: number;
  totalQuestions: number;
  currentCardIndex: number;
  results: QuizResult[];
}
