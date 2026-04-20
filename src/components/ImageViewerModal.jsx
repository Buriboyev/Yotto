import { CloseIcon } from "./icons";

export default function ImageViewerModal({ boardPreview, closePreview }) {
  return (
    <div className={boardPreview ? "modal-shell open" : "modal-shell"}>
      <button className="modal-backdrop" type="button" onClick={closePreview} />

      {boardPreview ? (
        <div className="image-viewer glass-panel">
          <div className="image-viewer-head">
            <strong>{boardPreview.title}</strong>
            <button className="icon-btn" type="button" onClick={closePreview}>
              <CloseIcon />
            </button>
          </div>
          <img src={boardPreview.image} alt={boardPreview.title} />
        </div>
      ) : null}
    </div>
  );
}
