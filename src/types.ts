export type TabType = 'story' | 'quiz' | 'comparison' | 'recipe' | 'chat' | 'portfolio';

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  emotion: string;
  color: string;
  avatarText: string;
}

export interface StoryChapter {
  id: number;
  chapterNum: string;
  title: string;
  summary: string;
  content: string[];
  keyQuote: string;
  characterFocus: string;
  guidedQuestions: {
    question: string;
    hint: string;
    storyAspect: string;
    realWorldConnectionPrompt: string;
  }[];
  imageUrl?: string;
}

export interface ComparisonCard {
  id: string;
  category: string;
  storyAspect: string; // 이야기 속 세상
  realAspectDefault: string; // 현실 세계 기본 안내
  studentRealAspect?: string; // 학생이 적은 현실 세계
  similarity?: string; // 공통점
  difference?: string; // 차이점
  lessonLearned?: string; // 배울 점
  isCompleted?: boolean;
}

export interface PorridgeRecipe {
  id: string;
  recipeName: string; // 예: "따스한 웃음 단호박죽"
  porridgeType: string; // 단호박죽, 팥죽, 전복죽, 잣죽, 야채죽
  heartIngredients: string[]; // "따뜻한 말 한마디", "다정한 눈빛", "다독이는 손길", "경청하는 귀", "웃음 한 스푼"
  recipient: string; // "독감에 걸린 내 친구 민우", "고생하시는 우리 엄마"
  message: string;
  createdDate: string;
  aiGrandmaComment?: string;
}

export interface QuizQuestion {
  id: number;
  type: 'multiple' | 'short_text' | 'select' | 'multi_short_text' | 'creative_essay';
  question: string;
  options?: string[];
  correctAnswer?: number | string | string[]; // index, string, or array of acceptable answers
  explanation: string;
  curriculumConcept: string; // 4학년 2학기 성취기준 핵심 개념
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'grandma' | 'teacher';
  text: string;
  timestamp: string;
}

export interface StudentProgress {
  studentName: string;
  readChapters: number[];
  completedComparisons: ComparisonCard[];
  savedRecipes: PorridgeRecipe[];
  quizScore: number;
  quizTotal: number;
  quizCompleted: boolean;
  aiGrandmaChatCount: number;
  reflectionJournal: string;
  earnedBadges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }[];
}
