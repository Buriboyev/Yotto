import { GlobeIcon } from "./icons";
import { buildAppUrl } from "../lib/routes";

export default function AppHeader({
  text,
  language,
  currentPath,
  instagramUrl,
  onNavigateHome,
  onNavigateBranches,
  onNavigateMenu,
  onNavigateReservation,
  onNavigateGallery,
  onToggleLanguage,
}) {
  return (
    <header className="topbar glass-panel">
      <a
        className="brand"
        href={buildAppUrl("/")}
        onClick={(event) => {
          event.preventDefault();
          onNavigateHome();
        }}
      >
        <span className="brand-mark">Y</span>
        <span>
          <strong>Yotto</strong>
          <small>{language === "uz" ? "Termizdagi taom maskani" : "Гастропространство Термеза"}</small>
        </span>
      </a>

      <nav className="nav-links">
        <a
          className={currentPath === "/branches" ? "nav-link active" : "nav-link"}
          href={buildAppUrl("/branches")}
          onClick={(event) => {
            event.preventDefault();
            onNavigateBranches();
          }}
        >
          {text.nav.branches}
        </a>
        <a
          className={currentPath === "/menu" ? "nav-link active" : "nav-link"}
          href={buildAppUrl("/menu")}
          onClick={(event) => {
            event.preventDefault();
            onNavigateMenu();
          }}
        >
          {text.nav.menu}
        </a>
        <a
          className={currentPath === "/reservation" ? "nav-link active" : "nav-link"}
          href={buildAppUrl("/reservation")}
          onClick={(event) => {
            event.preventDefault();
            onNavigateReservation();
          }}
        >
          {text.nav.reservation}
        </a>
        <a
          className={currentPath === "/gallery" ? "nav-link active" : "nav-link"}
          href={buildAppUrl("/gallery")}
          onClick={(event) => {
            event.preventDefault();
            onNavigateGallery();
          }}
        >
          {text.nav.gallery}
        </a>
      </nav>

      <div className="header-actions">
        <button className="language-toggle glass-panel" type="button" onClick={onToggleLanguage}>
          <GlobeIcon />
          <span>{text.langShort}</span>
        </button>

        <a className="nav-cta" href={instagramUrl} target="_blank" rel="noreferrer">
          {text.instagram}
        </a>
      </div>
    </header>
  );
}
