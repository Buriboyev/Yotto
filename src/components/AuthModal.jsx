import { CloseIcon, LockIcon } from "./icons";

export default function AuthModal({
  authOpen,
  closeAuth,
  text,
  adminPassword,
  setAdminPassword,
  authError,
  handleAdminAuth,
}) {
  return (
    <div className={authOpen ? "modal-shell open" : "modal-shell"}>
      <button className="modal-backdrop" type="button" onClick={closeAuth} />
      <div className="auth-card glass-panel">
        <div className="auth-card-head">
          <LockIcon />
          <div>
            <h3>{text.admin.unlockTitle}</h3>
            <p>{text.admin.unlockText}</p>
          </div>
          <button className="icon-btn" type="button" onClick={closeAuth}>
            <CloseIcon />
          </button>
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
    </div>
  );
}
