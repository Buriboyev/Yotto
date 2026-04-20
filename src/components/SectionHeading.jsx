export default function SectionHeading({ eyebrow, title, text, centered = false }) {
  return (
    <div className={centered ? "section-heading centered" : "section-heading"} data-reveal>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
