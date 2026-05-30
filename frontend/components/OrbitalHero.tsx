import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const ORBIT_ICONS = [
  { src: "js.svg",     alt: "JavaScript", phase: 0 },
  { src: "react.svg",  alt: "React",      phase: Math.PI / 2 },
  { src: "github.svg", alt: "GitHub",     phase: Math.PI },
  { src: "python.svg", alt: "Python",     phase: (3 * Math.PI) / 2 },
] as const;

// ─── Orbital Logic ───

// 2:1 (rx:ry) ratio = a circle tilted ~30° toward the viewer — grand & spherical

const SPEED     = 0.30;   // rad/s → full revolution every ~21 s
const ORBIT_RX  = 0.37;   // horizontal radius, fraction of container width
const ORBIT_RY  = 0.37;   // vertical radius  — 2:1 gives the 30° perspective tilt
const ICON_SIZE = 0.155;  // badge width/height as fraction of container
const SCALE_MIN = 0.55;   // badge scale at the back arc (farthest point)
const SCALE_MAX = 0.75;   // badge scale at the top arc — reduced for balance with 4 icons

export default function OrbitalHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const angleRef     = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = (dt: number) => {
      angleRef.current += SPEED * dt;

      const size = container.offsetWidth;
      const cx   = size / 2;
      const cy   = size / 2;
      const rx   = size * ORBIT_RX;
      const ry   = size * ORBIT_RY;
      const half = (size * ICON_SIZE) / 2;

      for (let i = 0; i < ORBIT_ICONS.length; i++) {
        const el = iconRefs.current[i];
        if (!el) continue;

        const θ    = angleRef.current + ORBIT_ICONS[i].phase;
        const sinθ = Math.sin(θ);
        const t    = (1 - sinθ) * 0.5; // 1 = top arc (large/visible), 0 = bottom arc (small/hidden)

        // ── Opacity mask ──
        // Top half (sinθ ≤ 0): fully opaque — badge is above and in front.
        // Bottom half (sinθ > 0): quadratic power-law falloff to absolute zero
        // at the bottom of the arc (sinθ = +1). C⁰-continuous at sinθ = 0:
        // lim sinθ→0⁺ of (1−sinθ)² = 1.0, matching the top-half constant.
        const opacity = sinθ <= 0
          ? 1.0
          : Math.pow(1 - sinθ, 2.0);

        const scale = SCALE_MIN + t * (SCALE_MAX - SCALE_MIN);
        const x     = cx + rx * Math.cos(θ) - half;
        const y     = cy + ry * sinθ        - half;

        // Direct style mutations — avoids GSAP object allocation per frame
        el.style.transform = `translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0) scale(${scale.toFixed(3)})`;
        el.style.opacity   = opacity.toFixed(3);
        el.style.zIndex    = sinθ < 0 ? "3" : "1";
      }
    };

    update(0); // pre-position before first paint — no origin flash
    const tick = (_: number, deltaTime: number) => update(deltaTime / 1000);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="orbital-hero"
      role="img"
      aria-label="Ouassim Sihamda — JavaScript, React, GitHub and Python"
    >
      {/* Orbit-path guide ring — ellipse mirrors the real orbital path */}
      <svg className="orbital-ring" viewBox="0 0 100 100" aria-hidden="true">
        <ellipse
          cx="50"
          cy="50"
          rx={ORBIT_RX * 100}
          ry={ORBIT_RY * 100}
          fill="none"
        />
      </svg>

      {/* Avatar — z-index 2: badges flip between 1 (behind) and 3 (in front) */}
      <div className="orbital-avatar">
        <img src="hero-avatar.svg" alt="" aria-hidden="true" />
      </div>

      {ORBIT_ICONS.map(({ src, alt }, i) => (
        <div
          key={src}
          ref={(el) => { iconRefs.current[i] = el; }}
          className="orbital-icon"
          aria-hidden="true"
        >
          <img src={src} alt={alt} />
        </div>
      ))}
    </div>
  );
}
