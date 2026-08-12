import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini API client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "언제나 다정한 죽집 국어 수업 백엔드" });
  });

  // AI Chat with Grandma / AI Teacher (초등 4학년 맞춤형 따뜻한 대화)
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "GEMINI_API_KEY가 설정되어 있지 않습니다.",
        });
      }

      const systemInstruction = `
당신은 초등학교 4학년 2학기 국어 교과서 '언제나 다정한 죽집' 이야기 속 '죽집 할머니(다정이)' 또는 따뜻한 AI 국어 선생님입니다.
대상: 초등학교 4학년 어린이 (만 9~10세)

[대화 지침]
1. 따뜻하고 친근하며 정겨운 말투(할머니 말투 또는 다정한 선생님 말투: "~했단다", "~란다", "~했구나!", "~해보렴")를 사용하세요.
2. 초등학교 4학년 학생의 수준에 맞추어 쉬운 단어와 따뜻한 공감의 표현을 써주세요.
3. 이야기 '언제나 다정한 죽집'의 주제(아픈 이웃이나 지친 사람들에게 죽 한 그릇으로 마음을 나누는 따뜻함)를 상기시켜 주세요.
4. 학생이 현실 세계에서 경험한 '따뜻한 마음을 나누거나 받은 경험'을 잘 말할 수 있도록 다정하게 격려하고 질문해 주세요.
5. 답변은 3~5문장 이내로 너무 길지 않고 정감 있게 답해주세요.
6. 학생이 예의 바르고 배려하는 마음을 배울 수 있도록 칭찬과 긍정적 강화를 해주세요.
`;

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const item of history) {
          contents.push({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: item.content }],
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "아이구, 할머니가 이야기를 잘 못 들었단다. 다시 한번 말해줄 수 있겠니?";
      res.json({ reply });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: error.message || "AI 대화 중 오류가 발생했습니다." });
    }
  });

  // AI Compare Feedback (이야기 속 세상 vs 현실 세계 비교 피드백)
  app.post("/api/ai/compare-feedback", async (req, res) => {
    try {
      const { storyPoint, realWorldPoint, comparisonThought } = req.body;

      const prompt = `
초등학교 4학년 2학기 국어 성취기준 [4국02-05] "이야기 속 세상과 현실 세계를 비교하며 읽기" 활동입니다.
작품: '언제나 다정한 죽집'

학생이 작성한 비교 내용:
- 이야기 속 세상: ${storyPoint}
- 현실 세계의 경험/생각: ${realWorldPoint}
- 비교를 통해 느낀 점/배운 점: ${comparisonThought}

위 내용을 바탕으로 초등 4학년 학생에게 전할 3가지 피드백을 작성해주세요:
1. 칭찬 한마디 (학생의 관찰력과 공감 능력 칭찬)
2. 현실 세계와의 연결점에 대한 감상 및 추가 질문 (생각을 넓혀주는 가이드)
3. 따뜻한 성장의 응원 메시지

답변은 다정하고 권장하는 어조로 200자 내외로 작성해 주세요.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "당신은 초등학교 4학년 국어 지도 전문 선생님입니다. 따뜻하고 격려 가득한 피드백을 제공하세요.",
        },
      });

      res.json({ feedback: response.text });
    } catch (error: any) {
      console.error("AI Feedback Error:", error);
      res.status(500).json({ error: "피드백 생성 중 오류가 발생했습니다." });
    }
  });

  // AI Recipe Card Feedback (나만의 다정한 죽 레시피 카드 피드백)
  app.post("/api/ai/recipe-feedback", async (req, res) => {
    try {
      const { recipeName, porridgeType, ingredients, recipient, message } = req.body;

      const prompt = `
초등학교 4학년 학생이 만든 '나만의 다정한 죽(따뜻한 마음 나누기)' 마음 레시피 카드입니다:
- 죽 이름: ${recipeName}
- 죽 종류: ${porridgeType}
- 마음 재료: ${ingredients.join(", ")}
- 받는 사람: ${recipient}
- 전하는 메시지: ${message}

학생이 정성껏 만든 이 카드에 대해 '죽집 할머니'가 정겹고 훈훈하게 전해주는 축복과 격려 편지를 3문장 정도로 작성해 주세요.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ feedback: response.text });
    } catch (error: any) {
      console.error("AI Recipe Feedback Error:", error);
      res.status(500).json({ error: "레시피 피드백 생성 실패" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
