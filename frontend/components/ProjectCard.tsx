import "./styles/ProjectCard.css";
import { useState, useEffect, useRef, useCallback } from "react";

type ProjectCardProps = {
  pic:         string;
  title:       string;
  description: string;
  techs:       string[];
  links:       string;
  github?:     string;
};

const STACK_MS = 3_000;

function ProjectCard({ pic, title, description, techs, links, github }: ProjectCardProps) {
  const [hovered,   setHovered]   = useState(false);
  const [showStack, setShowStack] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // The 3 s stack timer keeps running so the stack persists until expiry.
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const handleStackClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimer();
    setShowStack(true);
    timerRef.current = setTimeout(() => setShowStack(false), STACK_MS);
  }, [clearTimer]);

  // Guarantee no stale timer on unmount
  useEffect(() => clearTimer, [clearTimer]);

  // Derived visibility — mutually exclusive layers
  const showInfo    = !hovered && !showStack;
  const showActions =  hovered && !showStack;

  return (
    <div
      className="pc-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Full-bleed portrait cover */}
      <img
        src={pic}
        alt={title}
        className="pc-cover"
        loading="lazy"
        decoding="async"
      />

      {/* Top-right: external-link badge */}
      <a
        href={links}
        target="_blank"
        rel="noopener noreferrer"
        className="pc-ext"
        aria-label={`Open ${title}`}
      >
        <svg
          width="14" height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>

      {/* Bottom glassmorphism overlay — three mutually-exclusive layers */}
      <div className="pc-overlay">

        {/* Layer 1 — default: title + description */}
        <div className={`pc-layer pc-info${showInfo ? " pc-layer--in" : ""}`}>
          <h3 className="pc-title">{title}</h3>
          <p  className="pc-desc">{description}</p>
        </div>

        {/* Layer 2 — hover: Stack + GitHub actions */}
        <div className={`pc-layer pc-actions${showActions ? " pc-layer--in" : ""}`}>
          <button
            className="pc-btn pc-btn--stack"
            type="button"
            onClick={handleStackClick}
          >
            Stack
          </button>
          <a
            href={github ?? "https://github.com/d1xter0"}
            target="_blank"
            rel="noopener noreferrer"
            className="pc-btn pc-btn--github"
          >
            GitHub
          </a>
        </div>

        {/* Layer 3 — stack-click: tech tags, auto-hides after 10 s */}
        <div className={`pc-layer pc-stack${showStack ? " pc-layer--in" : ""}`}>
          {techs.map((tech) => (
            <span key={tech} className="pc-tech">{tech}</span>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ProjectCard;
