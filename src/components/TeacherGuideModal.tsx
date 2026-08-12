import React from 'react';
import { GraduationCap, X, CheckCircle2, BookOpen, Scale, Sparkles, RefreshCw, Lock } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFillDemoData: () => void;
  onResetData: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
  onFillDemoData,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-amber-200 relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-amber-100 pb-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-800 text-amber-50 flex items-center justify-center text-xl shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              초등 4학년 2학기 국어 교사용 수업 지도 가이드
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
              '언제나 다정한 죽집' 수업 설계 및 교수학습 과정안
            </h2>
          </div>
        </div>

        {/* Curriculum Alignment Box */}
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-2 mb-6">
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            📌 2015/2022 개정 국어과 교육과정 성취기준
          </h3>
          <p className="text-sm font-bold text-amber-950 font-serif">
            [4국02-05] 이야기 속 세상과 현실 세계를 비교하며 읽는다.
          </p>
          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
            <li>성취수준 (상): 이야기 속 상황과 인물의 마음을 이해하고, 현실 세계의 경험과 비교하여 공통점과 차이점, 배울 점을 다채롭게 표현할 수 있다.</li>
            <li>성취수준 (중): 이야기 속 상황을 파악하고, 현실 세계에서 자신이나 이웃이 겪은 일과 비교하여 말할 수 있다.</li>
            <li>성취수준 (하): 이야기 속 주요 사건을 파악하고, 인물의 행동에 대해 말할 수 있다.</li>
          </ul>
        </div>

        {/* 5-Step Lesson Flow */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold font-serif text-slate-800 text-base">
            📖 5차시 통합 수업 모듈 안내
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>1차시: 이야기 작품 감상 (Story Reading)</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">1단계 Part 1</span>
              </div>
              <p className="text-xs text-slate-600">
                동화 1~3장 감상 및 생각을 넓히는 질문 작성. 다정이 할머니와 팥냥이, 부엌 친구들의 다정한 마법을 감상합니다.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>1차시: 내용 파악 필수 퀴즈 (15문항) & 단계 해금</span>
                <span className="bg-amber-800 text-white px-2 py-0.5 rounded-full">1단계 필수 미션</span>
              </div>
              <p className="text-xs text-slate-600">
                객관식, 단답형, 괄호 채우기, 어휘 문제, 상상 활동 서술형 15문항을 완료해야 2단계 비교 탐구 단계가 해금됩니다.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>2차시: 이야기 속 세상 vs 현실 세계 비교 (Core Matrix)</span>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">2단계</span>
              </div>
              <p className="text-xs text-slate-600">
                음식, 이웃, 위로, 소통 주제별 매트릭스 비교. 공통점, 차이점, 배울 점을 작성하고 AI 피드백을 받습니다.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>3차시: 나만의 다정한 죽 레시피 카드 제작 (Real World Transfer)</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">3단계</span>
              </div>
              <p className="text-xs text-slate-600">
                '따뜻한 말 한마디', '경청하는 귀' 등 마음 재료를 조합하여 아픈 친구나 가족에게 전할 레시피 카드를 제작합니다.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>4~5차시: AI 다정이 할머니 대화 & 종합 포트폴리오</span>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">4~5단계</span>
              </div>
              <p className="text-xs text-slate-600">
                AI 죽집 할머니와 따뜻한 대화를 주고받고, 전체 국어 활동 성과물을 포트폴리오로 출력 또는 PDF 저장합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Action Controls */}
        <div className="pt-4 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onFillDemoData();
                alert('데모 시연용 샘플 데이터 및 전체 퀴즈/미션 단계가 해금되었습니다!');
              }}
              className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>수업 시연용 데이터 채우기 & 전체 해금</span>
            </button>

            <button
              onClick={() => {
                if (confirm('모든 학생 작성 데이터를 초기화하고 퀴즈 잠금 상태로 되돌릴까요?')) {
                  onResetData();
                  alert('데이터가 초기화되었습니다.');
                }
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>학습 데이터 초기화</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
