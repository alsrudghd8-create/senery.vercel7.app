import React, { useState } from 'react';
import { STORY_CHAPTERS, CHARACTERS_DATA } from '../data/storyData';
import { ArrowRight, Lightbulb, CheckCircle2, Heart, BookMarked, Sparkles, HelpCircle } from 'lucide-react';

interface StoryReaderProps {
  readChapters: number[];
  onMarkChapterRead: (chapterId: number) => void;
  onGoToQuiz: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  readChapters,
  onMarkChapterRead,
  onGoToQuiz,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

  const currentChapter = STORY_CHAPTERS.find((c) => c.id === selectedChapterId) || STORY_CHAPTERS[0];
  const isRead = readChapters.includes(selectedChapterId);

  const toggleHint = (key: string) => {
    setShowHints((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Chapter Selection Bar */}
      <div className="bg-amber-100/70 p-3.5 rounded-2xl border border-amber-200/80 flex flex-wrap gap-2 items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-amber-800" />
          <span className="font-bold text-amber-950 text-sm font-serif">작품 차례:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STORY_CHAPTERS.map((ch) => {
            const isCompleted = readChapters.includes(ch.id);
            const isSelected = ch.id === selectedChapterId;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChapterId(ch.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-amber-50 shadow-md scale-102'
                    : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <span>{ch.chapterNum}</span>
                <span className="hidden sm:inline font-normal">{ch.title}</span>
                {isCompleted && (
                  <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Reading Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Text Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 pointer-events-none" />

            {/* Title Header */}
            <div className="pb-4 border-b border-amber-100 mb-6 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  {currentChapter.chapterNum} • 중심 대상: {currentChapter.characterFocus}
                </span>
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium">
                  황금도깨비상 수상작 《언제나 다정한 죽집》
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 leading-snug">
                {currentChapter.title}
              </h2>
            </div>

            {/* Paragraph Content */}
            <div className="space-y-4 font-sans text-slate-800 text-base sm:text-lg leading-relaxed tracking-wide">
              {currentChapter.content.map((paragraph, idx) => (
                <p key={idx} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 hover:bg-amber-50/40 transition-colors">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Quote Highlight Box */}
            <div className="mt-8 bg-amber-50/90 border-l-4 border-amber-700 p-4 rounded-r-2xl text-amber-950 italic font-serif text-sm sm:text-base flex items-start gap-3 border border-amber-200/60 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold not-italic text-xs text-amber-800 block mb-1">
                  💡 작품 속 다정한 가치 한 문장:
                </span>
                {currentChapter.keyQuote}
              </div>
            </div>

            {/* Chapter Read Action Button */}
            <div className="mt-8 pt-4 border-t border-amber-100 flex flex-wrap justify-between items-center gap-4">
              <div className="text-xs text-slate-500">
                {isRead ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> 제{currentChapter.id}장 읽기를 완료했습니다!
                  </span>
                ) : (
                  '이야기를 다 읽은 후 아래 버튼을 눌러 읽어보기 완료 표시를 해주세요.'
                )}
              </div>

              <button
                onClick={() => onMarkChapterRead(currentChapter.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  isRead
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-800 hover:bg-amber-900 text-white shadow-md hover:scale-102 active:scale-98'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRead ? '읽기 완료됨' : '다 읽었어요! (읽기 완료)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Guided Questions & Character Cards (1 col) */}
        <div className="space-y-6">
          {/* Guided Questions Box */}
          <div className="bg-amber-50/90 rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-950 border-b border-amber-200/80 pb-3">
              <Lightbulb className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-base font-serif">생각을 넓히는 질문</h3>
            </div>

            {currentChapter.guidedQuestions.map((q, idx) => {
              const qKey = `ch${currentChapter.id}_q${idx}`;
              const isHintShown = showHints[qKey];
              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                    Q{idx + 1}. {q.question}
                  </p>

                  <button
                    onClick={() => toggleHint(qKey)}
                    className="text-xs text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 underline cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isHintShown ? '힌트 닫기' : '생각 힌트 보기'}</span>
                  </button>

                  {isHintShown && (
                    <div className="text-xs bg-amber-50 p-2.5 rounded-xl text-amber-950 border border-amber-200 leading-relaxed font-sans">
                      💡 {q.hint}
                    </div>
                  )}

                  <textarea
                    value={userAnswers[qKey] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [qKey]: e.target.value })}
                    placeholder="내 생각이나 느낀 점을 간단히 메모해보세요..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-slate-50/50 resize-none h-16 font-sans"
                  />

                  <div className="bg-amber-100/60 p-2.5 rounded-xl text-[11px] text-amber-950 font-medium">
                    <span className="text-amber-900 font-bold block mb-0.5">📖 이야기 속 모습:</span>
                    {q.storyAspect}
                  </div>
                </div>
              );
            })}

            {/* Bridge to Content Quiz Activity */}
            <div className="bg-gradient-to-br from-amber-800 to-amber-950 text-amber-50 p-4 rounded-2xl space-y-3 shadow-sm border border-amber-700">
              <div className="flex items-center gap-2 text-amber-200">
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-xs font-serif">1단계 필수 미션: 내용 파악하기</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-100/90">
                이야기를 잘 감상하였나요? 15개 문항을 통해 내용을 정확히 파악하면 다음 비교 탐구 미션이 해금됩니다!
              </p>
              <button
                onClick={onGoToQuiz}
                className="w-full bg-amber-100 hover:bg-white text-amber-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>내용 파악 퀴즈 풀기 (15문항)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Character Cards Mini List */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-serif">
              동화 속 등장인물 소개
            </h4>

            <div className="space-y-2.5">
              {CHARACTERS_DATA.map((char) => (
                <div
                  key={char.id}
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${char.color}`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{char.avatarText}</span>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>{char.name}</span>
                      <span className="text-[10px] opacity-80">({char.role})</span>
                    </div>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-tight">{char.description}</p>
                    <div className="mt-1 text-[10px] font-semibold text-amber-900 bg-white/70 inline-block px-1.5 py-0.5 rounded-md">
                      마음/특징: {char.emotion}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
