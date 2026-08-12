import React, { useState, useEffect } from 'react';
import { TabType, ComparisonCard, PorridgeRecipe, StudentProgress } from './types';
import { INITIAL_COMPARISON_CARDS } from './data/storyData';
import { Header } from './components/Header';
import { StoryReader } from './components/StoryReader';
import { WorldComparison } from './components/WorldComparison';
import { RecipeCardMaker } from './components/RecipeCardMaker';
import { AiChatGrandma } from './components/AiChatGrandma';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { LearningPortfolio } from './components/LearningPortfolio';
import { TeacherGuideModal } from './components/TeacherGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('story');
  const [studentName, setStudentName] = useState<string>('');
  const [readChapters, setReadChapters] = useState<number[]>([1]);
  const [completedComparisons, setCompletedComparisons] = useState<ComparisonCard[]>(INITIAL_COMPARISON_CARDS);
  const [savedRecipes, setSavedRecipes] = useState<PorridgeRecipe[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizTotal, setQuizTotal] = useState<number>(15);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [aiGrandmaChatCount, setAiGrandmaChatCount] = useState<number>(0);
  const [reflectionJournal, setReflectionJournal] = useState<string>('');
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('juk_shop_app_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentName !== undefined) setStudentName(parsed.studentName);
        if (parsed.readChapters) setReadChapters(parsed.readChapters);
        if (parsed.completedComparisons) setCompletedComparisons(parsed.completedComparisons);
        if (parsed.savedRecipes) setSavedRecipes(parsed.savedRecipes);
        if (parsed.quizScore !== undefined) setQuizScore(parsed.quizScore);
        if (parsed.quizCompleted) setQuizCompleted(parsed.quizCompleted);
        if (parsed.aiGrandmaChatCount) setAiGrandmaChatCount(parsed.aiGrandmaChatCount);
        if (parsed.reflectionJournal) setReflectionJournal(parsed.reflectionJournal);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
  }, []);

  // Save state to localStorage on updates
  useEffect(() => {
    try {
      const stateToSave = {
        studentName,
        readChapters,
        completedComparisons,
        savedRecipes,
        quizScore,
        quizCompleted,
        aiGrandmaChatCount,
        reflectionJournal,
      };
      localStorage.setItem('juk_shop_app_state', JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [
    studentName,
    readChapters,
    completedComparisons,
    savedRecipes,
    quizScore,
    quizCompleted,
    aiGrandmaChatCount,
    reflectionJournal,
  ]);

  // Handle Marking Chapter Read
  const handleMarkChapterRead = (chId: number) => {
    if (!readChapters.includes(chId)) {
      setReadChapters([...readChapters, chId]);
    }
  };

  // Calculate overall progress percentage
  const calcProgressPercent = (): number => {
    let score = 0;
    // Reading 3 chapters (max 20%)
    score += Math.min(20, readChapters.length * 7);

    // Quiz completed (max 30%)
    if (quizCompleted) score += 30;

    // Comparisons completed (max 25%)
    const filledCards = completedComparisons.filter((c) => Boolean(c.studentRealAspect?.trim()));
    score += Math.min(25, filledCards.length * 6);

    // Recipes saved (max 15%)
    if (savedRecipes.length > 0) score += 15;

    // AI Chat (max 10%)
    if (aiGrandmaChatCount > 0) score += 10;

    return Math.min(100, Math.round(score));
  };

  // Demo Fill for Teacher
  const handleFillDemoData = () => {
    setStudentName('김민서');
    setReadChapters([1, 2, 3]);
    setQuizScore(15);
    setQuizTotal(15);
    setQuizCompleted(true);
    setCompletedComparisons(INITIAL_COMPARISON_CARDS.map(c => ({ ...c, isCompleted: true })));
    setSavedRecipes([
      {
        id: 'demo-1',
        recipeName: '달콤한 용기의 단호박죽',
        porridgeType: '달콤한 단호박죽',
        heartIngredients: ['따뜻한 말 한마디 (2스푼)', '다정한 눈빛 (1컵)', '웃음 한 스푼'],
        recipient: '감기에 걸린 짝꿍 수진이',
        message: '수진아, 많이 아프지? 내가 정성껏 만든 따뜻한 단호박죽 먹고 얼른 힘내서 내일 학교에서 만나자!',
        createdDate: new Date().toLocaleDateString('ko-KR'),
        aiGrandmaComment: '민우처럼 예쁜 마음을 가진 우리 민서의 다정한 죽 덕분에 수진이 병이 싹 나을 거란다!',
      },
    ]);
    setAiGrandmaChatCount(3);
    setReflectionJournal(
      '이야기 속 다정한 죽집 할머니와 부엌 친구들처럼, 나도 아픈 친구와 외로운 이웃에게 따뜻한 말과 관심을 전하는 어린이로 성장하겠습니다.'
    );
  };

  // Reset Data
  const handleResetData = () => {
    setStudentName('');
    setReadChapters([1]);
    setCompletedComparisons(INITIAL_COMPARISON_CARDS);
    setSavedRecipes([]);
    setQuizScore(0);
    setQuizCompleted(false);
    setAiGrandmaChatCount(0);
    setReflectionJournal('');
    localStorage.removeItem('juk_shop_app_state');
  };

  const studentProgress: StudentProgress = {
    studentName,
    readChapters,
    completedComparisons,
    savedRecipes,
    quizScore,
    quizTotal,
    quizCompleted,
    aiGrandmaChatCount,
    reflectionJournal,
    earnedBadges: [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-amber-100/60 text-slate-800 font-sans selection:bg-amber-200">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentName={studentName}
        setStudentName={setStudentName}
        progressPercent={calcProgressPercent()}
        quizCompleted={quizCompleted}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'story' && (
          <StoryReader
            readChapters={readChapters}
            onMarkChapterRead={handleMarkChapterRead}
            onGoToQuiz={() => setActiveTab('quiz')}
          />
        )}

        {activeTab === 'quiz' && (
          <AssessmentQuiz
            onQuizCompleted={(score, total) => {
              setQuizScore(score);
              setQuizTotal(total);
              setQuizCompleted(true);
            }}
            onGoToComparison={() => setActiveTab('comparison')}
          />
        )}

        {activeTab === 'comparison' && (
          <WorldComparison
            completedCards={completedComparisons}
            onUpdateCards={setCompletedComparisons}
            onGoToRecipe={() => setActiveTab('recipe')}
          />
        )}

        {activeTab === 'recipe' && (
          <RecipeCardMaker
            savedRecipes={savedRecipes}
            onSaveRecipe={(r) => setSavedRecipes([...savedRecipes, r])}
            onGoToChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'chat' && (
          <AiChatGrandma
            studentName={studentName}
            onIncrementChatCount={() => setAiGrandmaChatCount((prev) => prev + 1)}
            onGoToQuiz={() => setActiveTab('portfolio')}
          />
        )}

        {activeTab === 'portfolio' && (
          <LearningPortfolio
            studentProgress={studentProgress}
            onUpdateJournal={setReflectionJournal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/80 bg-amber-900 text-amber-100 py-6 text-center text-xs space-y-1 print:hidden">
        <p className="font-serif font-bold text-sm text-amber-200">
          언제나 다정한 죽집 • 초등학교 4학년 2학기 국어 탐구 어플리케이션
        </p>
        <p className="text-amber-300/80">
          성취기준 [4국02-05] 이야기 속 세상과 현실 세계를 비교하며 읽기
        </p>
      </footer>

      {/* Teacher Guide Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
        onFillDemoData={handleFillDemoData}
        onResetData={handleResetData}
      />
    </div>
  );
}
