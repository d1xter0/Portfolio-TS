import { useEffect, useRef, useState } from "react";

const CHAR_DELAY = 42;
const PRE_RESULT_PAUSE = 340;
const RESULT_DISPLAY = 1500;
const NEXT_PAUSE = 520;
const MAX_HISTORY = 3;

interface Cmd {
  cmd: string;
  result: string;
}

const COMMANDS: Cmd[] = [
  {
    cmd: "ssh root@wsim.dev -i ~/.ssh/id_ed25519",
    result:
      "Welcome to Ubuntu LTS! Last login: Thu May 28 20:14:15 from 192.168.1.2",
  },
  {
    cmd: "git push origin main --force-with-lease",
    result:
      "To github.com:d1xter0/portfolio.git\n ! [rejected]        main -> main (fetch first)",
  },
  {
    cmd: "git pull --rebase origin main",
    result: "Successfully rebased and updated refs/heads/main.",
  },
  {
    cmd: "git push origin main",
    result:
      "Counting objects: 100% (5/5), done.\n To github.com:d1xter0/portfolio.git\n   a1b2c3d..e5f6g7h  main -> main",
  },
  {
    cmd: "docker build -t wsim/api:latest .",
    result:
      "Successfully built 3f6a91c2d4e8\nSuccessfully tagged wsim/api:latest",
  },
  {
    cmd: "openssl verify -CAfile chain.pem cert.pem",
    result: "cert.pem: OK",
  },
  {
    cmd: "node server.js --secure",
    result: "Production server running securely on https://localhost:443",
  },
];

export default function DevTerminal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [currentText, setCurrentText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<Cmd[]>([]);

  const activeRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cmdIdxRef = useRef(0);
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
            setHistory((prev) => [...prev, completed].slice(-MAX_HISTORY));
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
      { threshold: 0.3 },
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
      aria-label="Live terminal displaying cybersecurity and development commands"
    >
      <div className="dt-header" aria-hidden="true">
        <div className="dt-header-icon">
          <span className="dt-icon-symbol">$_</span>
        </div>
        <span className="dt-title">d1xter0@kali: ~</span>
        <div className="dt-controls">
          <span className="dt-ctrl" />
          <span className="dt-ctrl" />
          <span className="dt-ctrl dt-ctrl--close">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" aria-hidden="true">
              <line x1="0.5" y1="0.5" x2="5.5" y2="5.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="5.5" y1="0.5" x2="0.5" y2="5.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="dt-menu" aria-hidden="true">
        <span>Session</span>
        <span>Actions</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>

      <div className="dt-screen">
        {history.map((item, i) => (
          <div key={i} className="dt-row dt-row--done">
            <div className="dt-cmdline">
              <span className="dt-prompt">root@d1xter0:~# </span>
              <span className="dt-cmd">{item.cmd}</span>
            </div>
            <span className="dt-result">{item.result}</span>
          </div>
        ))}

        <div className="dt-row dt-row--active">
          <div className="dt-cmdline">
            <span className="dt-prompt">root@d1xter0:~# </span>
            <span className="dt-cmd">{currentText}</span>
            {!showResult && (
              <span className="dt-blink-cur" aria-hidden="true">
                _
              </span>
            )}
          </div>
          {showResult && (
            <span className="dt-result">{activeCmdEntry.result}</span>
          )}
        </div>
      </div>
    </div>
  );
}
