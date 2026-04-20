import { CloseIcon, LockIcon } from "./icons";

export default function AdminAccessCard({
  text,
  adminPassword,
  setAdminPassword,
  authError,
  handleAdminAuth,
  onClose,
  showCloseButton = false,
}) {
  return (
    <div className="auth-card glass-panel admin-access-card">
      <div className="auth-card-head">
        <LockIcon />
        <div>
          <h3>{text.admin.unlockTitle}</h3>
          <p>{text.admin.unlockText}</p>
        </div>
        {showCloseButton ? (
          <button className="icon-btn" type="button" onClick={onClose} aria-label={text.admin.close}>
            <CloseIcon />
          </button>
        ) : null}
      </div>

      <form className="auth-form" onSubmit={handleAdminAuth}>
        <label>
          <span>{text.admin.passwordLabel}</span>
          <input
            type="password"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            placeholder={text.admin.passwordPlaceholder}
          />
        </label>

        {authError ? <small className="auth-error">{authError}</small> : null}

        <button className="primary-btn" type="submit">
          {text.admin.open}
        </button>
      </form>
    </div>
  );
}
