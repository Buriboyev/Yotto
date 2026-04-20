import SectionHeading from "./SectionHeading";

export default function VisualGallery({ text, language, visualMoments }) {
  return (
    <section className="content-section" id="gallery">
      <SectionHeading
        eyebrow={text.stories.eyebrow}
        title={text.stories.title}
        text={text.stories.text}
      />

      <div className="visual-grid">
        {visualMoments.map((item) => (
          <article key={item.id} className="visual-card glass-panel" data-reveal>
            <div
              className="visual-card-image"
              style={{
                backgroundImage: `linear-gradient(180deg, transparent, rgba(7, 8, 14, 0.7)), url(${item.image})`,
              }}
            />
            <div className="visual-card-copy">
              <h3>{language === "uz" ? item.titleUz : item.titleRu}</h3>
              <p>{language === "uz" ? item.textUz : item.textRu}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
