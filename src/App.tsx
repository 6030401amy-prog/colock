import { useState, useEffect, useRef } from "react";
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  MousePointer2,
  Pencil,
  Minus,
  Eraser,
  Trash2,
  Languages,
  Printer,
  Volume2 // 匯入喇叭圖示
} from "lucide-react";

// --- 雙語翻譯字典 ---
const T: any = {
  zh: {
    title: "互動時鐘練習",
    explore: "自由探索",
    step: "逐步學習",
    practice: "挑戰模式",
    history: "練習紀錄",
    printTab: "列印表單",
    digiClock: "數字時鐘",
    hide: "隱藏",
    show: "顯示",
    hiddenState: "數字時鐘已隱藏",
    hiddenHint: "點擊上方的「顯示」來操作數字面版",
    am: "上午",
    pm: "下午",
    ptr1: "指針",
    ptr2: "設定",
    link: "連 動",
    trail: "軌 跡",
    hourHand: "時 針",
    minHand: "分 針",
    secHand: "秒 針",
    scale1: "刻度",
    scale2: "效果",
    ticks: "刻 度",
    numbers: "數 字",
    colors: "鋪 色",
    extend: "延伸指針",
    by5: "5個一數",
    all: "全部顯示",
    draw1: "畫筆",
    draw2: "工具",
    mouse: "滑鼠",
    pen: "畫筆",
    line: "直線",
    erase: "部分刪除",
    clearAll: "全部刪除",
    hintMouse: "💡 提示：按住並旋轉鐘面來撥動時間！",
    hintDraw: "💡 提示：您現在可以直接在鐘面上畫畫喔！",
    backToNow: "回到現在時間",
    setTo: "請將時鐘轉到：",
    check: "對答案",
    next: "換一題",
    step1: "1. 認識整點",
    step2: "2. 認識半點",
    step3: "3. 幾點幾分",
    correct: "太棒了！答對囉！",
    wrong: "哎呀，再看仔細一點喔！",
    langBtn: "English",
    stepTitle: "漸進式練習",
    unitTitle: "挑戰單元",
    unit1: "整點",
    unit2: "半點",
    unit3: "幾點幾分",
    minBy5: "5分一數",
    minMixed: "混和練習",
    unit3_5: "幾點幾分 (5分一數)",
    unit3_mixed: "幾點幾分 (混和練習)",
    noRecord: "目前還沒有紀錄喔！趕快去挑戰看看吧！",
    clearRecord: "清除全部紀錄",
    correctRecord: "答對",
    wrongRecord: "答錯",
    printTitle: "時鐘練習學習單",
    studentClass: "班級",
    studentName: "姓名",
    studentScore: "分數",
    selectUnitsMsg: "請選擇要列印的單元 (可多選)：",
    questionCount: "列印題數：",
    generatePrint: "產生並列印",
    q6: "6 題",
    q9: "9 題",
    q12: "12 題",
    alertNoUnit: "請至少選擇一個單元！",
    correctAns: "正確：",
    readClock: "聽指針時間",
  },
  en: {
    title: "Interactive Clock",
    explore: "Explore",
    step: "Step-by-Step",
    practice: "Challenge",
    history: "Records",
    printTab: "Print Worksheet",
    digiClock: "Digital Clock",
    hide: "Hide",
    show: "Show",
    hiddenState: "Clock Hidden",
    hiddenHint: "Click 'Show' to use the digital panel",
    am: "AM",
    pm: "PM",
    ptr1: "Hands",
    ptr2: "Setup",
    link: "Linked",
    trail: "Trail",
    hourHand: "Hour",
    minHand: "Minute",
    secHand: "Second",
    scale1: "Scale",
    scale2: "Effects",
    ticks: "Ticks",
    numbers: "Numbers",
    colors: "Colors",
    extend: "Extend",
    by5: "By 5s",
    all: "All",
    draw1: "Draw",
    draw2: "Tools",
    mouse: "Mouse",
    pen: "Pen",
    line: "Line",
    erase: "Erase",
    clearAll: "Clear All",
    hintMouse: "💡 Hint: Drag to rotate the clock hands!",
    hintDraw: "💡 Hint: You can draw on the clock now!",
    backToNow: "Current Time",
    setTo: "Please set the clock to:",
    check: "Check Answer",
    next: "Next Question",
    step1: "1. Learn O'clock",
    step2: "2. Learn Half Past",
    step3: "3. Learn Minutes",
    correct: "Great job!",
    wrong: "Oops! Try again.",
    langBtn: "中文",
    stepTitle: "Step-by-step Practice",
    unitTitle: "Challenge Unit",
    unit1: "O'clock",
    unit2: "Half Past",
    unit3: "Minutes",
    minBy5: "5-Min Intervals",
    minMixed: "Mixed Minutes",
    unit3_5: "Minutes (By 5s)",
    unit3_mixed: "Minutes (Mixed)",
    noRecord: "No records yet! Go challenge yourself!",
    clearRecord: "Clear All Records",
    correctRecord: "Correct",
    wrongRecord: "Wrong",
    printTitle: "Clock Practice Worksheet",
    studentClass: "Class",
    studentName: "Name",
    studentScore: "Score",
    selectUnitsMsg: "Select units to print (multiple allowed):",
    questionCount: "Number of questions:",
    generatePrint: "Generate & Print",
    q6: "6 Questions",
    q9: "9 Questions",
    q12: "12 Questions",
    alertNoUnit: "Please select at least one unit!",
    correctAns: "Correct: ",
    readClock: "Read Hands",
  },
};

export default function App() {
  const [totalMinutes, setTotalMinutes] = useState<number>(10 * 60 + 10);
  const [mode, setMode] = useState<string>("explore");
  const [targetMinutes, setTargetMinutes] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDigitalClock, setShowDigitalClock] = useState<boolean>(true);

  const [records, setRecords] = useState<any[]>([]);

  const [lang, setLang] = useState<string>("zh");
  const [stepLevel, setStepLevel] = useState<string>("oclock");
  const [practiceLevel, setPracticeLevel] = useState<string>("oclock");

  const [stepMinMode, setStepMinMode] = useState<string>("by5");
  const [pracMinMode, setPracMinMode] = useState<string>("by5");

  const [printUnits, setPrintUnits] = useState<string[]>(["oclock"]);
  const [printCount, setPrintCount] = useState<number>(12);

  const [settings, setSettings] = useState({
    linked: true,
    trail: false,
    showHour: true,
    showMinute: true,
    showSecond: false,
  });
  const [seconds, setSeconds] = useState<number>(0);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [trailStartAngle, setTrailStartAngle] = useState<number | null>(null);
  const [trailCurrentAngle, setTrailCurrentAngle] = useState<number | null>(null);
  const [trailAccumulated, setTrailAccumulated] = useState<number>(0);

  const [scaleSettings, setScaleSettings] = useState({
    showTicks: true,
    showMinuteNumbers: false,
    minuteNumbersMode: "by5",
    showColorFill: false,
    extendHands: false,
  });

  const [drawMode, setDrawMode] = useState<string>("mouse");
  const [drawColor, setDrawColor] = useState<string>("#ef4444");
  const [drawings, setDrawings] = useState<any[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<any>(null);
  const drawColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#0ea5e9",
    "#a855f7",
  ];

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!document.getElementById("tailwind-cdn") && typeof document !== "undefined") {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
    const now = new Date();
    setTotalMinutes(now.getHours() * 60 + now.getMinutes());
    setSeconds(now.getSeconds());
  }, []);

  useEffect(() => {
    if (mode === "practice") {
      generatePracticeQuestion();
      if (practiceLevel === "minute") {
        setScaleSettings((s) => ({
          ...s,
          showMinuteNumbers: true,
          minuteNumbersMode: "all",
          extendHands: true,
        }));
      }
    } else if (mode === "step") {
      generateStepQuestion(stepLevel);
      if (stepLevel === "minute") {
        setScaleSettings((s) => ({
          ...s,
          showMinuteNumbers: true,
          minuteNumbersMode: "all",
          extendHands: true,
        }));
      }
    }
  }, [mode, stepLevel, practiceLevel, stepMinMode, pracMinMode]);

  const getDigitalTime = (mins: number | null, currentLang: string) => {
    if (mins === null) return { ampm: "", time: "" };
    const validMins = ((mins % 1440) + 1440) % 1440;
    const h = Math.floor(validMins / 60);
    const m = validMins % 60;
    const ampm = h < 12 ? T[currentLang].am : T[currentLang].pm;
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m.toString().padStart(2, "0");
    return {
      ampm,
      time: `${displayH.toString().padStart(2, "0")}:${displayM}`,
    };
  };

  const isDay = totalMinutes % 1440 >= 360 && totalMinutes % 1440 < 1080;
  const h24 = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const displayH = h24 % 12 === 0 ? 12 : h24 % 12;
  const mTens = Math.floor(m / 10);
  const mOnes = m % 10;

  const adjustTime = (amount: number) => {
    setTotalMinutes((prev) => (((prev + amount) % 1440) + 1440) % 1440);
    if (mode === "practice" || mode === "step") setFeedback(null);
  };

  const generatePracticeQuestion = () => {
    const h = Math.floor(Math.random() * 24);
    let randomM = 0;
    if (practiceLevel === "half") {
      randomM = 30;
    } else if (practiceLevel === "minute") {
      if (pracMinMode === "by5") {
        const options = [5, 10, 15, 20, 25, 35, 40, 45, 50, 55];
        randomM = options[Math.floor(Math.random() * options.length)];
      } else {
        do {
          randomM = Math.floor(Math.random() * 60);
        } while (randomM === 0 || randomM === 30);
      }
    }
    setTargetMinutes(h * 60 + randomM);
    setFeedback(null);
  };

  const generateStepQuestion = (level: string) => {
    const h = Math.floor(Math.random() * 12);
    let randomM = 0;
    if (level === "half") {
      randomM = 30;
    } else if (level === "minute") {
      if (stepMinMode === "by5") {
        const options = [5, 10, 15, 20, 25, 35, 40, 45, 50, 55];
        randomM = options[Math.floor(Math.random() * options.length)];
      } else {
        do {
          randomM = Math.floor(Math.random() * 60);
        } while (randomM === 0 || randomM === 30);
      }
    }
    setTargetMinutes(h * 60 + randomM);
    setFeedback(null);
  };

  const checkAnswer = () => {
    const current12h = totalMinutes % 720;
    const target12h = (targetMinutes || 0) % 720;
    const isCorrect = current12h === target12h;
    setFeedback(isCorrect);

    setRecords((prev) => [
      {
        id: Date.now(),
        mode: mode,
        level: mode === "step" ? stepLevel : practiceLevel,
        subLevel: mode === "step" ? stepMinMode : pracMinMode,
        targetMins: targetMinutes,
        userMins: totalMinutes,
        isCorrect: isCorrect,
      },
      ...prev,
    ]);
  };

  const setToCurrentTime = () => {
    const now = new Date();
    setTotalMinutes(now.getHours() * 60 + now.getMinutes());
    setSeconds(now.getSeconds());
  };

  // --- 語音報時邏輯 ---
  const speakTime = (timeInMinutes: number = totalMinutes) => {
    if (!('speechSynthesis' in window)) {
      alert("您的瀏覽器不支援語音功能喔！");
      return;
    }

    window.speechSynthesis.cancel();

    const validMins = ((timeInMinutes % 1440) + 1440) % 1440;
    const h = Math.floor(validMins / 60);
    const m = validMins % 60;
    const displayH = h % 12 === 0 ? 12 : h % 12;

    let textToSpeak = "";

    if (lang === "zh") {
      const hText = displayH === 2 ? "二" : displayH.toString();
      let mText = "";
      if (m === 0) {
        textToSpeak = `${hText}時`;
      } else {
        mText = m.toString();
        textToSpeak = `${hText}時${mText}分`;
      }
    } else {
      let mText = "";
      if (m === 0) {
        mText = "o'clock";
      } else if (m < 10) {
        mText = `oh ${m}`;
      } else {
        mText = m.toString();
      }
      textToSpeak = `${displayH} ${mText}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (lang === "zh") {
      utterance.lang = "zh-TW";
      utterance.rate = 0.85;
    } else {
      utterance.lang = "en-US";
      utterance.rate = 0.85;
    }
    window.speechSynthesis.speak(utterance);
  };

  const togglePrintUnit = (unit: string) => {
    setPrintUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );
  };

  const generatePrintClockSVG = (h: number, m: number, unit: string) => {
    const totalMins = h * 60 + m;
    const hAngle = ((totalMins / 60) % 12) * 30;
    const mAngle = m * 6;
    let ticks = "";
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 * Math.PI) / 180;
      const isHour = i % 5 === 0;
      const r1 = isHour ? 84 : 92;
      const x1 = 100 + r1 * Math.sin(angle);
      const y1 = 100 - r1 * Math.cos(angle);
      const x2 = 100 + 98 * Math.sin(angle);
      const y2 = 100 - 98 * Math.cos(angle);
      ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${
        isHour ? "#000" : "#777"
      }" stroke-width="${isHour ? 3 : 1}" />`;
    }

    let numbers = "";
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const x = 100 + 66 * Math.sin(angle);
      const y = 100 - 66 * Math.cos(angle);
      numbers += `<text x="${x}" y="${
        y + 6
      }" font-size="20" font-weight="bold" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle" fill="#000">${i}</text>`;
    }

    let minuteHints = "";
    if (unit === "minute_by5") {
      for (let i = 0; i < 60; i += 5) {
        const angle = (i * 6 * Math.PI) / 180;
        const x = 100 + 112 * Math.sin(angle);
        const y = 100 - 112 * Math.cos(angle);
        minuteHints += `<text x="${x}" y="${
          y + 3
        }" font-size="12" font-weight="bold" fill="#333" text-anchor="middle" dominant-baseline="middle">${i}</text>`;
      }
    } else if (unit === "minute_mixed") {
      for (let i = 0; i < 60; i++) {
        const angle = (i * 6 * Math.PI) / 180;
        const isFive = i % 5 === 0;
        const rText = isFive ? 114 : 110;
        const x = 100 + rText * Math.sin(angle);
        const y = 100 - rText * Math.cos(angle);

        const fontSize = isFive ? 12 : 7.5;
        const fontWeight = isFive ? "bold" : "normal";
        const fill = isFive ? "#111" : "#666";

        minuteHints += `<text x="${x}" y="${
          y + (isFive ? 3 : 2)
        }" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" text-anchor="middle" dominant-baseline="middle">${i}</text>`;
      }
    }

    const viewBox =
      unit === "minute_by5" || unit === "minute_mixed"
        ? "-25 -25 250 250"
        : "0 0 200 200";

    return `
      <svg viewBox="${viewBox}" width="100%" height="100%" style="overflow: visible;">
        <circle cx="100" cy="100" r="98" fill="none" stroke="#000" stroke-width="3" />
        ${ticks}
        ${numbers}
        ${minuteHints}
        <line x1="100" y1="100" x2="100" y2="55" stroke="#ef4444" stroke-width="6" stroke-linecap="round" transform="rotate(${hAngle} 100 100)" />
        <line x1="100" y1="100" x2="100" y2="25" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" transform="rotate(${mAngle} 100 100)" />
        <circle cx="100" cy="100" r="6" fill="#000" />
      </svg>
    `;
  };

  const handlePrint = () => {
    if (printUnits.length === 0) {
      alert(T[lang].alertNoUnit);
      return;
    }
    const questions = [];
    for (let i = 0; i < printCount; i++) {
      const unit = printUnits[Math.floor(Math.random() * printUnits.length)];
      const h = Math.floor(Math.random() * 12);
      let m = 0;
      if (unit === "half") {
        m = 30;
      } else if (unit === "minute_by5") {
        const options = [5, 10, 15, 20, 25, 35, 40, 45, 50, 55];
        m = options[Math.floor(Math.random() * options.length)];
      } else if (unit === "minute_mixed") {
        do {
          m = Math.floor(Math.random() * 60);
        } while (m === 0 || m === 30);
      }
      questions.push({ h: h === 0 ? 12 : h, m: m, unit: unit });
    }

    const win = window.open("", "_blank");
    if (!win) return alert("請允許彈出視窗進行列印喔！");

    const html = `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
          <meta charset="UTF-8">
          <title>${T[lang].printTitle}</title>
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 15px; color: #111; margin: 0; }
              .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 10px; }
              .header h1 { margin: 0 0 15px 0; font-size: 28px; }
              .info { display: flex; justify-content: space-around; max-width: 800px; margin: 0 auto 30px auto; font-size: 18px; font-weight: bold; }
              .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px 10px; max-width: 100%; margin: 0 auto; }
              .item { display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px; page-break-inside: avoid; }
              .clock { width: 220px; height: 220px; margin: 0 auto 10px auto; }
              
              /* 修正填答區塊的對齊與樣式 */
              .answer-box { 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  margin-top: 15px; 
              }
              .line { 
                  display: inline-block; 
                  width: 55px; 
                  height: 3px;          /* 增加線條粗度 */
                  background-color: #000; /* 改用實心背景色當作線條，比較容易對齊 */
                  margin: 0 8px; 
              }
              .colon { 
                  font-size: 32px;      /* 放大冒號 */
                  font-weight: bold; 
                  line-height: 1;       /* 確保不會因為行高偏移 */
                  padding-bottom: 4px;  /* 微調垂直位置，讓它視覺上在底線中間 */
              }
              
              @media print {
                  body { 
                      padding: 0; 
                      -webkit-print-color-adjust: exact; 
                      print-color-adjust: exact; 
                  }
                  @page { margin: 1.5cm; }
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>${T[lang].printTitle}</h1>
              <div class="info">
                  <div>${T[lang].studentClass} : ______________</div>
                  <div>${T[lang].studentName} : ______________</div>
                  <div>${T[lang].studentScore} : ______________</div>
              </div>
          </div>
          <div class="grid">
              ${questions
                .map(
                  (q, index) => `
                  <div class="item">
                      <div style="font-weight: bold; margin-bottom: 15px; align-self: flex-start; margin-left: 20px;">(${
                        index + 1
                      })</div>
                      <div class="clock">
                          ${generatePrintClockSVG(q.h, q.m, q.unit)}
                      </div>
                      <div class="answer-box">
                          <span class="line"></span><span class="colon">:</span><span class="line"></span>
                      </div>
                  </div>
              `
                )
                .join("")}
          </div>
          <script>
              window.onload = function() { setTimeout(window.print, 500); }
          </script>
      </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  };

  const dist2 = (v: any, w: any) =>
    Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
  const distToSegment = (p: any, v: any, w: any) => {
    const l2 = dist2(v, w);
    if (l2 === 0) return Math.sqrt(dist2(p, v));
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt(
      dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) })
    );
  };

  const eraseAt = (x: number, y: number) => {
    setDrawings((prev) =>
      prev.filter((d) => {
        if (d.type === "pencil") {
          for (let i = 0; i < d.points.length - 1; i++) {
            if (distToSegment({ x, y }, d.points[i], d.points[i + 1]) < 15)
              return false;
          }
          if (
            d.points.length === 1 &&
            Math.hypot(d.points[0].x - x, d.points[0].y - y) < 15
          )
            return false;
          return true;
        }
        if (d.type === "line") {
          return distToSegment({ x, y }, d.start, d.end) >= 15;
        }
        return true;
      })
    );
  };

  const handlePointerDown = (e: any) => {
    e.target.setPointerCapture(e.pointerId);
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (clientX == null || clientY == null) return;

    const svgScale = 360 / svgRect.width;
    const drawX = (clientX - svgRect.left) * svgScale;
    const drawY = (clientY - svgRect.top) * svgScale;

    if (drawMode !== "mouse") {
      setIsDragging(true);
      if (drawMode === "pencil") {
        setCurrentDrawing({
          id: Date.now(),
          type: "pencil",
          color: drawColor,
          points: [{ x: drawX, y: drawY }],
        });
      } else if (drawMode === "line") {
        setCurrentDrawing({
          id: Date.now(),
          type: "line",
          color: drawColor,
          start: { x: drawX, y: drawY },
          end: { x: drawX, y: drawY },
        });
      } else if (drawMode === "eraser") {
        eraseAt(drawX, drawY);
      }
      return;
    }

    setIsDragging(true);
    const svgX = drawX - 180;
    const svgY = drawY - 180;
    const distance = Math.sqrt(svgX * svgX + svgY * svgY);

    const hourAngleDeg = settings.linked ? ((totalMinutes / 60) % 12) * 30 : (Math.floor(totalMinutes / 60) % 12) * 30;
    const minuteAngleDeg = (totalMinutes % 60) * 6;
    const secondAngleDeg = seconds * 6;

    const hA = hourAngleDeg * Math.PI / 180;
    const wH = { x: 80 * Math.sin(hA), y: -80 * Math.cos(hA) };
    const distHour = distToSegment({x: svgX, y: svgY}, {x:0, y:0}, wH);

    const mA = minuteAngleDeg * Math.PI / 180;
    const wM = { x: 120 * Math.sin(mA), y: -120 * Math.cos(mA) };
    const distMinute = distToSegment({x: svgX, y: svgY}, {x:0, y:0}, wM);

    const sA = secondAngleDeg * Math.PI / 180;
    const wS = { x: 135 * Math.sin(sA), y: -135 * Math.cos(sA) };
    const distSecond = distToSegment({x: svgX, y: svgY}, {x:0, y:0}, wS);

    let target = 'minute'; 

    if (settings.showSecond && distSecond < 20 && distance > 100) {
        target = 'second';
    } else if (settings.showHour && settings.showMinute) {
        if (distHour < 30 && distMinute < 30) {
            target = distance <= 75 ? 'hour' : 'minute';
        } else if (distHour < 30) {
            target = 'hour';
        } else if (distMinute < 40) {
            target = 'minute';
        } else {
            target = distance > 70 ? 'minute' : 'hour';
        }
    } else if (settings.showHour) {
        target = 'hour';
    } else if (settings.showMinute) {
        target = 'minute';
    }

    setDragTarget(target);

    let angle = Math.atan2(svgY, svgX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    setTrailStartAngle(angle);
    setTrailCurrentAngle(angle);
    setTrailAccumulated(0);

    handlePointerMove(e, target, angle);
    if (mode === "practice" || mode === "step") setFeedback(null);
  };

  const handlePointerMove = (
    e: any,
    initialTarget: string | null = null,
    initialAngle: number | null = null
  ) => {
    if (!isDragging && initialTarget === null) return;
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (clientX == null || clientY == null) return;

    const svgScale = 360 / svgRect.width;
    const drawX = (clientX - svgRect.left) * svgScale;
    const drawY = (clientY - svgRect.top) * svgScale;

    if (drawMode !== "mouse") {
      if (drawMode === "pencil" && currentDrawing) {
        setCurrentDrawing((prev: any) => ({
          ...prev,
          points: [...prev.points, { x: drawX, y: drawY }],
        }));
      } else if (drawMode === "line" && currentDrawing) {
        setCurrentDrawing((prev: any) => ({
          ...prev,
          end: { x: drawX, y: drawY },
        }));
      } else if (drawMode === "eraser") {
        eraseAt(drawX, drawY);
      }
      return;
    }

    const target = initialTarget || dragTarget;
    const svgX = drawX - 180;
    const svgY = drawY - 180;
    const distance = Math.sqrt(svgX * svgX + svgY * svgY);

    if (distance < 25) return;

    let angle =
      initialAngle !== null
        ? initialAngle
        : Math.atan2(svgY, svgX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (trailCurrentAngle !== null) {
      let delta = angle - trailCurrentAngle;
      if (delta < -180) delta += 360;
      if (delta > 180) delta -= 360;
      setTrailAccumulated((prev) => prev + delta);
    }
    setTrailCurrentAngle(angle);

    if (target === "minute") {
      const newMinute = Math.round(angle / 6) % 60;
      const currentMinute = totalMinutes % 60;
      let diff = newMinute - currentMinute;

      if (diff < -30) diff += 60;
      else if (diff > 30) diff -= 60;

      if (diff !== 0) {
        if (settings.linked) {
          setTotalMinutes((prev) => (((prev + diff) % 1440) + 1440) % 1440);
        } else {
          setTotalMinutes((prev) => {
            const h = Math.floor(prev / 60);
            return h * 60 + newMinute;
          });
        }
      }
    } else if (target === "hour") {
      if (settings.linked) {
        const newTime12h = Math.round(angle * 2);
        const currentTime12h = totalMinutes % 720;
        let diff = newTime12h - currentTime12h;

        if (diff < -360) diff += 720;
        else if (diff > 360) diff -= 720;

        if (diff !== 0) {
          setTotalMinutes((prev) => (((prev + diff) % 1440) + 1440) % 1440);
        }
      } else {
        const newHour12 = Math.round(angle / 30) % 12;
        const currentHour12 = Math.floor(totalMinutes / 60) % 12;
        let diffH = newHour12 - currentHour12;

        if (diffH < -6) diffH += 12;
        else if (diffH > 6) diffH -= 12;

        if (diffH !== 0) {
          setTotalMinutes((prev) => {
            const next = prev + diffH * 60;
            return ((next % 1440) + 1440) % 1440;
          });
        }
      }
    } else if (target === "second") {
      const newSecond = Math.round(angle / 6) % 60;
      setSeconds(newSecond);
    }
  };

  const handlePointerUp = (e: any) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);

    if (drawMode !== "mouse") {
      if (currentDrawing) {
        setDrawings((prev) => [...prev, currentDrawing]);
        setCurrentDrawing(null);
      }
      return;
    }

    setDragTarget(null);
  };

  const CX = 180;
  const CY = 180;
  const hourAngle = settings.linked
    ? ((totalMinutes / 60) % 12) * 30
    : (Math.floor(totalMinutes / 60) % 12) * 30;
  const minuteAngle = (totalMinutes % 60) * 6;
  const secondAngle = seconds * 6;

  const renderColorFill = () => {
    if (!scaleSettings.showColorFill) return null;
    const sectors = [];
    const colors = [
      "#fecaca",
      "#fed7aa",
      "#fef08a",
      "#d9f99d",
      "#bbf7d0",
      "#a7f3d0",
      "#99f6e4",
      "#bae6fd",
      "#bfdbfe",
      "#ddd6fe",
      "#fbcfe8",
      "#fecdd3",
    ];
    for (let i = 0; i < 12; i++) {
      const startAngle = ((i * 30 - 90) * Math.PI) / 180;
      const endAngle = (((i + 1) * 30 - 90) * Math.PI) / 180;
      const r = 146;
      const x1 = CX + r * Math.cos(startAngle);
      const y1 = CY + r * Math.sin(startAngle);
      const x2 = CX + r * Math.cos(endAngle);
      const y2 = CY + r * Math.sin(endAngle);
      const pathData = `M ${CX} ${CY} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
      sectors.push(
        <path key={`sector-${i}`} d={pathData} fill={colors[i]} opacity="0.4" />
      );
    }
    return sectors;
  };

  const renderTrail = () => {
    if (!settings.trail || trailStartAngle === null || trailAccumulated === 0)
      return null;
    const startA = trailStartAngle - 90;
    const totalA = trailAccumulated;
    const endA = startA + totalA;
    const absTotal = Math.abs(totalA);
    const r = 142;
    if (absTotal >= 360) {
      return <circle cx={CX} cy={CY} r={r} fill="rgba(244, 194, 91, 0.3)" />;
    }
    const startR = (startA * Math.PI) / 180;
    const endR = (endA * Math.PI) / 180;
    const x1 = CX + r * Math.cos(startR);
    const y1 = CY + r * Math.sin(startR);
    const x2 = CX + r * Math.cos(endR);
    const y2 = CY + r * Math.sin(endR);
    const largeArcFlag = absTotal > 180 ? 1 : 0;
    const sweepFlag = totalA > 0 ? 1 : 0;
    const pathData = `M ${CX} ${CY} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2} Z`;
    return <path d={pathData} fill="rgba(244, 194, 91, 0.3)" />;
  };

  const renderTicks = () => {
    if (!scaleSettings.showTicks) return null;
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 * Math.PI) / 180;
      const isHour = i % 5 === 0;
      const r1 = isHour ? 118 : 130;
      const r2 = 142;
      const x1 = CX + r1 * Math.sin(angle);
      const y1 = CY - r1 * Math.cos(angle);
      const x2 = CX + r2 * Math.sin(angle);
      const y2 = CY - r2 * Math.cos(angle);
      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isHour ? "#1e293b" : "#94a3b8"}
          strokeWidth={isHour ? 4 : 2}
        />
      );
    }
    return ticks;
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const r = 90;
      const x = CX + r * Math.sin(angle);
      const y = CY - r * Math.cos(angle);
      numbers.push(
        <text
          key={i}
          x={x}
          y={y + 2}
          fontSize="34"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#1e293b"
        >
          {i}
        </text>
      );
    }
    return numbers;
  };

  const renderHints = () => {
    if (!scaleSettings.showMinuteNumbers) return null;
    const hints = [];
    const step = scaleSettings.minuteNumbersMode === "by5" ? 5 : 1;
    for (let i = 0; i < 60; i += step) {
      const angle = (i * 6 * Math.PI) / 180;
      const r = 166;
      const x = CX + r * Math.sin(angle);
      const y = CY - r * Math.cos(angle);
      const isFive = i % 5 === 0;
      hints.push(
        <text
          key={`hint-${i}`}
          x={x}
          y={y + 1}
          fontSize={isFive ? "16" : "13"}
          fontWeight={isFive ? "900" : "bold"}
          fill={isFive ? "#3b82f6" : "#94a3b8"}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {i}
        </text>
      );
    }
    return hints;
  };

  const renderDrawings = () => {
    const allDrawings = [...drawings];
    if (currentDrawing) allDrawings.push(currentDrawing);
    return allDrawings.map((d) => {
      if (d.type === "pencil" && d.points.length > 0) {
        const dPath =
          `M ${d.points[0].x} ${d.points[0].y} ` +
          d.points
            .slice(1)
            .map((p: any) => `L ${p.x} ${p.y}`)
            .join(" ");
        return (
          <path
            key={d.id}
            d={dPath}
            stroke={d.color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      }
      if (d.type === "line") {
        return (
          <line
            key={d.id}
            x1={d.start.x}
            y1={d.start.y}
            x2={d.end.x}
            y2={d.end.y}
            stroke={d.color}
            strokeWidth="6"
            strokeLinecap="round"
          />
        );
      }
      return null;
    });
  };

  const btnToolClass = (active: boolean) =>
    `flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-all active:scale-95 font-bold text-[0.7rem] sm:text-[0.8rem] ${
      active
        ? "bg-[#d97706] text-white shadow-inner"
        : "bg-[#fcd34d] text-[#78350f] hover:bg-[#fbbf24]"
    }`;

  const tabBtnClass = (active: boolean, colorClass: string) =>
    `flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg font-bold transition-all text-[0.8rem] sm:text-[0.9rem] whitespace-nowrap ${
      active
        ? `bg-white shadow-sm ${colorClass}`
        : "text-slate-500 hover:text-slate-700"
    }`;

  const renderTargetTimeBlocks = (minutes: number, colorClass: string) => {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const displayH = h24 % 12 === 0 ? 12 : h24 % 12;
    const mTens = Math.floor(m / 10);
    const mOnes = m % 10;
    const ampm = getDigitalTime(minutes, lang).ampm;

    return (
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-1 sm:mt-2 relative">
        <span className={`text-xl sm:text-2xl font-black ${colorClass}`}>
          {ampm}
        </span>
        {/* 時：紅色區塊 */}
        <div className="relative w-14 h-16 sm:w-[4.5rem] sm:h-20 shrink-0">
          <div className="absolute inset-0 bg-[#b3b3b3] rounded-[1rem] translate-x-[3px] translate-y-[3px]"></div>
          <div className="absolute inset-0 bg-[#fc6c65] rounded-[1rem] border-[3px] border-[#ffb2b2] flex items-center justify-center text-white text-[2rem] sm:text-[2.75rem] font-black tracking-tighter select-none">
            {displayH.toString().padStart(2, "0")}
          </div>
        </div>
        {/* 分：藍色區塊 */}
        <div className="relative w-[3.8rem] h-16 sm:w-[5.5rem] sm:h-20 shrink-0">
          <div className="absolute inset-0 bg-[#b3b3b3] rounded-[1rem] translate-x-[3px] translate-y-[3px]"></div>
          <div className="absolute inset-0 bg-[#4ea9f5] rounded-[1rem] border-[3px] border-[#a8d3f6] flex items-center justify-center text-white text-[2rem] sm:text-[2.75rem] font-black tracking-widest select-none">
            {mTens}
            {mOnes}
          </div>
          
          {/* 目標時間的語音按鈕，緊貼在藍色區塊右邊 */}
          <button 
            onClick={() => speakTime(minutes)}
            className={`absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-sm border active:scale-95 ${
              isDay 
                ? "bg-white text-blue-500 border-slate-200 hover:bg-slate-50" 
                : "bg-slate-700 text-blue-400 border-slate-600 hover:bg-slate-600"
            }`}
            title="語音提示"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 font-sans text-slate-800 overflow-x-hidden">
      <div className="flex items-center space-x-3 mb-3 sm:mb-4">
        <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
          <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide drop-shadow-sm">
          {T[lang].title}
        </h1>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
        {/* 左側：時鐘與互動區 */}
        <div
          className={`flex-1 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000 ${
            isDay ? "bg-sky-100" : "bg-slate-800"
          } border-b md:border-b-0 md:border-r border-slate-200`}
        >
          {/* 左上角：日月與語言切換 */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 sm:gap-4 z-10">
            {isDay ? (
              <Sun className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 animate-[spin_30s_linear_infinite]" />
            ) : (
              <Moon
                className="w-7 h-7 sm:w-8 sm:h-8 text-amber-200"
                fill="currentColor"
              />
            )}
            <button
              onClick={() => setLang((l) => (l === "zh" ? "en" : "zh"))}
              className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-sm border backdrop-blur-sm active:scale-95 ${
                isDay
                  ? "bg-white/60 text-slate-700 border-slate-200 hover:bg-white/90"
                  : "bg-slate-700/60 text-slate-200 border-slate-600 hover:bg-slate-600/90"
              }`}
            >
              <Languages className="w-3 h-3 sm:w-4 sm:h-4" />
              {T[lang].langBtn}
            </button>
          </div>

          {/* 右上角：鐘面即時語音播報（僅在非探索模式出現） */}
          {(mode === 'step' || mode === 'practice') && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center z-10 animate-in fade-in">
              <button 
                onClick={() => speakTime(totalMinutes)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md border backdrop-blur-sm active:scale-95 ${
                  isDay 
                    ? 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50' 
                    : 'bg-slate-700 text-blue-400 border-slate-500 hover:bg-slate-600'
                }`}
                title={T[lang].readClock}
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{T[lang].readClock}</span>
              </button>
            </div>
          )}

          <div className="relative w-full max-w-[420px] aspect-square select-none mt-8 sm:mt-4">
            <svg
              viewBox="0 0 360 360"
              className={`w-full h-full touch-none drop-shadow-xl ${
                drawMode === "mouse"
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-crosshair"
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              ref={svgRef}
            >
              <circle
                cx={CX}
                cy={CY}
                r="150"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              {renderColorFill()}
              {renderTicks()}
              {renderNumbers()}
              {renderHints()}

              <g className="drop-shadow-md">
                {renderTrail()}
                {scaleSettings.extendHands && settings.showHour && (
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX}
                    y2={CY - 160}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    transform={`rotate(${hourAngle} ${CX} ${CY})`}
                  />
                )}
                {scaleSettings.extendHands && settings.showMinute && (
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX}
                    y2={CY - 160}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    transform={`rotate(${minuteAngle} ${CX} ${CY})`}
                  />
                )}
                {settings.showHour && (
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX}
                    y2={CY - 80}
                    stroke="#ef4444"
                    strokeWidth="10"
                    strokeLinecap="round"
                    transform={`rotate(${hourAngle} ${CX} ${CY})`}
                  />
                )}
                {settings.showMinute && (
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX}
                    y2={CY - 120}
                    stroke="#3b82f6"
                    strokeWidth="6"
                    strokeLinecap="round"
                    transform={`rotate(${minuteAngle} ${CX} ${CY})`}
                  />
                )}
                {settings.showSecond && (
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX}
                    y2={CY - 135}
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform={`rotate(${secondAngle} ${CX} ${CY})`}
                  />
                )}

                <circle cx={CX} cy={CY} r="12" fill="#1e293b" />
                <circle cx={CX} cy={CY} r="4" fill="#ffffff" />
              </g>

              <g id="drawings-layer">{renderDrawings()}</g>
            </svg>
          </div>

          <div
            className={`mt-4 sm:mt-6 text-xs sm:text-sm font-bold flex items-center bg-white/60 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm ${
              isDay ? "text-sky-800" : "text-slate-800"
            }`}
          >
            {drawMode === "mouse" ? T[lang].hintMouse : T[lang].hintDraw}
          </div>
        </div>

        {/* 右側：控制面板 */}
        <div className="w-full md:w-[420px] p-4 md:p-5 flex flex-col bg-white overflow-y-auto">
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4 shrink-0">
            <button
              onClick={() => setMode("explore")}
              className={`flex-1 min-w-[65px] py-1.5 sm:py-2 px-1 rounded-xl font-black text-[0.8rem] sm:text-[0.9rem] tracking-wider transition-all border-b-[4px] sm:border-b-[5px] active:translate-y-[4px] active:border-b-0 flex items-center justify-center ${
                mode === "explore"
                  ? "bg-[#3b82f6] text-white border-[#1d4ed8] shadow-sm"
                  : "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd] hover:bg-[#bfdbfe]"
              }`}
            >
              {T[lang].explore}
            </button>
            <button
              onClick={() => setMode("step")}
              className={`flex-1 min-w-[65px] py-1.5 sm:py-2 px-1 rounded-xl font-black text-[0.8rem] sm:text-[0.9rem] tracking-wider transition-all border-b-[4px] sm:border-b-[5px] active:translate-y-[4px] active:border-b-0 flex items-center justify-center ${
                mode === "step"
                  ? "bg-[#facc15] text-[#422006] border-[#a16207] shadow-sm"
                  : "bg-[#fef08a] text-[#713f12] border-[#fde047] hover:bg-[#fde047]"
              }`}
            >
              {T[lang].step}
            </button>
            <button
              onClick={() => setMode("practice")}
              className={`flex-1 min-w-[65px] py-1.5 sm:py-2 px-1 rounded-xl font-black text-[0.8rem] sm:text-[0.9rem] tracking-wider transition-all border-b-[4px] sm:border-b-[5px] active:translate-y-[4px] active:border-b-0 flex items-center justify-center ${
                mode === "practice"
                  ? "bg-[#ef4444] text-white border-[#b91c1c] shadow-sm"
                  : "bg-[#fee2e2] text-[#7f1d1d] border-[#fca5a5] hover:bg-[#fecaca]"
              }`}
            >
              {T[lang].practice}
            </button>
            <button
              onClick={() => setMode("history")}
              className={`flex-1 min-w-[65px] py-1.5 sm:py-2 px-1 rounded-xl font-black text-[0.8rem] sm:text-[0.9rem] tracking-wider transition-all border-b-[4px] sm:border-b-[5px] active:translate-y-[4px] active:border-b-0 flex items-center justify-center ${
                mode === "history"
                  ? "bg-[#22c55e] text-white border-[#15803d] shadow-sm"
                  : "bg-[#dcfce7] text-[#14532d] border-[#86efac] hover:bg-[#bbf7d0]"
              }`}
            >
              {T[lang].history}
            </button>
            <button
              onClick={() => setMode("print")}
              className={`flex-1 min-w-[65px] py-1.5 sm:py-2 px-1 rounded-xl font-black text-[0.8rem] sm:text-[0.9rem] tracking-wider transition-all border-b-[4px] sm:border-b-[5px] active:translate-y-[4px] active:border-b-0 flex items-center justify-center ${
                mode === "print"
                  ? "bg-[#a855f7] text-white border-[#7e22ce] shadow-sm"
                  : "bg-[#f3e8ff] text-[#4c1d95] border-[#d8b4fe] hover:bg-[#e9d5ff]"
              }`}
            >
              {T[lang].printTab}
            </button>
          </div>

          {/* 模式一：自由探索 */}
          {mode === "explore" && (
            <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-3 flex flex-col items-center">
                <div className="flex items-center w-full mb-1.5 px-1">
                  <h2 className="text-[1.1rem] sm:text-[1.2rem] font-black text-[#0c264a] tracking-wider mr-2">
                    {T[lang].digiClock}
                  </h2>
                  <button
                    onClick={() => setShowDigitalClock(!showDigitalClock)}
                    className="px-2 py-0.5 bg-[#d5d5d5] text-[#555555] rounded-md font-bold text-[11px] sm:text-[12px] hover:bg-[#c0c0c0] active:scale-95 transition-all"
                  >
                    {showDigitalClock ? T[lang].hide : T[lang].show}
                  </button>
                </div>

                {showDigitalClock ? (
                  <div className="flex space-x-2 sm:space-x-3 items-center justify-center w-full bg-white p-3 sm:p-4 rounded-[1.5rem] shadow-sm border border-slate-100">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => adjustTime(60)}
                        className="w-14 sm:w-16 h-6 sm:h-7 bg-[#ffe4e4] rounded-lg flex items-center justify-center mb-1 hover:bg-[#ffcfcf] active:scale-95 transition-all"
                      >
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#ff7070]"></div>
                      </button>
                      <div className="relative w-14 h-16 sm:w-20 sm:h-20">
                        <div className="absolute inset-0 bg-[#b3b3b3] rounded-[0.8rem] translate-x-[4px] translate-y-[4px]"></div>
                        <div className="absolute inset-0 bg-[#fc6c65] rounded-[0.8rem] border-[3px] sm:border-[4px] border-[#ffb2b2] flex items-center justify-center text-white text-[2rem] sm:text-[2.75rem] font-black tracking-tighter select-none">
                          {displayH.toString().padStart(2, "0")}
                        </div>
                      </div>
                      <button
                        onClick={() => adjustTime(-60)}
                        className="w-14 sm:w-16 h-6 sm:h-7 bg-[#ffe4e4] rounded-lg flex items-center justify-center mt-1.5 hover:bg-[#ffcfcf] active:scale-95 transition-all"
                      >
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#ff7070]"></div>
                      </button>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex space-x-1.5 sm:space-x-2 mb-1">
                        <button
                          onClick={() => adjustTime(10)}
                          className="w-[2rem] sm:w-[2.5rem] h-6 sm:h-7 bg-[#e0edff] rounded-lg flex items-center justify-center hover:bg-[#c9e1ff] active:scale-95 transition-all"
                        >
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#7a8cdd]"></div>
                        </button>
                        <button
                          onClick={() => adjustTime(1)}
                          className="w-[2rem] sm:w-[2.5rem] h-6 sm:h-7 bg-[#e0edff] rounded-lg flex items-center justify-center hover:bg-[#c9e1ff] active:scale-95 transition-all"
                        >
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#7a8cdd]"></div>
                        </button>
                      </div>
                      <div className="relative w-[4.2rem] h-16 sm:w-[5.5rem] sm:h-20">
                        <div className="absolute inset-0 bg-[#b3b3b3] rounded-[0.8rem] translate-x-[4px] translate-y-[4px]"></div>
                        <div className="absolute inset-0 bg-[#4ea9f5] rounded-[0.8rem] border-[3px] sm:border-[4px] border-[#a8d3f6] flex items-center justify-center text-white text-[2rem] sm:text-[2.75rem] font-black tracking-widest select-none">
                          {mTens}
                          {mOnes}
                        </div>
                      </div>
                      <div className="flex space-x-1.5 sm:space-x-2 mt-1.5">
                        <button
                          onClick={() => adjustTime(-10)}
                          className="w-[2rem] sm:w-[2.5rem] h-6 sm:h-7 bg-[#e0edff] rounded-lg flex items-center justify-center hover:bg-[#c9e1ff] active:scale-95 transition-all"
                        >
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#7a8cdd]"></div>
                        </button>
                        <button
                          onClick={() => adjustTime(-1)}
                          className="w-[2rem] sm:w-[2.5rem] h-6 sm:h-7 bg-[#e0edff] rounded-lg flex items-center justify-center hover:bg-[#c9e1ff] active:scale-95 transition-all"
                        >
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#7a8cdd]"></div>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="h-6 sm:h-7 mb-1"></div>
                      <div
                        className="relative w-12 h-16 sm:w-16 sm:h-20 flex items-stretch gap-1"
                        title="切換上下午與語音報時"
                      >
                         <div 
                           onClick={() => adjustTime(720)}
                           className="flex-1 cursor-pointer group relative"
                         >
                            <div className="absolute inset-0 bg-[#b3b3b3] rounded-l-[0.8rem] translate-x-[4px] translate-y-[4px]"></div>
                            <div className="absolute inset-0 bg-[#6b6b6b] rounded-l-[0.8rem] border-[3px] border-r-0 sm:border-[4px] sm:border-r-0 border-[#c4c4c4] flex items-center justify-center text-white text-sm sm:text-lg font-bold select-none group-active:bg-[#5a5a5a] transition-colors">
                              {getDigitalTime(totalMinutes, lang).ampm}
                            </div>
                         </div>
                         <div 
                           onClick={() => speakTime()}
                           className="w-8 sm:w-10 cursor-pointer group relative"
                           title="語音報時"
                         >
                            <div className="absolute inset-0 bg-[#b3b3b3] rounded-r-[0.8rem] translate-x-[4px] translate-y-[4px]"></div>
                            <div className="absolute inset-0 bg-[#3b82f6] rounded-r-[0.8rem] border-[3px] border-l-0 sm:border-[4px] sm:border-l-0 border-[#93c5fd] flex items-center justify-center text-white group-active:bg-[#2563eb] transition-colors">
                              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md" />
                            </div>
                         </div>
                      </div>
                      <div className="h-6 sm:h-7 mt-1.5"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[100px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                    <span className="text-slate-400 font-bold mb-1">
                      {T[lang].hiddenState}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {T[lang].hiddenHint}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-3 flex flex-col items-center">
                <div className="flex items-center justify-center w-full bg-white p-2.5 sm:p-3 rounded-[1.5rem] shadow-sm border border-slate-100">
                  <div className="flex flex-col items-center mr-3 sm:mr-5 shrink-0">
                    <span className="text-[#0e274c] font-black text-[1rem] sm:text-[1.2rem] leading-tight tracking-widest">
                      {T[lang].ptr1}
                    </span>
                    <span className="text-[#0e274c] font-black text-[1rem] sm:text-[1.2rem] leading-tight tracking-widest">
                      {T[lang].ptr2}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() =>
                          setSettings((s) => ({ ...s, linked: !s.linked }))
                        }
                        className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] tracking-wider transition-all active:scale-95 ${
                          settings.linked
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].link}
                      </button>
                      <button
                        onClick={() =>
                          setSettings((s) => ({ ...s, trail: !s.trail }))
                        }
                        className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] tracking-wider transition-all active:scale-95 ${
                          settings.trail
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].trail}
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() =>
                          setSettings((s) => ({ ...s, showHour: !s.showHour }))
                        }
                        className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] transition-all active:scale-95 ${
                          settings.showHour
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].hourHand}
                      </button>
                      <button
                        onClick={() =>
                          setSettings((s) => ({
                            ...s,
                            showMinute: !s.showMinute,
                          }))
                        }
                        className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] transition-all active:scale-95 ${
                          settings.showMinute
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].minHand}
                      </button>
                      <button
                        onClick={() =>
                          setSettings((s) => ({
                            ...s,
                            showSecond: !s.showSecond,
                          }))
                        }
                        className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] transition-all active:scale-95 ${
                          settings.showSecond
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].secHand}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 flex flex-col items-center">
                <div className="flex items-center justify-center w-full bg-white p-2.5 sm:p-3 rounded-[1.5rem] shadow-sm border border-slate-100">
                  <div className="flex flex-col items-center mr-3 sm:mr-5 shrink-0">
                    <span className="text-[#0e274c] font-black text-[1rem] sm:text-[1.2rem] leading-tight tracking-widest">
                      {T[lang].scale1}
                    </span>
                    <span className="text-[#0e274c] font-black text-[1rem] sm:text-[1.2rem] leading-tight tracking-widest">
                      {T[lang].scale2}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() =>
                          setScaleSettings((s) => ({
                            ...s,
                            showTicks: !s.showTicks,
                          }))
                        }
                        className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] transition-all active:scale-95 ${
                          scaleSettings.showTicks
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].ticks}
                      </button>
                      <button
                        onClick={() =>
                          setScaleSettings((s) => ({
                            ...s,
                            showMinuteNumbers: !s.showMinuteNumbers,
                          }))
                        }
                        className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] transition-all active:scale-95 ${
                          scaleSettings.showMinuteNumbers
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].numbers}
                      </button>
                      <button
                        onClick={() =>
                          setScaleSettings((s) => ({
                            ...s,
                            showColorFill: !s.showColorFill,
                          }))
                        }
                        className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] transition-all active:scale-95 ${
                          scaleSettings.showColorFill
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].colors}
                      </button>
                    </div>
                    <div className="flex gap-1.5 items-stretch relative">
                      <button
                        onClick={() =>
                          setScaleSettings((s) => ({
                            ...s,
                            extendHands: !s.extendHands,
                          }))
                        }
                        className={`w-[4.5rem] sm:w-[5.5rem] py-1 sm:py-1.5 rounded-lg font-bold text-[0.85rem] sm:text-[1rem] transition-all active:scale-95 shrink-0 ${
                          scaleSettings.extendHands
                            ? "bg-[#f4c25b] text-[#603014]"
                            : "bg-[#cecece] text-[#717171]"
                        }`}
                      >
                        {T[lang].extend}
                      </button>
                      <div
                        className={`flex-1 flex items-center justify-center bg-[#f4c25b] rounded-lg px-2 py-0.5 transition-opacity relative ${
                          scaleSettings.showMinuteNumbers
                            ? "opacity-100"
                            : "opacity-40 grayscale pointer-events-none"
                        }`}
                      >
                        <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#f4c25b]"></div>
                        <label className="flex items-center cursor-pointer mr-2 sm:mr-3">
                          <input
                            type="radio"
                            name="minuteMode"
                            className="mr-1 w-3 h-3 accent-[#603014] cursor-pointer"
                            checked={scaleSettings.minuteNumbersMode === "by5"}
                            onChange={() =>
                              setScaleSettings((s) => ({
                                ...s,
                                minuteNumbersMode: "by5",
                              }))
                            }
                          />
                          <span className="text-[#603014] font-bold text-[10px] sm:text-[13px] whitespace-nowrap">
                            {T[lang].by5}
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="minuteMode"
                            className="mr-1 w-3 h-3 accent-[#603014] cursor-pointer"
                            checked={scaleSettings.minuteNumbersMode === "all"}
                            onChange={() =>
                              setScaleSettings((s) => ({
                                ...s,
                                minuteNumbersMode: "all",
                              }))
                            }
                          />
                          <span className="text-[#603014] font-bold text-[10px] sm:text-[13px] whitespace-nowrap">
                            {T[lang].all}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 flex flex-col items-center">
                <div className="flex items-center justify-center w-full bg-white p-2.5 sm:p-3 rounded-[1.5rem] shadow-sm border border-slate-100 relative">
                  {(drawMode === "pencil" || drawMode === "line") && (
                    <div className="absolute -top-[2.75rem] left-[45%] bg-[#f4c25b] px-2 py-2 rounded-full flex gap-1.5 sm:gap-2 shadow-lg z-10 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 border-2 border-white">
                      {drawColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setDrawColor(c)}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-inner transition-transform active:scale-90 ${
                            drawColor === c
                              ? "scale-125 ring-2 ring-white ring-offset-1 ring-offset-[#f4c25b]"
                              : "hover:scale-110"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <div className="absolute -bottom-[6px] left-[25%] sm:left-[30%] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#f4c25b]"></div>
                    </div>
                  )}

                  <div className="flex flex-col items-center mr-3 sm:mr-5 shrink-0">
                    <span className="text-[#0e274c] font-black text-[1rem] sm:text-[1.2rem] leading-tight tracking-widest">
                      {T[lang].draw1}
                    </span>
                    <span className="text-[#0e274c] font-black text-[1rem] sm:text-[1.2rem] leading-tight tracking-widest">
                      {T[lang].draw2}
                    </span>
                  </div>

                  <div className="flex gap-1 sm:gap-1.5 w-full h-12 sm:h-14">
                    <button
                      onClick={() => setDrawMode("mouse")}
                      className={btnToolClass(drawMode === "mouse")}
                    >
                      <MousePointer2 className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                      <span className="text-[0.65rem] sm:text-[0.75rem] -mt-0.5 whitespace-nowrap">
                        {T[lang].mouse}
                      </span>
                    </button>
                    <button
                      onClick={() => setDrawMode("pencil")}
                      className={btnToolClass(drawMode === "pencil")}
                    >
                      <Pencil className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                      <span className="text-[0.65rem] sm:text-[0.75rem] -mt-0.5 whitespace-nowrap">
                        {T[lang].pen}
                      </span>
                    </button>
                    <button
                      onClick={() => setDrawMode("line")}
                      className={btnToolClass(drawMode === "line")}
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 rotate-45" />
                      <span className="text-[0.65rem] sm:text-[0.75rem] -mt-0.5 whitespace-nowrap">
                        {T[lang].line}
                      </span>
                    </button>
                    <button
                      onClick={() => setDrawMode("eraser")}
                      className={btnToolClass(drawMode === "eraser")}
                    >
                      <Eraser className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                      <span className="text-[0.65rem] sm:text-[0.75rem] -mt-0.5 whitespace-nowrap">
                        {T[lang].erase}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setDrawings([]);
                        setDrawMode("mouse");
                      }}
                      className={btnToolClass(false)}
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                      <span className="text-[0.65rem] sm:text-[0.75rem] -mt-0.5 whitespace-nowrap">
                        {T[lang].clearAll}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-1">
                <button
                  onClick={setToCurrentTime}
                  className="w-full py-2.5 sm:py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl flex items-center justify-center transition-colors text-sm sm:text-base"
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {T[lang].backToNow}
                </button>
              </div>
            </div>
          )}

          {/* 模式二：逐步學習 */}
          {mode === "step" && (
            <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-[1.2rem] sm:text-[1.35rem] font-black text-indigo-900 tracking-wider">
                  {T[lang].stepTitle}
                </h2>
              </div>

              <div className="flex flex-col gap-2.5 sm:gap-3 mb-6">
                <button
                  onClick={() => setStepLevel("oclock")}
                  className={`py-2.5 sm:py-3 px-4 rounded-xl font-bold text-sm sm:text-base text-left transition-all border-l-[6px] flex items-center justify-between ${
                    stepLevel === "oclock"
                      ? "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span>{T[lang].step1}</span>
                  {stepLevel === "oclock" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  )}
                </button>
                <button
                  onClick={() => setStepLevel("half")}
                  className={`py-2.5 sm:py-3 px-4 rounded-xl font-bold text-sm sm:text-base text-left transition-all border-l-[6px] flex items-center justify-between ${
                    stepLevel === "half"
                      ? "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span>{T[lang].step2}</span>
                  {stepLevel === "half" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  )}
                </button>
                <button
                  onClick={() => setStepLevel("minute")}
                  className={`py-2.5 sm:py-3 px-4 rounded-xl font-bold text-sm sm:text-base text-left transition-all border-l-[6px] flex items-center justify-between ${
                    stepLevel === "minute"
                      ? "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span>{T[lang].step3}</span>
                  {stepLevel === "minute" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  )}
                </button>

                {/* 幾點幾分 子選項列 */}
                {stepLevel === "minute" && (
                  <div className="flex justify-end gap-3 pl-4 pr-1 -mt-1 animate-in fade-in slide-in-from-top-2">
                    <label className="flex items-center cursor-pointer gap-2 bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors">
                      <input
                        type="radio"
                        name="stepMinMode"
                        checked={stepMinMode === "by5"}
                        onChange={() => setStepMinMode("by5")}
                        className="w-4 h-4 accent-indigo-600"
                      />
                      <span className="text-indigo-800 font-bold text-xs sm:text-sm">
                        {T[lang].minBy5}
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer gap-2 bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors">
                      <input
                        type="radio"
                        name="stepMinMode"
                        checked={stepMinMode === "mixed"}
                        onChange={() => setStepMinMode("mixed")}
                        className="w-4 h-4 accent-indigo-600"
                      />
                      <span className="text-indigo-800 font-bold text-xs sm:text-sm">
                        {T[lang].minMixed}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="text-center w-full bg-indigo-50 p-4 sm:p-5 rounded-2xl border-2 border-indigo-200 mb-6 shadow-sm">
                <h3 className="text-indigo-700 font-bold mb-1 sm:mb-2 text-sm sm:text-base">
                  {T[lang].setTo}
                </h3>
                {targetMinutes !== null &&
                  renderTargetTimeBlocks(targetMinutes, "text-indigo-800")}
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 w-full mt-auto">
                <button
                  onClick={checkAnswer}
                  className="w-full py-3 sm:py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  {T[lang].check}
                </button>
                <button
                  onClick={() => generateStepQuestion(stepLevel)}
                  className="w-full py-2.5 sm:py-3.5 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl border-2 border-slate-200 flex items-center justify-center transition-colors active:bg-slate-100 text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {T[lang].next}
                </button>
              </div>

              <div className="h-12 sm:h-14 mt-3 sm:mt-4">
                {feedback !== null && (
                  <div
                    className={`h-full flex items-center justify-center rounded-xl font-bold text-base sm:text-lg animate-in zoom-in duration-300 ${
                      feedback
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {feedback ? (
                      <>
                        <CheckCircle2
                          className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                          strokeWidth={2.5}
                        />
                        <span>{T[lang].correct}</span>
                      </>
                    ) : (
                      <>
                        <XCircle
                          className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                          strokeWidth={2.5}
                        />
                        <span>{T[lang].wrong}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 模式三：挑戰模式 */}
          {mode === "practice" && (
            <div className="flex flex-col flex-1 justify-center animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
                <h2 className="text-[1.05rem] sm:text-[1.2rem] font-black text-emerald-900 tracking-wider">
                  {T[lang].unitTitle}
                </h2>
              </div>
              <div
                className={`flex bg-slate-100 rounded-xl p-1 sm:p-1.5 ${
                  practiceLevel === "minute" ? "mb-2 sm:mb-3" : "mb-4 sm:mb-6"
                } shadow-inner shrink-0 gap-1`}
              >
                <button
                  onClick={() => setPracticeLevel("oclock")}
                  className={tabBtnClass(
                    practiceLevel === "oclock",
                    "text-emerald-600"
                  )}
                >
                  {T[lang].unit1}
                </button>
                <button
                  onClick={() => setPracticeLevel("half")}
                  className={tabBtnClass(
                    practiceLevel === "half",
                    "text-emerald-600"
                  )}
                >
                  {T[lang].unit2}
                </button>
                <button
                  onClick={() => setPracticeLevel("minute")}
                  className={tabBtnClass(
                    practiceLevel === "minute",
                    "text-emerald-600"
                  )}
                >
                  {T[lang].unit3}
                </button>
              </div>

              {/* 幾點幾分 子選項列 */}
              {practiceLevel === "minute" && (
                <div className="flex justify-center gap-3 mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-2">
                  <label className="flex items-center cursor-pointer gap-2 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors">
                    <input
                      type="radio"
                      name="pracMinMode"
                      checked={pracMinMode === "by5"}
                      onChange={() => setPracMinMode("by5")}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span className="text-emerald-800 font-bold text-xs sm:text-sm">
                      {T[lang].minBy5}
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer gap-2 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors">
                    <input
                      type="radio"
                      name="pracMinMode"
                      checked={pracMinMode === "mixed"}
                      onChange={() => setPracMinMode("mixed")}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span className="text-emerald-800 font-bold text-xs sm:text-sm">
                      {T[lang].minMixed}
                    </span>
                  </label>
                </div>
              )}

              <div className="text-center w-full bg-emerald-50 p-4 sm:p-5 rounded-2xl border-2 border-emerald-200 mb-6 shadow-sm">
                <h3 className="text-emerald-700 font-bold mb-1 sm:mb-2 text-sm sm:text-base">
                  {T[lang].setTo}
                </h3>
                {targetMinutes !== null &&
                  renderTargetTimeBlocks(targetMinutes, "text-emerald-800")}
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 w-full mt-auto">
                <button
                  onClick={checkAnswer}
                  className="w-full py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  {T[lang].check}
                </button>
                <button
                  onClick={generatePracticeQuestion}
                  className="w-full py-2.5 sm:py-3.5 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl border-2 border-slate-200 flex items-center justify-center transition-colors active:bg-slate-100 text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {T[lang].next}
                </button>
              </div>

              <div className="h-12 sm:h-14 mt-3 sm:mt-4">
                {feedback !== null && (
                  <div
                    className={`h-full flex items-center justify-center rounded-xl font-bold text-base sm:text-lg animate-in zoom-in duration-300 ${
                      feedback
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {feedback ? (
                      <>
                        <CheckCircle2
                          className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                          strokeWidth={2.5}
                        />
                        <span>{T[lang].correct}</span>
                      </>
                    ) : (
                      <>
                        <XCircle
                          className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                          strokeWidth={2.5}
                        />
                        <span>{T[lang].wrong}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 模式四：練習紀錄 */}
          {mode === "history" && (
            <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300 h-full">
              <h2 className="text-[1.2rem] sm:text-[1.35rem] font-black text-slate-800 tracking-wider mb-3 sm:mb-4 px-1">
                {T[lang].history}
              </h2>

              <div className="flex-1 overflow-y-auto bg-slate-50 rounded-2xl border-2 border-slate-200 p-3 sm:p-4 mb-4">
                {records.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                    <div className="text-3xl sm:text-4xl mb-2">📊</div>
                    <p className="font-bold text-center text-xs sm:text-sm">
                      {T[lang].noRecord}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:gap-3">
                    {records.map((record) => {
                      const modeStr =
                        record.mode === "step"
                          ? T[lang].stepTitle
                          : T[lang].practice;
                      let levelStr = "";
                      if (record.level === "oclock") levelStr = T[lang].unit1;
                      else if (record.level === "half")
                        levelStr = T[lang].unit2;
                      else if (record.level === "minute") {
                        levelStr = `${T[lang].unit3} (${
                          record.subLevel === "by5"
                            ? T[lang].minBy5
                            : T[lang].minMixed
                        })`;
                      }

                      const targetTimeStr = getDigitalTime(
                        record.targetMins,
                        lang
                      ).time;
                      const userTimeStr = getDigitalTime(
                        record.userMins ?? record.targetMins,
                        lang
                      ).time;

                      return (
                        <div
                          key={record.id}
                          className={`flex items-center justify-between p-2.5 sm:p-4 rounded-xl border-l-4 shadow-sm bg-white animate-in slide-in-from-top-2 duration-200 ${
                            record.isCorrect
                              ? "border-l-emerald-500"
                              : "border-l-rose-500"
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                                record.isCorrect
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-rose-100 text-rose-600"
                              }`}
                            >
                              {record.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              ) : (
                                <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              {record.isCorrect ? (
                                <span className="font-bold text-slate-700 text-base sm:text-lg tracking-wider">
                                  {targetTimeStr}
                                </span>
                              ) : (
                                <div className="flex items-baseline gap-1.5 sm:gap-2">
                                  <span className="font-bold text-rose-500 text-base sm:text-lg tracking-wider line-through">
                                    {userTimeStr}
                                  </span>
                                  <span className="font-bold text-emerald-600 text-xs sm:text-sm tracking-wider">
                                    ({T[lang].correctAns}
                                    {targetTimeStr})
                                  </span>
                                </div>
                              )}
                              <span className="text-[10px] sm:text-xs text-slate-500 font-bold mt-0.5">
                                {modeStr} - {levelStr}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`font-black text-xs sm:text-sm ${
                              record.isCorrect
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            {record.isCorrect
                              ? T[lang].correctRecord
                              : T[lang].wrongRecord}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {records.length > 0 && (
                <button
                  onClick={() => setRecords([])}
                  className="w-full py-2.5 sm:py-3.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-xl flex items-center justify-center transition-colors active:scale-95 text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {T[lang].clearRecord}
                </button>
              )}
            </div>
          )}

          {/* 模式五：列印表單 */}
          {mode === "print" && (
            <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-[1.2rem] sm:text-[1.35rem] font-black text-purple-900 tracking-wider">
                  {T[lang].printTab}
                </h2>
              </div>

              {/* 列印單元選擇 */}
              <div className="bg-purple-50 p-4 sm:p-5 rounded-2xl border-2 border-purple-200 mb-4 sm:mb-5 shadow-sm">
                <h3 className="font-bold text-purple-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  {T[lang].selectUnitsMsg}
                </h3>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 bg-white rounded-xl cursor-pointer hover:bg-purple-100 transition-colors border border-purple-100 active:scale-[0.98]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-purple-600"
                      checked={printUnits.includes("oclock")}
                      onChange={() => togglePrintUnit("oclock")}
                    />
                    <span className="font-bold text-slate-700 text-sm sm:text-lg">
                      {T[lang].unit1}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 bg-white rounded-xl cursor-pointer hover:bg-purple-100 transition-colors border border-purple-100 active:scale-[0.98]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-purple-600"
                      checked={printUnits.includes("half")}
                      onChange={() => togglePrintUnit("half")}
                    />
                    <span className="font-bold text-slate-700 text-sm sm:text-lg">
                      {T[lang].unit2}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 bg-white rounded-xl cursor-pointer hover:bg-purple-100 transition-colors border border-purple-100 active:scale-[0.98]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-purple-600"
                      checked={printUnits.includes("minute_by5")}
                      onChange={() => togglePrintUnit("minute_by5")}
                    />
                    <span className="font-bold text-slate-700 text-sm sm:text-lg">
                      {T[lang].unit3_5}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 bg-white rounded-xl cursor-pointer hover:bg-purple-100 transition-colors border border-purple-100 active:scale-[0.98]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-purple-600"
                      checked={printUnits.includes("minute_mixed")}
                      onChange={() => togglePrintUnit("minute_mixed")}
                    />
                    <span className="font-bold text-slate-700 text-sm sm:text-lg">
                      {T[lang].unit3_mixed}
                    </span>
                  </label>
                </div>
              </div>

              {/* 列印題數選擇 */}
              <div className="bg-purple-50 p-4 sm:p-5 rounded-2xl border-2 border-purple-200 mb-4 sm:mb-6 shadow-sm">
                <h3 className="font-bold text-purple-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  {T[lang].questionCount}
                </h3>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setPrintCount(6)}
                    className={`flex-1 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg transition-all ${
                      printCount === 6
                        ? "bg-purple-500 text-white shadow-md"
                        : "bg-white text-slate-600 border border-purple-200 hover:bg-purple-100"
                    }`}
                  >
                    {T[lang].q6}
                  </button>
                  <button
                    onClick={() => setPrintCount(9)}
                    className={`flex-1 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg transition-all ${
                      printCount === 9
                        ? "bg-purple-500 text-white shadow-md"
                        : "bg-white text-slate-600 border border-purple-200 hover:bg-purple-100"
                    }`}
                  >
                    {T[lang].q9}
                  </button>
                  <button
                    onClick={() => setPrintCount(12)}
                    className={`flex-1 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg transition-all ${
                      printCount === 12
                        ? "bg-purple-500 text-white shadow-md"
                        : "bg-white text-slate-600 border border-purple-200 hover:bg-purple-100"
                    }`}
                  >
                    {T[lang].q12}
                  </button>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="mt-auto w-full py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Printer className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                {T[lang].generatePrint}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
