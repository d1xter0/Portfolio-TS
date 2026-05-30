// @ts-ignore: allow side-effect CSS import without type declarations
import "./styles/Header.css";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const headRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onOutsideClick = (e: MouseEvent) => {
      if (!headRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [menuOpen]);

  return (
    <header id="head">
      <div className="head" ref={headRef}>
        <div className="head-icon">
          <a href="https://d1xter0.vercel.app" target="_blank" rel="noopener noreferrer">
            <img alt="logo-icon" src="/avatar-icon.png" />
          </a>
        </div>

        <nav className="research-bar" aria-label="Main navigation">
          <button className="status-btn" onClick={() => scrollTo("Career")}>
            <div className="status-dot" />
            {t("header.status")}
          </button>

          <button className="head-btn" onClick={() => scrollTo("Home")}>
            {t("header.home")}
          </button>
          <button className="head-btn" onClick={() => scrollTo("About-Me")}>
            {t("header.about")}
          </button>
          <button className="head-btn" onClick={() => scrollTo("Skills")}>
            {t("header.skills")}
          </button>
          <button className="head-btn" onClick={() => scrollTo("Projects")}>
            {t("header.projects")}
          </button>
          <button className="head-btn" onClick={() => scrollTo("Career")}>
            {t("header.career")}
          </button>
          <button className="head-btn" onClick={() => scrollTo("Contact")}>
            {t("header.contact")}
          </button>
        </nav>

        <div className="head-actions">
          <div className="lang-divider" aria-hidden="true" />
          <LanguageSwitcher />

          <button
            className={`hamburger-btn${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={t("header.menu", "Menu")}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-menu" role="navigation">
            <button className="mobile-nav-btn" onClick={() => scrollTo("Home")}>
              {t("header.home")}
            </button>
            <button
              className="mobile-nav-btn"
              onClick={() => scrollTo("About-Me")}
            >
              {t("header.about")}
            </button>
            <button
              className="mobile-nav-btn"
              onClick={() => scrollTo("Skills")}
            >
              {t("header.skills")}
            </button>
            <button
              className="mobile-nav-btn"
              onClick={() => scrollTo("Projects")}
            >
              {t("header.projects")}
            </button>
            <button
              className="mobile-nav-btn"
              onClick={() => scrollTo("Career")}
            >
              {t("header.career")}
            </button>
            <button
              className="mobile-nav-btn"
              onClick={() => scrollTo("Contact")}
            >
              {t("header.contact")}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
