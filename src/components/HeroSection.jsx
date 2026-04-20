export default function HeroSection({ text, language, heroImage, onScrollToReservation, onScrollToMenu }) {
  return (
    <section className="hero" id="home">
      <div className="hero-copy" data-reveal>
        <span className="hero-chip glass-panel">{text.hero.eyebrow}</span>
        <h1>{text.hero.title}</h1>
        <p>{text.hero.description}</p>

        <div className="hero-actions">
          <button className="primary-btn" type="button" onClick={onScrollToReservation}>
            {text.hero.primaryAction}
          </button>
          <button className="ghost-btn" type="button" onClick={onScrollToMenu}>
            {text.hero.secondaryAction}
          </button>
        </div>

        <div className="hero-stats">
          {text.hero.stats.map((item) => (
            <article key={item.label} className="metric-card glass-panel">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-visual" data-reveal>
        <div className="hero-device glass-panel">
          <div className="device-head">
            <span className="device-pill" />
            <p>@yotto.uz</p>
          </div>

          <div
            className="hero-image"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(7, 8, 14, 0.1), rgba(7, 8, 14, 0.72)), url(${heroImage})`,
            }}
          />

          <div className="hero-overlay glass-panel">
            <span>{language === "uz" ? "Rasmiy filiallar" : "Официальные филиалы"}</span>
            <strong>Jo'rabayeva / Ice Berg</strong>
            <small>
              {language === "uz"
                ? "Bron, yetkazib berish va olib ketish uchun qulay sahifa tayyorlandi."
                : "Для брони, доставки и самовывоза подготовлена удобная страница."}
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
