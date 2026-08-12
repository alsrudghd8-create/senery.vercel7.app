import React, { useState } from 'react';
import { QUIZ_QUESTIONS, VOCABULARY_LIST } from '../data/quizData';
import { CheckCircle2, XCircle, RotateCcw, BookOpen, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface AssessmentQuizProps {
  onQuizCompleted: (score: number, total: number) => void;
  onGoToComparison: () => void;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({
  onQuizCompleted,
  onGoToComparison,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: any }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'vocab'>('quiz');

  // Question 15 essay state
  const [essayItem, setEssayItem] = useState<string>('');
  const [essayReason, setEssayReason] = useState<string>('');
  const [essayStory, setEssayStory] = useState<string>('');

  const handleSelectOption = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleTextAnswer = (qId: number, text: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: text }));
  };

  const handleMultiTextAnswer = (qId: number, idx: number, text: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? [...prev[qId]] : ['', ''];
      current[idx] = text;
      return { ...prev, [qId]: current };
    });
  };

  const checkAnswer = (q: (typeof QUIZ_QUESTIONS)[0]): boolean => {
    const userVal = selectedAnswers[q.id];
    if (userVal === undefined) return false;

    if (q.type === 'multiple' || q.type === 'select') {
      return userVal === q.correctAnswer;
    }
    if (q.type === 'short_text') {
      const cleaned = String(userVal || '').trim().replace(/\s+/g, '');
      const correctClean = String(q.correctAnswer || '').trim().replace(/\s+/g, '');
      return cleaned === correctClean;
    }
    if (q.type === 'multi_short_text') {
      if (!Array.isArray(userVal)) return false;
      const ans1 = String(userVal[0] || '').trim();
      const ans2 = String(userVal[1] || '').trim();
      // Allow any order of ["소금", "설탕"]
      return (
        (ans1 === '소금' && ans2 === '설탕') ||
        (ans1 === '설탕' && ans2 === '소금')
      );
    }
    if (q.type === 'creative_essay') {
      return essayItem.trim().length > 0 && essayReason.trim().length > 0 && essayStory.trim().length > 0;
    }
    return false;
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (checkAnswer(q)) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    onQuizCompleted(score, QUIZ_QUESTIONS.length);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setEssayItem('');
    setEssayReason('');
    setEssayStory('');
    setSubmitted(false);
  };

  const score = calculateScore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Quiz Banner */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-950 text-amber-50 p-6 sm:p-8 rounded-3xl shadow-sm border border-amber-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-600/60 text-amber-200 text-xs px-3 py-1 rounded-full font-bold">
              1단계 핵심 미션: 작품 내용 파악하기
            </span>
            <span className="text-amber-200 text-xs">필수 단계</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-white mt-1">
            '언제나 다정한 죽집' 내용 파악 15문항 퀴즈
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
            책을 깊이 읽고 물음에 답해보세요. 내용 파악을 완료해야 다음 단계(이야기 vs 현실 비교)가 해금됩니다!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-950/60 p-1.5 rounded-2xl border border-amber-500/30 shrink-0">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quiz' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-amber-200 hover:text-white'
            }`}
          >
            내용 파악 퀴즈 (15문항)
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vocab' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-amber-200 hover:text-white'
            }`}
          >
            핵심 어휘 사전
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <div className="space-y-6">
          {/* Questions List */}
          {QUIZ_QUESTIONS.map((q) => {
            const isCorrect = submitted && checkAnswer(q);
            const isAnswered =
              q.type === 'creative_essay'
                ? essayItem.trim().length > 0 && essayStory.trim().length > 0
                : selectedAnswers[q.id] !== undefined;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-6 border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-amber-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {q.curriculumConcept}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug mt-1">
                      {q.question}
                    </h3>
                  </div>

                  {submitted && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> 정답
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> 오답/미완성
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Multiple Choice / Select Options */}
                {(q.type === 'multiple' || q.type === 'select') && q.options && (
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      let optionStyle = 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-amber-50';

                      if (isSelected) {
                        optionStyle = 'bg-amber-800 text-amber-50 border-amber-800 font-bold';
                      }

                      if (submitted) {
                        if (optIdx === q.correctAnswer) {
                          optionStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={submitted}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold shrink-0">
                            {optIdx + 1}
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Single Short Text Input */}
                {q.type === 'short_text' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      disabled={submitted}
                      value={selectedAnswers[q.id] || ''}
                      onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                      placeholder="정답 단어를 입력하세요 (예: 동지)"
                      className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-amber-200 focus:outline-none focus:border-amber-600 bg-slate-50 disabled:bg-slate-100 font-medium"
                    />
                    {submitted && (
                      <p className="text-xs text-amber-900 font-bold">
                        정답: <span className="text-emerald-700 underline">{q.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Multi Short Text Input */}
                {q.type === 'multi_short_text' && (
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        disabled={submitted}
                        value={(selectedAnswers[q.id] && selectedAnswers[q.id][0]) || ''}
                        onChange={(e) => handleMultiTextAnswer(q.id, 0, e.target.value)}
                        placeholder="첫 번째 들어갈 단어 (예: 소금)"
                        className="flex-1 text-xs sm:text-sm p-3.5 rounded-2xl border border-amber-200 focus:outline-none focus:border-amber-600 bg-slate-50 disabled:bg-slate-100 font-medium"
                      />
                      <input
                        type="text"
                        disabled={submitted}
                        value={(selectedAnswers[q.id] && selectedAnswers[q.id][1]) || ''}
                        onChange={(e) => handleMultiTextAnswer(q.id, 1, e.target.value)}
                        placeholder="두 번째 들어갈 단어 (예: 설탕)"
                        className="flex-1 text-xs sm:text-sm p-3.5 rounded-2xl border border-amber-200 focus:outline-none focus:border-amber-600 bg-slate-50 disabled:bg-slate-100 font-medium"
                      />
                    </div>
                    {submitted && (
                      <p className="text-xs text-amber-900 font-bold">
                        정답: <span className="text-emerald-700 underline">소금, 설탕</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Question 15: Creative Essay Activity */}
                {q.type === 'creative_essay' && (
                  <div className="space-y-4 bg-amber-50/60 p-5 rounded-2xl border border-amber-200">
                    <p className="text-xs text-amber-900 font-bold">
                      ● 「언제나 다정 죽집」에서 생명을 얻어 움직이는 부엌 도구들처럼, 내가 가진 물건 중에서 살아 움직였으면 하는 것을 상상해 봅시다.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          살아 움직이길 바라는 물건:
                        </label>
                        <input
                          type="text"
                          disabled={submitted}
                          value={essayItem}
                          onChange={(e) => setEssayItem(e.target.value)}
                          placeholder="예: 3년 동안 쓴 노란색 연필통, 내 보물 가방..."
                          className="w-full text-xs p-3 rounded-xl border border-amber-200 bg-white focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          그 물건을 고른 이유:
                        </label>
                        <input
                          type="text"
                          disabled={submitted}
                          value={essayReason}
                          onChange={(e) => setEssayReason(e.target.value)}
                          placeholder="예: 내가 매일 공부할 때 곁에서 지켜봐 주고 아껴주었기 때문에..."
                          className="w-full text-xs p-3 rounded-xl border border-amber-200 bg-white focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        그 물건이 살아 움직인다면 어떤 사건이 생길지, 또 어떤 좋은 점이 있을지 적어 봅시다:
                      </label>
                      <textarea
                        rows={3}
                        disabled={submitted}
                        value={essayStory}
                        onChange={(e) => setEssayStory(e.target.value)}
                        placeholder="예: 내가 숙제하다 피곤해할 때 따뜻한 손으로 내 어깨를 다독여 주고, 시험 준비할 때 함께 응원해 주어 힘이 날 것 같습니다."
                        className="w-full text-xs p-3 rounded-xl border border-amber-200 bg-white focus:outline-none focus:border-amber-600 resize-none font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* Explanation on Submission */}
                {submitted && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1 font-sans">
                    <div className="font-bold text-amber-900 flex items-center gap-1">
                      💡 내용 해설:
                    </div>
                    <p className="leading-relaxed text-slate-700">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submission / Score Footer Bar */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {submitted ? (
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-800 text-amber-50 flex flex-col items-center justify-center font-serif border border-amber-900 shrink-0">
                  <span className="text-xl font-bold">{score}</span>
                  <span className="text-[10px] text-amber-200">/ 15 점</span>
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {score >= 12
                      ? '🎉 축하합니다! 작품 내용 파악 완벽 완료!'
                      : '👏 잘했습니다! 1단계 내용 파악 미션을 완료했습니다.'}
                  </div>
                  <p className="text-xs text-amber-800 font-medium mt-0.5">
                    🔓 2단계 [이야기 vs 현실 비교] 미션이 해금되었습니다!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-600 space-y-0.5">
                <p className="font-bold text-amber-900">
                  📌 1단계 내용 파악 퀴즈를 모두 풀고 [퀴즈 제출하기]를 완료하면 다음 미션 단계로 이동할 수 있습니다.
                </p>
                <p className="text-slate-500">객관식, 단답형, 괄호 채우기, 서술형 15문항을 차근차근 완성해 보세요.</p>
              </div>
            )}

            <div className="flex gap-3">
              {submitted ? (
                <>
                  <button
                    onClick={handleReset}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-3 rounded-2xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>다시 풀기</span>
                  </button>
                  <button
                    onClick={onGoToComparison}
                    className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer shrink-0"
                  >
                    <span>2단계: 이야기 vs 현실 비교로 이동</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>퀴즈 제출하기 및 내용파악 완료</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Vocabulary List View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VOCABULARY_LIST.map((v, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="font-bold font-serif text-amber-900 text-base">{v.word}</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                  핵심 어휘
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">{v.meaning}</p>
              <div className="bg-amber-50 p-2.5 rounded-xl text-[11px] text-amber-900 italic font-serif">
                예문: "{v.example}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
