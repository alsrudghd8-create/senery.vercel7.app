import React from 'react';
import { TabType } from '../types';
import { BookOpen, Scale, Soup, MessageCircleHeart, Award, HelpCircle, GraduationCap, HeartHandshake, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  progressPercent: number;
  quizCompleted: boolean;
  onOpenTeacherGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentName,
  setStudentName,
  progressPercent,
  quizCompleted,
  onOpenTeacherGuide,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; requiresQuiz: boolean; badgeText?: string }[] = [
    { id: 'story', label: '1. 이야기 읽기', icon: <BookOpen className="w-4 h-4" />, requiresQuiz: false },
    { id: 'quiz', label: '1. 내용 파악 퀴즈 (15문항)', icon: <HelpCircle className="w-4 h-4" />, requiresQuiz: false, badgeText: '필수미션' },
    { id: 'comparison', label: '2. 이야기 vs 현실 비교', icon: <Scale className="w-4 h-4" />, requiresQuiz: true, badgeText: '핵심활동' },
    { id: 'recipe', label: '3. 다정한 죽 레시피', icon: <Soup className="w-4 h-4" />, requiresQuiz: true },
    { id: 'chat', label: '4. AI 할머니 대화', icon: <MessageCircleHeart className="w-4 h-4" />, requiresQuiz: true },
    { id: 'portfolio', label: '5. 학습 포트폴리오', icon: <Award className="w-4 h-4" />, requiresQuiz: true },
  ];

  const handleTabClick = (tabId: TabType, requiresQuiz: boolean) => {
    if (requiresQuiz && !quizCompleted) {
      alert('🔒 먼저 [1단계: 내용 파악 퀴즈]를 완성하고 제출하셔야 다음 미션 단계로 이동할 수 있습니다!');
      setActiveTab('quiz');
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-50 shadow-md border-b border-amber-600 sticky top-0 z-30">
      {/* Top Utility Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-xs border-b border-amber-600/40 gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-amber-600 text-amber-100 px-2 py-0.5 rounded-md font-semibold tracking-wide">
            초등 4학년 2학기 국어
          </span>
          <span className="text-amber-200 hidden sm:inline">
            단원 1: 이야기 속 세상과 현실 세계를 비교하며 읽기 [4국02-05]
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/30">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-200">학생 이름:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-transparent border-b border-amber-400/60 text-white font-bold w-20 text-center focus:outline-none focus:border-amber-200"
              placeholder="이름 입력"
            />
          </div>


        </div>
      </div>

      {/* Main Branding Section */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-inner border border-amber-300/40 shrink-0">
            🍲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-amber-100 tracking-tight">
                언제나 다정한 죽집
              </h1>
              <span className="text-xs bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full font-medium">
                국어 탐구
              </span>
            </div>
            <p className="text-xs text-amber-200/90 mt-0.5">
              이야기 속 다정한 세상과 우리가 사는 현실 세계를 견주어 보며 마음을 나누어요
            </p>
          </div>
        </div>

        {/* Learning Progress Bar */}
        <div className="w-full md:w-64 bg-amber-950/50 p-2.5 rounded-xl border border-amber-600/50">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-amber-200 font-medium">나의 국어 배움 진도</span>
            <span className="text-amber-300 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-amber-900/80 rounded-full h-2 overflow-hidden border border-amber-700">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-2 pt-2 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 border-t border-amber-700/60 pt-2 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isLocked = tab.requiresQuiz && !quizCompleted;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.requiresQuiz)}
                className={`relative px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 font-bold shadow-md transform -translate-y-0.5'
                    : isLocked
                    ? 'text-amber-300/50 hover:bg-amber-900/40'
                    : 'text-amber-200 hover:text-amber-100 hover:bg-amber-800/60'
                }`}
              >
                {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400/80" /> : tab.icon}
                <span>{tab.label}</span>
                {tab.badgeText && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-amber-700 text-amber-100' : 'bg-amber-600/80 text-amber-200'
                    }`}
                  >
                    {tab.badgeText}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
