import React, { useState } from 'react';
import { ComparisonCard } from '../types';
import { INITIAL_COMPARISON_CARDS } from '../data/storyData';
import { Scale, Sparkles, Plus, CheckCircle2, RefreshCw, MessageSquare, HeartHandshake, ArrowRight } from 'lucide-react';

interface WorldComparisonProps {
  completedCards: ComparisonCard[];
  onUpdateCards: (cards: ComparisonCard[]) => void;
  onGoToRecipe: () => void;
}

export const WorldComparison: React.FC<WorldComparisonProps> = ({
  completedCards,
  onUpdateCards,
  onGoToRecipe,
}) => {
  const [cards, setCards] = useState<ComparisonCard[]>(() => {
    return completedCards.length > 0 ? completedCards : INITIAL_COMPARISON_CARDS;
  });

  const [activeCardId, setActiveCardId] = useState<string>(cards[0].id);
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState<boolean>(false);
  const [aiFeedbackMap, setAiFeedbackMap] = useState<{ [cardId: string]: string }>({});

  const activeCard = cards.find((c) => c.id === activeCardId) || cards[0];

  const handleInputChange = (field: keyof ComparisonCard, value: string) => {
    const updated = cards.map((c) => {
      if (c.id === activeCardId) {
        return {
          ...c,
          [field]: value,
          isCompleted: Boolean(c.studentRealAspect || value),
        };
      }
      return c;
    });
    setCards(updated);
    onUpdateCards(updated);
  };

  const handleAddNewCard = () => {
    const newCard: ComparisonCard = {
      id: `custom-${Date.now()}`,
      category: '소통과 다정함',
      storyAspect: '이야기 속 장면: ',
      realAspectDefault: '현실 세계의 나의 경험: ',
      studentRealAspect: '',
      similarity: '',
      difference: '',
      lessonLearned: '',
      isCompleted: false,
    };
    const updated = [...cards, newCard];
    setCards(updated);
    setActiveCardId(newCard.id);
    onUpdateCards(updated);
  };

  const handleFetchAiFeedback = async () => {
    if (!activeCard.studentRealAspect) {
      alert('현실 세계에서 내가 경험한 일이나 생각을 작성한 후 AI 피드백을 요청해주세요!');
      return;
    }

    setAiFeedbackLoading(true);
    try {
      const res = await fetch('/api/ai/compare-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyPoint: activeCard.storyAspect,
          realWorldPoint: activeCard.studentRealAspect,
          comparisonThought: activeCard.lessonLearned || activeCard.similarity,
        }),
      });

      const data = await res.json();
      if (data.feedback) {
        setAiFeedbackMap((prev) => ({ ...prev, [activeCard.id]: data.feedback }));
      }
    } catch (err) {
      console.error(err);
      alert('AI 피드백을 가져오는 도중 오류가 발생했습니다.');
    } finally {
      setAiFeedbackLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Learning Objective Hero Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 p-6 sm:p-8 rounded-3xl shadow-md border border-amber-600 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs px-3 py-1 rounded-full font-bold">
                국어 성취기준 [4국02-05]
              </span>
              <span className="text-amber-200 text-xs">탐구 활동 2단계</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              이야기 속 세상과 현실 세계 견주어 보기
            </h2>
            <p className="text-amber-200/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              '언제나 다정한 죽집'에서 일어난 따뜻한 이야기들을 내 주변의 가족, 친구, 동네 현실 경험과 비교해보세요. 공통점과 차이점을 찾으며 나만의 생각을 넓힐 수 있습니다.
            </p>
          </div>

          <div className="bg-amber-950/60 p-4 rounded-2xl border border-amber-500/30 text-center shrink-0 w-full md:w-auto">
            <div className="text-2xl font-bold text-amber-300">
              {cards.filter((c) => c.isCompleted).length} / {cards.length}
            </div>
            <div className="text-xs text-amber-200 mt-0.5">비교 작성 완료</div>
          </div>
        </div>
      </div>

      {/* Comparison Topics Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200">
        <div className="flex flex-wrap gap-2">
          {cards.map((c, idx) => {
            const isSelected = c.id === activeCardId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCardId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-amber-50 shadow-md scale-102'
                    : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>주제 {idx + 1}: {c.category}</span>
                {c.isCompleted && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleAddNewCard}
          className="bg-amber-700 hover:bg-amber-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>새 주제 추가</span>
        </button>
      </div>

      {/* Main Comparison Matrix Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        {/* Category Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-700" />
            <h3 className="text-xl font-bold font-serif text-slate-800">
              비교 주제: <span className="text-amber-800">{activeCard.category}</span>
            </h3>
          </div>
          <span className="text-xs text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-semibold">
            이야기 vs 현실
          </span>
        </div>

        {/* Two-Column Comparison Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Story World */}
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm border-b border-amber-200 pb-2">
              <span className="text-lg">📖</span>
              <span>이야기 속 세상 (언제나 다정한 죽집)</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-sans bg-white p-4 rounded-xl border border-amber-100">
              {activeCard.storyAspect}
            </p>
            <p className="text-xs text-amber-800 italic">
              💡 죽집 할머니와 민우가 보여준 따뜻한 정성과 관심의 모습입니다.
            </p>
          </div>

          {/* Column 2: My Real World (Student Input) */}
          <div className="bg-sky-50/80 p-5 rounded-2xl border border-sky-200/80 space-y-3">
            <div className="flex items-center gap-2 text-sky-950 font-bold text-sm border-b border-sky-200 pb-2">
              <span className="text-lg">🏡</span>
              <span>내가 사는 진짜 현실 세계 (나의 경험)</span>
            </div>

            <textarea
              value={activeCard.studentRealAspect || ''}
              onChange={(e) => handleInputChange('studentRealAspect', e.target.value)}
              placeholder="예: 내가 아팠을 때 엄마가 죽을 끓여주신 경험, 다리를 다친 친구 가방을 들어준 경험 등 현실에서 경험한 일을 자유롭게 적어보세요..."
              className="w-full text-sm p-3.5 rounded-xl border border-sky-200 focus:outline-none focus:border-sky-500 bg-white resize-none h-28 leading-relaxed font-sans"
            />
            <p className="text-xs text-sky-800">
              ✍️ 내 삶에서 실제로 겪은 일이나 직접 본 따뜻한 이웃의 이야기를 적어보세요.
            </p>
          </div>
        </div>

        {/* Deep Analysis Rows (Similarity, Difference, Lessons) */}
        <div className="space-y-4 pt-2">
          <h4 className="font-bold text-slate-800 text-sm font-serif flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>이야기와 현실을 견주어 보며 깊게 생각하기</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Similarity */}
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <label className="text-xs font-bold text-amber-900 block">
                🤝 공통점 (비슷한 점)
              </label>
              <textarea
                value={activeCard.similarity || ''}
                onChange={(e) => handleInputChange('similarity', e.target.value)}
                placeholder="이야기와 현실 모두 아플 때 마음을 나누는 모습이 어떻게 비슷한가요?"
                className="w-full text-xs p-2.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-400 bg-white h-20 resize-none"
              />
            </div>

            {/* Difference */}
            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 space-y-2">
              <label className="text-xs font-bold text-rose-950 block">
                🔄 차이점 (다른 점)
              </label>
              <textarea
                value={activeCard.difference || ''}
                onChange={(e) => handleInputChange('difference', e.target.value)}
                placeholder="이야기 속 모습과 현실 세계의 모습은 어떤 차이가 있나요?"
                className="w-full text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-400 bg-white h-20 resize-none"
              />
            </div>

            {/* Lesson Learned */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <label className="text-xs font-bold text-emerald-950 block">
                🌱 배울 점 (새롭게 깨달은 점)
              </label>
              <textarea
                value={activeCard.lessonLearned || ''}
                onChange={(e) => handleInputChange('lessonLearned', e.target.value)}
                placeholder="이 비교를 통해 현실에서 나는 앞으로 어떤 마음가짐을 가져야 할까요?"
                className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-400 bg-white h-20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* AI Teacher Feedback Button & Box */}
        <div className="pt-4 border-t border-amber-100 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleFetchAiFeedback}
              disabled={aiFeedbackLoading}
              className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{aiFeedbackLoading ? 'AI 선생님이 피드백을 작성 중입니다...' : 'AI 국어 선생님 피드백 받기'}</span>
            </button>

            <button
              onClick={onGoToRecipe}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm ml-auto"
            >
              <span>3단계: 나만의 다정한 죽 레시피 만들기로 이동</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Render AI Feedback if present */}
          {aiFeedbackMap[activeCard.id] && (
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-300 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                <HeartHandshake className="w-4 h-4 text-amber-700" />
                <span>AI 국어 선생님의 칭찬 & 피드백</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap bg-white p-3.5 rounded-xl border border-amber-200/80">
                {aiFeedbackMap[activeCard.id]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
