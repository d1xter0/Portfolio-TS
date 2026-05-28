import { useEffect, useRef, useState } from "react";

const CHAR_DELAY = 42;
const PRE_RESULT_PAUSE = 340;
const RESULT_DISPLAY = 1500;
const NEXT_PAUSE = 520;
const MAX_HISTORY = 3;

interface Cmd {
  cmd: string;
  result: string;
  color: string;
}

const COMMANDS: Cmd[] = [
  { cmd: "ssh root@d1xter0.io -i ~/.ssh/id_ed25519",  result: "... [Connected]",       color: "#32383f" },
  { cmd: "git push origin main --force-with-lease",   result: "... [Rejected]",         color: "#a11e1e" },
  { cmd: "git pull --rebase origin main",             result: "... [OK]",               color: "#32383f" }, 
  { cmd: "git push origin main --force-with-lease",   result: "... [Deployed]",         color: "#0b3119e1" }, 
  { cmd: "docker build -t d1xter0/api:latest .",      result: "... [Image Ready]",      color: "#32383f" },
  { cmd: "openssl verify -CAfile chain.pem cert.pem", result: "... [Authorized]",       color: "#32383f" }, 
  { cmd: "node server.js --secure",                   result: "... [Port 443 Active]",  color: "#32383f" }, 
];

export default function DevTerminal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [currentText, setCurrentText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<Cmd[]>([]);

  const activeRef  = useRef(false);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cmdIdxRef  = useRef(0);
  const charIdxRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const clearTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    const typeNext = () => {
      if (!activeRef.current) return;
      const entry = COMMANDS[cmdIdxRef.current];

      if (charIdxRef.current <= entry.cmd.length) {
        setCurrentText(entry.cmd.slice(0, charIdxRef.current));
        charIdxRef.current++;
        timerRef.current = setTimeout(typeNext, CHAR_DELAY);
      } else {
        timerRef.current = setTimeout(() => {
          if (!activeRef.current) return;
          setShowResult(true);
          timerRef.current = setTimeout(() => {
            if (!activeRef.current) return;
            const completed = COMMANDS[cmdIdxRef.current];
            setHistory(prev => [...prev, completed].slice(-MAX_HISTORY));
            setCurrentText("");
            setShowResult(false);
            cmdIdxRef.current = (cmdIdxRef.current + 1) % COMMANDS.length;
            charIdxRef.current = 0;
            timerRef.current = setTimeout(typeNext, NEXT_PAUSE);
          }, RESULT_DISPLAY);
        }, PRE_RESULT_PAUSE);
      }
    };

    const start = () => {
      activeRef.current = true;
      setHistory([]);
      setCurrentText("");
      setShowResult(false);
      cmdIdxRef.current = 0;
      charIdxRef.current = 0;
      timerRef.current = setTimeout(typeNext, 600);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !activeRef.current) {
          start();
        } else if (!entry.isIntersecting && activeRef.current) {
          activeRef.current = false;
          clearTimer();
        }
      },
      { threshold: 0.3 }
    );

    io.observe(wrap);
    return () => {
      io.disconnect();
      activeRef.current = false;
      clearTimer();
    };
  }, []);

  const activeCmdEntry = COMMANDS[cmdIdxRef.current];

  return (
    <div
      ref={wrapRef}
      className="dev-terminal"
      role="img"
      aria-label="Live terminal displaying cybersecurity and development commands being executed"
    >
      <div className="dt-screen">
        {history.map((item, i) => (
          <div key={i} className="dt-row dt-row--done">
            <span className="dt-prompt">{"> "}</span>
            <span className="dt-cmd">{item.cmd}</span>
            <span className="dt-result" style={{ color: item.color }}>
              {" " + item.result}
            </span>
          </div>
        ))}

        <div className="dt-row dt-row--active">
          <span className="dt-prompt">{"> "}</span>
          <span className="dt-cmd">{currentText}</span>
          {showResult ? (
            <span className="dt-result" style={{ color: activeCmdEntry.color }}>
              {" " + activeCmdEntry.result}
            </span>
          ) : (
            <span className="dt-blink-cur" aria-hidden="true">_</span>
          )}
        </div>
      </div>
    </div>
  );
}
