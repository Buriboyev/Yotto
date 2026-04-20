import { InstagramIcon, PhoneIcon, TelegramIcon } from "./icons";

const iconMap = {
  telegram: TelegramIcon,
  phone: PhoneIcon,
  instagram: InstagramIcon,
};

export default function FooterBar({ language, footerText, contacts, onSecretTap }) {
  return (
    <footer className="footer-shell glass-panel" onClick={onSecretTap}>
      <div className="footer-copy">
        <strong>Yotto</strong>
        <p>{footerText}</p>
      </div>

      <div className="footer-links">
        {contacts.map((contact) => {
          const Icon = iconMap[contact.icon];

          return (
            <a
              key={contact.href}
              className="footer-link glass-subpanel"
              href={contact.href}
              target={contact.external ? "_blank" : undefined}
              rel={contact.external ? "noreferrer" : undefined}
              onClick={(event) => event.stopPropagation()}
            >
              <span className="footer-link-icon">{Icon ? <Icon /> : null}</span>
              <span className="footer-link-copy">
                <strong>{contact.title[language]}</strong>
                <small>{contact.subtitle[language]}</small>
              </span>
            </a>
          );
        })}
      </div>
    </footer>
  );
}
