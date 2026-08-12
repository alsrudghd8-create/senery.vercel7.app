import React, { useState } from 'react';
import { PorridgeRecipe } from '../types';
import { Soup, Sparkles, Heart, Send, CheckCircle2, Download, Printer, Plus, Trash2 } from 'lucide-react';

interface RecipeCardMakerProps {
  savedRecipes: PorridgeRecipe[];
  onSaveRecipe: (recipe: PorridgeRecipe) => void;
  onGoToChat: () => void;
}

const PORRIDGE_TYPES = [
  { name: '달콤한 단호박죽', emoji: '🎃', desc: '달콤한 웃음과 활력을 전하는 죽' },
  { name: '구수한 액막이 팥죽', emoji: '🥣', desc: '액운을 막고 마음을 든든하게 해주는 죽' },
  { name: '영양 만점 전복죽', emoji: '🦪', desc: '지친 기운을 돋우고 쾌유를 비는 죽' },
  { name: '고소한 잣죽', emoji: '🥜', desc: '부드러운 말 한마디로 마음을 녹이는 죽' },
  { name: '싱그러운 야채죽', emoji: '🥦', desc: '편안하고 사르르 감싸주는죽' },
];

const HEART_INGREDIENT_OPTIONS = [
  '따뜻한 말 한마디 (2스푼)',
  '다정한 눈빛 (1컵)',
  '경청하는 귀 (푹 고아내기)',
  '웃음과 밝은 표정 (한 꼬집)',
  '다독이는 따스한 손길 (1개)',
  '토닥여주는 응원 (듬뿍)',
  '기다려주는 인내심 (천천히)',
];

export const RecipeCardMaker: React.FC<RecipeCardMakerProps> = ({
  savedRecipes,
  onSaveRecipe,
  onGoToChat,
}) => {
  const [recipeName, setRecipeName] = useState<string>('따스한 용기를 주는 단호박죽');
  const [selectedPorridge, setSelectedPorridge] = useState<string>('달콤한 단호박죽');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    '따뜻한 말 한마디 (2스푼)',
    '다정한 눈빛 (1컵)',
    '웃음과 밝은 표정 (한 꼬집)'
  ]);
  const [customIngredient, setCustomIngredient] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('감기에 걸려 아픈 내 친구 수진이에게');
  const [message, setMessage] = useState<string>(
    '수진아, 많이 아프지? 내가 마음을 담은 따뜻한 죽을 준비했어. 이거 먹고 훌훌 털고 일어나서 내일 꼭 학교에서 만나자!'
  );
  const [aiGrandmaComment, setAiGrandmaComment] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const toggleIngredient = (ing: string) => {
    if (selectedIngredients.includes(ing)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== ing));
    } else {
      setSelectedIngredients([...selectedIngredients, ing]);
    }
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim()) {
      if (!selectedIngredients.includes(customIngredient.trim())) {
        setSelectedIngredients([...selectedIngredients, customIngredient.trim()]);
      }
      setCustomIngredient('');
    }
  };

  const handleFetchGrandmaBlessing = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/recipe-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeName,
          porridgeType: selectedPorridge,
          ingredients: selectedIngredients,
          recipient,
          message,
        }),
      });

      const data = await res.json();
      if (data.feedback) {
        setAiGrandmaComment(data.feedback);
      }
    } catch (err) {
      console.error(err);
      alert('할머니 덕담을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveCurrentRecipe = () => {
    const newRecipe: PorridgeRecipe = {
      id: `recipe-${Date.now()}`,
      recipeName,
      porridgeType: selectedPorridge,
      heartIngredients: selectedIngredients,
      recipient,
      message,
      createdDate: new Date().toLocaleDateString('ko-KR'),
      aiGrandmaComment,
    };

    onSaveRecipe(newRecipe);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-amber-50 p-6 sm:p-8 rounded-3xl shadow-sm border border-amber-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-600/60 text-amber-100 text-xs px-3 py-1 rounded-full font-bold">
              마음 나누기 실천 활동
            </span>
            <span className="text-amber-200 text-xs">탐구 활동 3단계</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
            나만의 '다정한 죽' 레시피 카드 만들기
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
            소중한 사람에게 마음을 담은 세상에 단 하나뿐인 다정한 죽 레시피와 편지를 만들어 선물하세요!
          </p>
        </div>

        <button
          onClick={onGoToChat}
          className="bg-amber-100 hover:bg-white text-amber-950 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer shrink-0"
        >
          4단계: AI 할머니와 대화하기 →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Form: Recipe Ingredient & Message Builder */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold font-serif text-slate-800 border-b border-amber-100 pb-3 flex items-center gap-2">
            <Soup className="w-5 h-5 text-amber-700" />
            <span>죽 완성하기 (재료와 마음 적기)</span>
          </h3>

          {/* Recipe Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">1. 내가 만든 다정한 죽 이름</label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600 bg-amber-50/30 font-medium"
              placeholder="예: 따스한 용기를 주는 단호박죽"
            />
          </div>

          {/* Porridge Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">2. 바탕이 되는 죽 종류 선택</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PORRIDGE_TYPES.map((pt) => {
                const isSelected = selectedPorridge === pt.name;
                return (
                  <button
                    key={pt.name}
                    type="button"
                    onClick={() => setSelectedPorridge(pt.name)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-amber-800 text-amber-50 border-amber-800 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    <span className="text-2xl">{pt.emoji}</span>
                    <div>
                      <div className="text-xs font-bold">{pt.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                        {pt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Heart Ingredients Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">3. 죽에 넣을 '마음 재료' 선택 (여러 개 선택 가능)</label>
            <div className="flex flex-wrap gap-2">
              {HEART_INGREDIENT_OPTIONS.map((ing) => {
                const isChecked = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => toggleIngredient(ing)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '} {ing}
                  </button>
                );
              })}
            </div>

            {/* Custom Ingredient Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
                placeholder="나만의 특별한 마음 재료 직접 쓰기..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={addCustomIngredient}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                추가
              </button>
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">4. 누구에게 보낼 죽인가요? (받는 사람)</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600 bg-amber-50/30 font-medium"
              placeholder="예: 독감에 걸린 짝꿍 수진이, 매일 고생하시는 우리 엄마"
            />
          </div>

          {/* Heartwarming Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">5. 다정한 카드 메시지 쓰기</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600 bg-white resize-none leading-relaxed"
              placeholder="상대방에게 전하고 싶은 따뜻한 응원과 마음의 글을 적어주세요..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleFetchGrandmaBlessing}
              disabled={isAiLoading}
              className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>{isAiLoading ? '할머니 덕담 적는 중...' : '죽집 할머니 덕담 받기'}</span>
            </button>

            <button
              onClick={handleSaveCurrentRecipe}
              className="flex-1 bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{savedSuccess ? '카드 저장 완료!' : '레시피 카드 저장하기'}</span>
            </button>
          </div>
        </div>

        {/* Right Preview Card: Styled Storybook Recipe Card */}
        <div className="space-y-4 sticky top-24">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>실시간 완성 레시피 카드 미리보기</span>
            <span className="text-amber-800 font-normal">언제나 다정한 죽집 인증 카드</span>
          </div>

          <div className="bg-amber-50/90 rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-lg relative overflow-hidden text-amber-950 space-y-6 font-serif">
            {/* Background Seal Stamp */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-dashed border-amber-400/60 flex items-center justify-center rotate-12 opacity-80 pointer-events-none">
              <span className="text-[11px] font-bold text-amber-800 text-center leading-tight">
                다정한 죽집<br />정성 인증
              </span>
            </div>

            {/* Header */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-amber-200/80">
              <div className="text-3xl">🍲</div>
              <h4 className="text-xl sm:text-2xl font-bold text-amber-950">{recipeName || '나만의 다정한 죽'}</h4>
              <p className="text-xs font-sans text-amber-800">
                베이스 죽: {selectedPorridge}
              </p>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-2 bg-white/80 p-4 rounded-2xl border border-amber-200/60 font-sans">
              <span className="text-xs font-bold text-amber-900 block font-serif">
                🥣 듬뿍 들어간 마음 재료:
              </span>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside font-medium">
                {selectedIngredients.length > 0 ? (
                  selectedIngredients.map((ing, i) => <li key={i}>{ing}</li>)
                ) : (
                  <li className="text-slate-400 italic">선택된 마음 재료가 없습니다.</li>
                )}
              </ul>
            </div>

            {/* Recipient & Message */}
            <div className="space-y-2 bg-amber-100/60 p-4 rounded-2xl border border-amber-200 font-sans">
              <div className="text-xs font-bold text-amber-900 font-serif">
                💌 받는 사람: <span className="text-amber-950 font-sans">{recipient}</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed italic bg-white/90 p-3 rounded-xl border border-amber-200">
                "{message || '따뜻한 마음의 편지를 작성해 보세요.'}"
              </p>
            </div>

            {/* AI Grandma Comment if fetched */}
            {aiGrandmaComment && (
              <div className="bg-amber-900 text-amber-50 p-4 rounded-2xl space-y-1 font-sans text-xs shadow-xs">
                <span className="font-bold text-amber-300 font-serif block">
                  👵 다정이 할머니의 축복 덕담:
                </span>
                <p className="leading-relaxed opacity-95">{aiGrandmaComment}</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 text-center text-[11px] text-amber-800 font-sans border-t border-amber-200/60">
              초등학교 4학년 2학기 국어 • 다정한 마음 나누기 작품
            </div>
          </div>

          {/* Saved Cards Carousel */}
          {savedRecipes.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-amber-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 font-serif">
                내가 저장한 마음 카 목록 ({savedRecipes.length}개)
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedRecipes.map((r) => (
                  <div key={r.id} className="p-3 bg-amber-50 rounded-xl text-xs border border-amber-200 space-y-1">
                    <div className="font-bold text-amber-950">{r.recipeName}</div>
                    <div className="text-slate-600 text-[11px]">To. {r.recipient}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
