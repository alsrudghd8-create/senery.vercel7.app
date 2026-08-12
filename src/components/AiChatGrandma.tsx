import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageCircleHeart, Send, Sparkles, User, Bot, HelpCircle, HeartHandshake } from 'lucide-react';

interface AiChatGrandmaProps {
  studentName: string;
  onIncrementChatCount: () => void;
  onGoToQuiz: () => void;
}

const PRESET_PROMPTS = [
  "👵 할머니, 아프거나 마음이 슬플 때는 무슨 죽을 먹는 게 제일 좋나요?",
  "👦 이야기 속 민우처럼 저도 현실에서 이웃이나 친구를 따뜻하게 보살피고 싶어요.",
  "💌 친구한테 속상했던 일을 사과하고 싶은데 다정하게 마음을 전하는 법을 알려주세요.",
  "🏫 현실에서 우리 동네 사람들과 다정한 마음을 나누려면 어떻게 해야 할까요?"
];

export const AiChatGrandma: React.FC<AiChatGrandmaProps> = ({
  studentName,
  onIncrementChatCount,
  onGoToQuiz,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'grandma',
      text: `아이구, 우리 ${studentName || '4학년'} 강아지 어서 오려무나! 다정한 죽집에 잘 왔단다. 오늘 날씨도 쌀쌀한데 따뜻한 보리차 한 잔 마시면서 이야기해보자꾸나. 할머니한테 현실에서 느낀 따뜻한 경험이나 마음속 이야기, 무엇이든 물어보렴!`,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    onIncrementChatCount();

    try {
      // Format chat history for API
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const replyText = data.reply || "할머니가 이야기를 잘 못 들었단다. 다시 한 번 말해줄래?";

      const aiMsg: ChatMessage = {
        id: `grandma-${Date.now()}`,
        sender: 'grandma',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'grandma',
        text: '아이구, 네트워크 연결이 잠시 불안정한가 보구나. 조금 뒤에 다시 대화하자꾸나!',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 text-amber-50 p-6 rounded-3xl shadow-sm border border-amber-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-2xl flex items-center justify-center shrink-0 shadow-inner">
            👵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-600/60 text-amber-200 text-[10px] px-2 py-0.5 rounded-md font-bold">
                AI 다정한 대화
              </span>
              <span className="text-xs text-amber-200">초등 4학년 맞춤 상담</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-white">
              다정이 할머니와 마음 나누기
            </h2>
            <p className="text-xs text-amber-200 opacity-90 mt-0.5">
              이야기 속 죽집 할머니와 다정하게 이야기하며 나만의 다정한 생각을 나누어요
            </p>
          </div>
        </div>

        <button
          onClick={onGoToQuiz}
          className="bg-amber-100 hover:bg-white text-amber-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer shrink-0"
        >
          5단계: 배움 퀴즈로 이동 →
        </button>
      </div>

      {/* Preset Prompt Suggestions */}
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
        <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-700" />
          <span>할머니께 이렇게 질문해보세요 (추천 질문)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_PROMPTS.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(promptText)}
              disabled={loading}
              className="text-left text-xs bg-white hover:bg-amber-100/80 p-2.5 rounded-xl border border-amber-200/80 text-amber-950 font-medium transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-amber-50/20">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base shrink-0 shadow-xs border ${
                    isUser
                      ? 'bg-amber-800 text-white border-amber-700'
                      : 'bg-amber-100 text-amber-950 border-amber-300'
                  }`}
                >
                  {isUser ? '👦' : '👵'}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] space-y-1 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                  <div className="text-[11px] font-bold text-slate-500 px-1">
                    {isUser ? studentName || '나' : '다정이 할머니'}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs font-sans whitespace-pre-wrap ${
                      isUser
                        ? 'bg-amber-800 text-amber-50 rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 rounded-tl-none border border-amber-200 font-serif'
                    }`}
                  >
                    {m.text}
                  </div>

                  <div className="text-[10px] text-slate-400 px-1">{m.timestamp}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-950 flex items-center justify-center text-base shrink-0 border border-amber-300">
                👵
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-amber-200 text-xs text-amber-900 font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>할머니가 인자한 미소로 답변을 생각하고 계십니다...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-amber-100/60 border-t border-amber-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="할머니께 하고 싶은 이야기나 질문을 자유롭게 적어보세요..."
            disabled={loading}
            className="flex-1 bg-white text-xs sm:text-sm p-3 rounded-2xl border border-amber-300 focus:outline-none focus:border-amber-600 font-sans"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">전송</span>
          </button>
        </div>
      </div>
    </div>
  );
};
