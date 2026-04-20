export default function BranchCard({ branch, language, callLabel }) {
  return (
    <article className="branch-card glass-panel" data-reveal>
      <div
        className="branch-card-image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(12, 12, 18, 0.12), rgba(12, 12, 18, 0.76)), url(${branch.image})`,
        }}
      />
      <div className="branch-card-body">
        <div className="branch-card-top">
          <span>{language === "uz" ? branch.badgeUz : branch.badgeRu}</span>
          <strong>{branch.name}</strong>
        </div>
        <p>{language === "uz" ? branch.addressUz : branch.addressRu}</p>
        <small>{language === "uz" ? branch.noteUz : branch.noteRu}</small>
        <a className="soft-btn" href={`tel:${branch.phoneRaw}`}>
          {callLabel}
        </a>
      </div>
    </article>
  );
}
