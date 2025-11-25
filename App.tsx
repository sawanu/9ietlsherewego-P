
import React, { useState, useEffect } from 'react';
import { AppStage, CategoryId, TopicDef, CATEGORIES, TOPICS_BY_CATEGORY, VocabCard, GameState, DifficultyLevel } from './types';
import { generateVocabulary } from './services/geminiService';
import TopicCard from './components/TopicCard';
import Flashcard from './components/Flashcard';
import QuizQuestion from './components/QuizQuestion';
import { BookOpen, Trophy, ArrowRight, Home, BrainCircuit, Loader2, Sparkles, Briefcase, Coffee, ArrowLeft, Sun, Moon, Volume2, Signal } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.HOME);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicDef | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM);
  const [vocabList, setVocabList] = useState<VocabCard[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    totalQuestions: 0,
    currentCardIndex: 0,
    results: []
  });

  // Anti-repetition history state
  const [seenWords, setSeenWords] = useState<string[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lingoLab_seenWords');
      if (stored) {
        setSeenWords(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('lingoLab_seenWords', JSON.stringify(seenWords));
  }, [seenWords]);

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const getActiveStyle = () => {
    if (selectedCategory) {
      return CATEGORIES[selectedCategory].style;
    }
    // Default style (Work/School as fallback)
    return CATEGORIES[CategoryId.WORK_SCHOOL].style;
  };

  const activeStyle = getActiveStyle();

  const handleCategorySelect = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setStage(AppStage.TOPIC_SELECTION);
  };

  const handleTopicSelect = async (topic: TopicDef) => {
    if (!selectedCategory) return;
    
    setSelectedTopic(topic);
    setStage(AppStage.LOADING);
    
    // Pass the last ~50 words to exclude to prevent recent repetition
    const excludeList = seenWords.slice(-50);

    const cards = await generateVocabulary(selectedCategory, topic.label, difficulty, excludeList);
    
    // Update history with new words
    const newWordList = cards.map(c => c.word);
    setSeenWords(prev => {
      // Keep only the last 150 words to avoid unlimited storage growth
      const updated = [...prev, ...newWordList];
      return updated.slice(-150);
    });

    setVocabList(cards);
    setGameState({
      score: 0,
      totalQuestions: cards.length,
      currentCardIndex: 0,
      results: []
    });
    setStage(AppStage.STUDY);
  };

  const handleNextStudyCard = () => {
    if (gameState.currentCardIndex < vocabList.length - 1) {
      setGameState(prev => ({ ...prev, currentCardIndex: prev.currentCardIndex + 1 }));
    } else {
      // Finished study, go to summary
      setStage(AppStage.SUMMARY);
    }
  };

  const handleStartQuiz = () => {
    setGameState(prev => ({ ...prev, currentCardIndex: 0 }));
    setStage(AppStage.QUIZ);
  };

  const handleQuizAnswer = (answer: string) => {
    const currentCard = vocabList[gameState.currentCardIndex];
    const isCorrect = answer === currentCard.word;

    const newResults = [
      ...gameState.results,
      { word: currentCard.word, isCorrect, correctAnswer: currentCard.word }
    ];

    const nextIndex = gameState.currentCardIndex + 1;
    const nextScore = isCorrect ? gameState.score + 1 : gameState.score;

    if (nextIndex < vocabList.length) {
      setGameState({
        ...gameState,
        score: nextScore,
        currentCardIndex: nextIndex,
        results: newResults
      });
    } else {
      setGameState({
        ...gameState,
        score: nextScore,
        results: newResults
      });
      setStage(AppStage.RESULTS);
    }
  };

  const resetToHome = () => {
    setStage(AppStage.HOME);
    setSelectedCategory(null);
    setSelectedTopic(null);
    setVocabList([]);
  };

  const resetToCategories = () => {
    setStage(AppStage.CATEGORY_SELECTION);
    setSelectedCategory(null);
    setSelectedTopic(null);
    setVocabList([]);
  };

  const resetToTopics = () => {
    setStage(AppStage.TOPIC_SELECTION);
    setSelectedTopic(null);
    setVocabList([]);
  };

  // === RENDER METHODS ===

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 transition-colors">
      
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-indigo-500" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="z-10 text-center px-4 max-w-2xl">
        <div className="mb-8 flex justify-center">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-slate-100 dark:border-slate-700 transform -rotate-3">
             <BrainCircuit size={64} className="text-emerald-500" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-white drop-shadow-sm tracking-tight mb-4">
          Hành trình giúp Yunee đạt 9.0 IELTS :P
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-lg mx-auto leading-relaxed">
          Master Your Vocabulary
        </p>

        <button 
          onClick={() => setStage(AppStage.CATEGORY_SELECTION)}
          className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          <span className="relative flex items-center gap-2">
            Start Journey <ArrowRight size={20} />
          </span>
        </button>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white/40 to-transparent dark:from-slate-900/40 pointer-events-none"></div>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-8 relative z-10">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Select a Category</h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {(Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
            const cat = CATEGORIES[catId];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (catId === CategoryId.WORK_SCHOOL) ? Briefcase : Coffee;
            const style = cat.style;

            return (
              <button 
                key={catId}
                onClick={() => handleCategorySelect(catId)}
                className={`flex flex-col items-center text-center p-8 rounded-3xl border-2 transition-all duration-300 group ${style.border} ${style.bgLight} hover:bg-white dark:hover:bg-slate-700 ${style.hoverBorder} hover:shadow-xl hover:-translate-y-1`}
              >
                <div className={`w-24 h-24 rounded-full ${style.bg} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-12 h-12 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${style.text} mb-3`}>{cat.label}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-base">{cat.description}</p>
                <div className={`mt-6 p-2 rounded-full bg-white/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0`}>
                    <ArrowRight size={20} className={style.text} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTopicSelection = () => {
    if (!selectedCategory) return null;
    const categoryInfo = CATEGORIES[selectedCategory];
    const topics = TOPICS_BY_CATEGORY[selectedCategory];

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col justify-center relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
           <button onClick={resetToCategories} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium">
             <div className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
               <ArrowLeft size={20} />
             </div>
             Back to Categories
           </button>
           
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
             Topics: <span className={`${activeStyle.text}`}>{categoryInfo.label}</span>
           </h2>
        </div>

        {/* Difficulty Selector */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
           <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-semibold">
              <Signal size={20} />
              <span>Select Difficulty Level</span>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: DifficultyLevel.EASY, label: 'Easy (0 - 5.0)', color: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' },
                { id: DifficultyLevel.MEDIUM, label: 'Medium (5.0 - 7.0)', color: 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' },
                { id: DifficultyLevel.HARD, label: 'Hard (7.0 - 9.0)', color: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setDifficulty(lvl.id)}
                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                    difficulty === lvl.id 
                      ? `${lvl.color} border-current ring-1 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-current shadow-sm` 
                      : 'border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
           </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {topics.map((topic) => (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              onClick={handleTopicSelect} 
              disabled={stage === AppStage.LOADING}
              categoryStyle={activeStyle}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-4rem)] relative z-10">
      <div className="relative">
        <div className={`absolute inset-0 ${activeStyle.bg} blur-xl opacity-20 rounded-full animate-pulse`}></div>
        <Loader2 className={`w-16 h-16 ${activeStyle.text} animate-spin mb-6 relative z-10`} />
      </div>
      <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">Generating Words...</h3>
      <div className="mt-2 px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-500 border border-slate-200 dark:border-slate-700">
         {difficulty === DifficultyLevel.EASY ? 'Band 0-5.0' : difficulty === DifficultyLevel.MEDIUM ? 'Band 5.0-7.0' : 'Band 7.0-9.0'}
      </div>
      <p className="text-slate-500 dark:text-slate-400 mt-4 text-center max-w-sm text-lg animate-pulse">
        AI is crafting your lesson...
      </p>
    </div>
  );

  const renderStudyMode = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 relative z-10">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 justify-center">
          <BookOpen className={activeStyle.text} /> Study Mode
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Card {gameState.currentCardIndex + 1} of {vocabList.length}</p>
      </div>

      <Flashcard 
        card={vocabList[gameState.currentCardIndex]} 
        categoryStyle={activeStyle}
      />

      <div className="mt-12 w-full max-w-md">
        <button 
          onClick={handleNextStudyCard}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
        >
          {gameState.currentCardIndex === vocabList.length - 1 ? "Finish Study" : "Next Word"}
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 relative z-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Session Complete! 🎉</h2>
           <p className="text-lg text-slate-600 dark:text-slate-400">Review these words before the quiz.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          {vocabList.map((card, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div>
                <div className="flex items-center gap-3">
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{card.word}</p>
                    <span className="text-sm font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">{card.pronunciation}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{card.vietnameseMeaning}</p>
              </div>
              <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   const utterance = new SpeechSynthesisUtterance(card.word);
                   utterance.lang = 'en-US';
                   window.speechSynthesis.speak(utterance);
                 }}
                 className={`p-2 rounded-full ${activeStyle.bgLight} ${activeStyle.text} hover:opacity-80 transition-opacity`}
              >
                <Volume2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={handleStartQuiz}
          className={`w-full flex items-center justify-center gap-2 ${activeStyle.bg} text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:opacity-90 transition-transform active:scale-[0.98]`}
        >
          I'm Ready! Start Quiz <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );

  const renderQuizMode = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 relative z-10">
      <QuizQuestion 
        card={vocabList[gameState.currentCardIndex]} 
        onAnswer={handleQuizAnswer}
        questionNumber={gameState.currentCardIndex + 1}
        totalQuestions={vocabList.length}
        categoryStyle={activeStyle}
      />
    </div>
  );

  const renderResults = () => {
    const percentage = Math.round((gameState.score / vocabList.length) * 100);
    let message = "Keep practicing!";
    if (percentage >= 80) message = "Excellent Work! 🚀";
    else if (percentage >= 50) message = "Good effort! 📈";

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 relative z-10">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-8">
            <div className={`inline-block p-6 ${activeStyle.bgLight} rounded-full mb-6 animate-bounce`}>
              <Trophy className={`w-16 h-16 text-yellow-500`} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{message}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">You scored <span className={`font-bold ${activeStyle.text}`}>{gameState.score}/{vocabList.length}</span></p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8 text-left">
            {gameState.results.map((res, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{vocabList[idx].word}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px] sm:max-w-xs">{vocabList[idx].definition}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${res.isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {res.isCorrect ? 'Correct' : 'Missed'}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={resetToTopics}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              Different Topic
            </button>
            <button 
              onClick={resetToHome}
              className={`flex items-center justify-center gap-2 px-6 py-3 ${activeStyle.bg} text-white font-semibold rounded-lg hover:opacity-90 transition-colors shadow-md shadow-${activeStyle.text}/20`}
            >
              <Home size={18} /> Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header - Only visible when NOT in Home */}
      {stage !== AppStage.HOME && (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={resetToHome}>
              <div className={`${selectedCategory ? activeStyle.bg : 'bg-slate-800 dark:bg-slate-700'} text-white p-1.5 rounded-lg transition-colors`}>
                <BrainCircuit size={20} />
              </div>
              <span className="font-bold text-lg text-slate-800 dark:text-white hidden sm:block">Hành trình giúp Yunee đạt 9.0 IELTS :P</span>
            </div>
            
            <div className="flex items-center gap-4">
              {stage !== AppStage.CATEGORY_SELECTION && stage !== AppStage.TOPIC_SELECTION && (
                <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                    {selectedCategory && <span className="text-slate-500 dark:text-slate-400">{CATEGORIES[selectedCategory].label} /</span>}
                    {selectedTopic && <span className={`${activeStyle.text} px-3 py-1 ${activeStyle.bgLight} rounded-full`}>{selectedTopic.label}</span>}
                    {stage === AppStage.QUIZ && <span className="text-slate-500 dark:text-slate-400 ml-2">Score: {gameState.score}</span>}
                </div>
              )}

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-indigo-500" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${stage === AppStage.HOME ? '' : 'bg-slate-50 dark:bg-slate-900'} relative transition-colors duration-300`}>
        {stage === AppStage.HOME && renderHome()}
        {stage === AppStage.CATEGORY_SELECTION && renderCategorySelection()}
        {stage === AppStage.TOPIC_SELECTION && renderTopicSelection()}
        {stage === AppStage.LOADING && renderLoading()}
        {stage === AppStage.STUDY && renderStudyMode()}
        {stage === AppStage.SUMMARY && renderSummary()}
        {stage === AppStage.QUIZ && renderQuizMode()}
        {stage === AppStage.RESULTS && renderResults()}
      </main>
    </div>
  );
};

export default App;
