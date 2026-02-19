import "./styles/Header.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const { t } = useTranslation();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header id="head">
      <div className="head">
        <div className="head-icon">
          <img alt="logo-icon" src="/avatar-icon.png" />
        </div>

        <div className="research-bar">
          <button className="status-btn" onClick={() => scrollTo("Career")}>
            <div className="cNNLQk" />
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

          {/* Visual separator */}
          <div className="lang-divider" aria-hidden="true" />

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;