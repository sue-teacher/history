"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 파이썬 코드의 historical data 100% 이식
const TOPIC_DATA: Record<string, any> = {
  "프랑스 혁명": {
    title: "1789년 프랑스 삼신분회 표결 및 과세 논쟁",
    learning_material: `👑 **프랑스 혁명이란?**
당시 프랑스에는 3개의 신분이 있었어요. 1신분(성직자)과 2신분(귀족)은 세금을 한 푼도 내지 않고 화려하게 살았지만, 인구의 98%를 차지하는 3신분(평민)은 뼈 빠지게 일하며 무거운 세금에 시달렸죠.

💰 **오늘 우리가 토론할 사건의 발단:**
왕(루이 16세)이 나라에 돈이 부족해지자 세금을 더 걷으려고 세 신분의 대표를 모은 **'삼신분회'**를 열었어요. 하지만 투표 방식을 두고 팽팽하게 싸우게 됩니다.
* **귀족의 주장:** 신분당 1표씩만 행사하자! (귀족과 성직자가 편을 먹으면 무조건 2:1로 이기니까요)
* **평민의 주장:** 사람 머릿수대로 1표씩 행사하자! (평민 대표 수가 가장 많았거든요)`,
    roles: {
      "제3신분 (부르주아/시민 대표)": {
        opponent: "제2신분 귀족 대표 (레온 백작)",
        system_prompt: "당신은 1789년 프랑스 삼신분회에 참석한 제2신분 귀족 대표 '레온 백작'입니다. 중학생 수준에 맞춰 너무 어렵지 않게 대답해주세요. 귀족의 오랜 면세 특권과 전통적인 신분별 표결(1신분 1표)의 정당성을 강력히 옹호하세요. 제3신분의 머릿수 표결 요구를 질서 파괴이자 왕권 및 신분제에 대한 도전으로 간주하여 권위 있게 반박하세요. 18세기 프랑스 귀족의 품격과 단호한 어조를 유지하며, 한 번에 2~3문장으로 짧고 명확하게 답변하세요.",
        initial_msg: "어찌 감히 제3신분이 수백 년간 이어져 온 삼신분회의 전통적인 투표 방식을 무너뜨리려 하시오? 신분별로 1표씩 던지는 것이야말로 이 나라의 질서를 유지하는 정당한 방법이오!",
        guides: [
          "💡 제3신분이 인구의 98%나 되는데 신분당 1표는 너무 불공평하다고 따져보세요.",
          "💡 귀족들도 이제는 똑같이 세금을 내야 한다고 당당하게 요구하세요.",
          "💡 굶주리고 있는 평민들의 힘든 현실을 말하며 반박해보세요."
        ]
      },
      "제1·2신분 (성직자/귀족 대표)": {
        opponent: "제3신분 평민 대표 (자크 변호사)",
        system_prompt: "당신은 1789년 프랑스 삼신분회에 참석한 제3신분 평민 대표 '자크 변호사'입니다. 중학생 수준에 맞춰 너무 어렵지 않게 대답해주세요. 구제도의 불평등과 귀족들의 면세 특권을 비판하세요. 인구의 98%를 차지하는 제3신분의 정당성을 바탕으로 '머릿수 표결(1인 1표)'의 당위성을 열정적으로 주장하세요. 평민들을 대변하는 정의롭고 정열적인 어조로, 한 번에 2~3문장으로 짧고 명확하게 답변하세요.",
        initial_msg: "귀족 대표님! 나라 세금의 대부분을 평민들이 내고 있는데, 우리에게 아무런 권리가 없다는 게 말이 됩니까? 이제는 사람 머릿수대로 투표해서 진짜 국민의 뜻을 들어야 합니다!",
        guides: [
          "💡 귀족들은 나라를 지키고 왕을 모시는 중요한 의무를 다하고 있다고 반박해보세요.",
          "💡 오랜 시간 이어져 온 신분제와 질서가 무너지면 나라가 혼란스러워질 것이라고 경고하세요.",
          "💡 신분별 투표가 각 계급의 의견을 공평하게 모으는 방법이라고 우겨보세요."
        ]
      }
    }
  },
  "미국 독립 혁명": {
    title: "1770년대 미국 조세 논쟁: 대표 없는 곳에 세금 없다!",
    learning_material: `🚢 **미국 독립 혁명이란?**
지금의 거대한 미국은 원래 영국의 지배를 받는 '식민지'였어요. 영국이 다른 나라(프랑스)와 전쟁을 하느라 빚을 많이 지게 되자, 미국 식민지 사람들에게 종이(인지세), 설탕, 차(Tea) 등에 온갖 새로운 세금을 매기기 시작했어요.

😡 **오늘 우리가 토론할 사건의 발단:**
미국 사람들은 분노했습니다. '우리가 뽑은 대표가 영국 의회에 단 한 명도 없는데, 영국 마음대로 우리한테 세금을 매길 수는 없다!'라고 외쳤죠. 이것이 그 유명한 **'대표 없는 곳에 세금 없다'**는 원칙입니다. 급기야 영국 배에 실린 홍차 상자들을 바다에 다 던져버리는 '보스턴 차 사건'까지 벌어졌답니다.`,
    roles: {
      "식민지 대표 (미국 독립파)": {
        opponent: "영국 의회 의원 (노스 경)",
        system_prompt: "당신은 1770년대 영국의 재무장관 '노스 경(Lord North)'입니다. 중학생 수준에 맞춰 너무 어렵지 않게 대답해주세요. 영국이 미국 식민지를 지켜주기 위해 전쟁을 했으니, 방위비를 세금으로 내는 것은 당연하다고 옹호하세요. 보스턴 차 사건 등 식민지의 반발을 은혜도 모르는 폭동이자 법질서 위반으로 비판하세요. 영국 의원의 단정하고 격식 있는 어조로, 한 번에 2~3문장으로 짧고 명확하게 답변하세요.",
        initial_msg: "미국 식민지 주민 여러분, 영국 군대가 싸워준 덕분에 당신들이 안전할 수 있었음을 잊었소? 영국 제국의 백성으로서 보호받은 만큼 세금을 내는 것은 당연한 의무요!",
        guides: [
          "💡 영국 의회에 미국인의 대표가 없으므로 세금을 낼 수 없다고 당당하게 말해보세요.",
          "💡 영국이 미국을 지켜준 게 아니라, 영국 자신의 욕심 때문에 전쟁을 한 것이라고 반박하세요.",
          "💡 억지로 세금을 걷으려 한다면 우리도 가만히 있지 않겠다고 경고해보세요."
        ]
      },
      "영국 충성파 (영국 제국파)": {
        opponent: "식민지 애국파 리더 (새뮤얼 애덤스)",
        system_prompt: "당신은 1770년대 보스턴의 식민지 애국파 리더 '새뮤얼 애덤스(Samuel Adams)'입니다. 중학생 수준에 맞춰 너무 어렵지 않게 대답해주세요. 영국 의회의 부당한 일방적 세금 부과를 폭정으로 규탄하세요. '대표 없는 곳에 세금 없다'는 원칙을 내세우며 식민지 주민의 자유와 권리를 강력히 피력하세요. 뜨겁고 설득력 있는 애국파 리더의 어조로, 한 번에 2~3문장으로 짧고 명확하게 답변하세요.",
        initial_msg: "우리의 동의도 받지 않고 마음대로 세금을 걷는 것은 도둑질이나 다름없소! 영국 의회에 우리의 대표가 없는데 어찌 우리에게 세금을 내라 강요한단 말이오?",
        guides: [
          "💡 영국 제국의 법과 질서를 지키는 것이 식민지에도 이득이 된다고 설득해보세요.",
          "💡 영국이라는 든든한 나라가 없다면 미국 식민지는 다른 나라의 공격을 받을 것이라고 경고하세요.",
          "💡 폭력을 쓰며 차를 바다에 던진 사건(보스턴 차 사건)은 용납할 수 없는 범죄라고 비판하세요."
        ]
      }
    }
  }
};

export default function HistoryDebateApp() {
  const [studentId, setStudentId] = useState("2101");
  const [studentName, setStudentName] = useState("홍길동");
  const [topicKey, setTopicKey] = useState("프랑스 혁명");
  const [roleKey, setRoleKey] = useState(Object.keys(TOPIC_DATA["프랑스 혁명"].roles)[0]);
  
  const currentTopic = TOPIC_DATA[topicKey];
  const currentRole = currentTopic.roles[roleKey] || Object.values(currentTopic.roles)[0];

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: currentRole.initial_msg }
  ]);
  const [input, setInput] = useState("");
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopicChange = (newTopic: string) => {
    setTopicKey(newTopic);
    const defaultRole = Object.keys(TOPIC_DATA[newTopic].roles)[0];
    setRoleKey(defaultRole);
    setMessages([{ role: "assistant", content: TOPIC_DATA[newTopic].roles[defaultRole].initial_msg }]);
  };

  const handleRoleChange = (newRole: string) => {
    setRoleKey(newRole);
    setMessages([{ role: "assistant", content: currentTopic.roles[newRole].initial_msg }]);
  };

  const resetChat = () => {
    setMessages([{ role: "assistant", content: currentRole.initial_msg }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (!studentId.trim() || !studentName.trim()) {
      alert("학번과 이름을 먼저 입력해 주세요!");
      return;
    }

    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: currentRole.system_prompt,
          messages: newMsgs,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setMessages([...newMsgs, { role: "assistant", content: data.text }]);
      } else {
        setMessages([...newMsgs, { role: "assistant", content: data.error || "오류가 발생했습니다." }]);
      }
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "AI 서버 연결에 실패했습니다." }]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const targetElement = document.getElementById("pdf-report-area");
    if (!targetElement) return;

    const canvas = await html2canvas(targetElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${studentId.trim()}_${studentName.trim()}_${topicKey}_모의토론보고서.pdf`);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      {/* 왼쪽 사이드바 (탐구 설정) */}
      <div className="w-80 bg-white border-r p-6 flex flex-col gap-5 overflow-y-auto shadow-sm">
        <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
          ⚙️ 탐구 설정 및 인적사항
        </h2>
        
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">학번 (4자리)</label>
          <input
            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="예: 2101"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">이름</label>
          <input
            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="예: 홍길동"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">탐구 주제 선택</label>
          <select
            className="w-full border p-2 rounded text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            value={topicKey}
            onChange={(e) => handleTopicChange(e.target.value)}
          >
            {Object.keys(TOPIC_DATA).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">학생 역할 선택</label>
          <select
            className="w-full border p-2 rounded text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            value={roleKey}
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            {Object.keys(currentTopic.roles).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <button
          onClick={resetChat}
          className="mt-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded text-sm font-semibold transition"
        >
          🔄 토론 다시 시작하기
        </button>
      </div>

      {/* 오른쪽 메인 콘텐츠 */}
      <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950 mb-1">📜 표선 역사 모의토론 탐구실</h1>
          <p className="text-sm text-slate-600">
            📍 <b>{currentTopic.title}</b> | 나의 역할: <span className="text-blue-700 font-bold">{roleKey}</span> vs AI 역할: <span className="text-red-700 font-bold">{currentRole.opponent}</span>
          </p>
        </div>

        {/* 1단계: 사전 학습 */}
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">📚 1단계: 역사 배경지식 쏙쏙 이해하기</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">{currentTopic.learning_material}</p>
        </div>

        {/* 2단계: 모의 토론 */}
        <div className="bg-white border rounded-xl p-5 flex flex-col gap-4 shadow-sm">
          <h3 className="font-bold text-blue-900">💬 2단계: 역사 인물과 모의토론 하기</h3>
          
          {/* 발언 힌트 */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900">
            <span className="font-bold block mb-1">💡 어떻게 말해야 할지 모르겠다면? (발언 힌트)</span>
            <ul className="list-disc pl-4 space-y-1">
              {currentRole.guides.map((g: string, idx: number) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </div>

          {/* 대화 창 */}
          <div className="border rounded-lg p-4 h-96 overflow-y-auto flex flex-col gap-3 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] text-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white self-end rounded-tr-none"
                    : "bg-white border text-slate-800 self-start rounded-tl-none shadow-sm"
                }`}
              >
                <div className="text-[11px] opacity-75 font-semibold mb-1">
                  {m.role === "user" ? `👤 ${studentName} (${roleKey.split("(")[0].trim()})` : `🤖 ${currentRole.opponent}`}
                </div>
                <div className="whitespace-pre-line leading-relaxed">{m.content}</div>
              </div>
            ))}
          </div>

          {/* 입력창 */}
          <div className="flex gap-2">
            <input
              className="flex-1 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="역사적 근거를 바탕으로 나의 주장을 입력하세요..."
            />
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-bold text-sm transition"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "생성 중..." : "전송"}
            </button>
          </div>
        </div>

        {/* 3단계: 탐구 성찰 & PDF 생성 영역 */}
        <div id="pdf-report-area" className="bg-white p-6 border rounded-xl flex flex-col gap-4 shadow-sm">
          <h3 className="font-bold text-blue-900 text-lg">📝 3단계: 탐구 보고서 제출 및 PDF 다운로드</h3>
          
          <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg flex justify-between">
            <span><b>학번:</b> {studentId} | <b>이름:</b> {studentName}</span>
            <span><b>주제:</b> {topicKey} ({roleKey})</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              토론 후 새롭게 알게 된 점이나 느낀 점을 자유롭게 적어보세요 (보고서에 기록됩니다):
            </label>
            <textarea
              className="w-full border p-3 rounded-lg text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="예: 귀족들이 세금을 안 내려고 우기는 걸 보니 평민들이 왜 화가 났는지 이해가 쏙쏙 되었다!"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>

          <button
            onClick={downloadPDF}
            className="bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
          >
            📄 뚝딱! PDF 보고서 다운로드 받기
          </button>
        </div>
      </div>
    </div>
  );
}