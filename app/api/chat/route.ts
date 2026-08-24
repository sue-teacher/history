import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { systemPrompt, messages } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Vercel 환경 변수에 GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: systemPrompt,
    });

    // 이전 대화 기록을 Gemini API 포맷으로 변환
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);

    return NextResponse.json({ text: result.response.text() });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "AI 역사 인물과의 대화 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}