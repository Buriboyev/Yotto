import SectionHeading from "../components/SectionHeading";
import BranchCard from "../components/BranchCard";
import HeroSection from "../components/HeroSection";
import VisualGallery from "../components/VisualGallery";

export default function HomePage({
  text,
  language,
  heroImage,
  branches,
  visualMoments,
  onScrollToReservation,
  onScrollToMenu,
}) {
  return (
    <main>
      <HeroSection
        text={text}
        language={language}
        heroImage={heroImage}
        onScrollToReservation={onScrollToReservation}
        onScrollToMenu={onScrollToMenu}
      />

      <section className="content-section" id="branches">
        <SectionHeading
          eyebrow={text.branchSection.eyebrow}
          title={text.branchSection.title}
          text={text.branchSection.text}
        />

        <div className="branch-grid">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              language={language}
              callLabel={text.branchSection.callLabel}
            />
          ))}
        </div>
      </section>

      <VisualGallery text={text} language={language} visualMoments={visualMoments} />
    </main>
  );
}
