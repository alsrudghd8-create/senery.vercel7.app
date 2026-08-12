import React, { useState } from 'react';
import { StudentProgress } from '../types';
import { Award, Printer, Download, CheckCircle2, Heart, Sparkles, BookOpen, Scale, Soup, MessageCircleHeart } from 'lucide-react';

interface LearningPortfolioProps {
  studentProgress: StudentProgress;
  onUpdateJournal: (journal: string) => void;
}

export const LearningPortfolio: React.FC<LearningPortfolioProps> = ({
  studentProgress,
  onUpdateJournal,
}) => {
  const [reflectionJournal, setReflectionJournal] = useState<string>(
    studentProgress.reflectionJournal ||
      '이야기 속 다정한 죽집 할머니와 민우처럼, 나도 주변의 아픈 친구나 외로운 이웃에게 다정한 관심과 따뜻한 말 한마디를 건네야겠다고 생각했습니다.'
  );

  const handleJournalChange = (text: string) => {
    setReflectionJournal(text);
    onUpdateJournal(text);
  };

  const handlePrint = () => {
    window.print();
  };

  const badges = [
    {
      id: 'badge-read',
      name: '따뜻한 독서왕',
      desc: '이야기 3장을 모두 깊이 읽음',
      unlocked: studentProgress.readChapters.length >= 3,
      icon: '📚'
    },
    {
      id: 'badge-compare',
      name: '비교 탐구 마스터',
      desc: '이야기 vs 현실 비교 2개 이상 완성',
      unlocked: studentProgress.completedComparisons.filter(c => c.isCompleted).length >= 2,
      icon: '⚖️'
    },
    {
      id: 'badge-recipe',
      name: '다정한 수셰프',
      desc: '나만의 죽 레시피 카드 제작',
      unlocked: studentProgress.savedRecipes.length >= 1,
      icon: '🍲'
    },
    {
      id: 'badge-chat',
      name: '소통과 다정함',
      desc: 'AI 다정이 할머니와 대화 나누기',
      unlocked: studentProgress.aiGrandmaChatCount >= 1,
      icon: '💬'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 print:p-0">
      {/* Portfolio Banner (Hidden on Print) */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-950 text-amber-50 p-6 sm:p-8 rounded-3xl shadow-sm border border-amber-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-600/60 text-amber-200 text-xs px-3 py-1 rounded-full font-bold">
              학습 결과물 종합
            </span>
            <span className="text-amber-200 text-xs">탐구 활동 6단계</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-white mt-1">
            {studentProgress.studentName || '학생'}의 국어 학습 포트폴리오
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
            4학년 2학기 국어: '언제나 다정한 죽집' 탐구 및 현실 세계 비교 활동 성과입니다.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-amber-100 hover:bg-white text-amber-950 font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4 text-amber-800" />
          <span>포트폴리오 인쇄 / PDF 출력</span>
        </button>
      </div>

      {/* Main Certificate & Portfolio Layout */}
      <div className="bg-amber-50/90 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-lg space-y-8 print:border-2 print:shadow-none print:p-6 print:bg-white">
        {/* Certificate Header */}
        <div className="text-center space-y-2 border-b-2 border-amber-200 pb-6">
          <span className="text-xs font-bold text-amber-800 tracking-widest uppercase">
            초등학교 4학년 2학기 국어 탐구 인증서
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-950">
            '언제나 다정한 죽집' 배움 수료 포트폴리오
          </h1>
          <p className="text-xs text-amber-800 font-medium">
            학생 이름: <span className="font-bold text-slate-900 underline underline-offset-4">{studentProgress.studentName || '____________'}</span> | 학습 일자: {new Date().toLocaleDateString('ko-KR')}
          </p>
        </div>

        {/* 4 Steps Accomplishment Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-amber-200 text-center space-y-1">
            <BookOpen className="w-5 h-5 text-amber-700 mx-auto" />
            <div className="text-xs font-bold text-slate-700">이야기 읽기</div>
            <div className="text-lg font-bold text-amber-900">{studentProgress.readChapters.length} / 3 장</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 text-center space-y-1">
            <Scale className="w-5 h-5 text-amber-700 mx-auto" />
            <div className="text-xs font-bold text-slate-700">이야기vs현실 비교</div>
            <div className="text-lg font-bold text-amber-900">
              {studentProgress.completedComparisons.filter(c => c.isCompleted).length} 개 완성
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 text-center space-y-1">
            <Soup className="w-5 h-5 text-amber-700 mx-auto" />
            <div className="text-xs font-bold text-slate-700">죽 레시피 카드</div>
            <div className="text-lg font-bold text-amber-900">{studentProgress.savedRecipes.length} 개 저장</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 text-center space-y-1">
            <Award className="w-5 h-5 text-amber-700 mx-auto" />
            <div className="text-xs font-bold text-slate-700">배움 퀴즈 점수</div>
            <div className="text-lg font-bold text-amber-900">{studentProgress.quizScore} / {studentProgress.quizTotal} 점</div>
          </div>
        </div>

        {/* Badges Earned Section */}
        <div className="space-y-3">
          <h3 className="font-bold font-serif text-amber-950 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>획득한 배움 배지 모음</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                  b.unlocked
                    ? 'bg-white border-amber-400 shadow-xs text-amber-950'
                    : 'bg-slate-100 border-slate-200 text-slate-400 grayscale opacity-60'
                }`}
              >
                <div className="text-3xl">{b.icon}</div>
                <div className="font-bold text-xs">{b.name}</div>
                <div className="text-[10px] text-slate-500">{b.desc}</div>
                {b.unlocked && (
                  <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-1">
                    획득 완료!
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Activities Summary */}
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-amber-200">
          <h3 className="font-bold font-serif text-amber-950 text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-700" />
            <span>내가 완성한 이야기 속 세상 vs 현실 세계 비교</span>
          </h3>

          <div className="space-y-3 divide-y divide-amber-100">
            {studentProgress.completedComparisons.map((c) => (
              <div key={c.id} className="pt-2 text-xs space-y-1">
                <div className="font-bold text-amber-900">주제: {c.category}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                    <span className="font-bold text-amber-800 block">📖 이야기 속:</span>
                    {c.storyAspect}
                  </div>
                  <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100">
                    <span className="font-bold text-sky-800 block">🏡 현실의 경험:</span>
                    {c.studentRealAspect || c.realAspectDefault}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Reflection Journal */}
        <div className="space-y-2 bg-white p-5 rounded-2xl border border-amber-200">
          <label className="font-bold font-serif text-amber-950 text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>단원 성찰일지: 이번 국어 수업을 마치며 느낀 나의 다정한 다짐</span>
          </label>
          <textarea
            value={reflectionJournal}
            onChange={(e) => handleJournalChange(e.target.value)}
            rows={3}
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-600 leading-relaxed font-sans"
            placeholder="이야기와 현실을 비교하며 느낀 점과 앞으로 따뜻한 마음을 나누기 위한 내 다짐을 적어보세요..."
          />
        </div>

        {/* Teacher Evaluation Box */}
        <div className="bg-amber-100/60 p-4 rounded-2xl border border-amber-300 text-xs text-amber-950 space-y-1">
          <span className="font-bold font-serif text-amber-900 block">
            👩‍🏫 담당 교사 총평 및 지도 의견:
          </span>
          <p className="text-slate-700 leading-relaxed italic">
            "이야기 속 '언제나 다정한 죽집'의 이웃 보살핌과 정성을 현실 세계의 내 주변 삶과 연결 지어 깊이 있게 이해하고 적극적으로 표현하였습니다. 타인에 대한 따뜻한 공감 능력과 국어과 성취기준 [4국02-05] 도달도가 우수합니다."
          </p>
        </div>
      </div>
    </div>
  );
};
