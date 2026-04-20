import AdminAccessCard from "./AdminAccessCard";

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
      <AdminAccessCard
        text={text}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        authError={authError}
        handleAdminAuth={handleAdminAuth}
        onClose={closeAuth}
        showCloseButton
      />
    </div>
  );
}
