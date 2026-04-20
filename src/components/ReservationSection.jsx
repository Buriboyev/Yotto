import SectionHeading from "./SectionHeading";
import { formatCurrency } from "../lib/orders";

const guestOptions = [2, 4, 6, 8, 10];
const quickTimes = ["12:00", "14:00", "17:00", "19:00", "21:00"];

export default function ReservationSection({
  text,
  language,
  branches,
  branchMap,
  form,
  updateFormField,
  handleSubmit,
  selectedItems,
  total,
  isFirebaseConfigured,
  isSubmitting,
  onScrollToMenu,
}) {
  return (
    <section className="content-section reservation-layout" id="reservation">
      <div>
        <SectionHeading
          eyebrow={text.reservation.eyebrow}
          title={text.reservation.title}
          text={text.reservation.text}
        />

        <form className="reservation-form glass-panel" onSubmit={handleSubmit} data-reveal>
          <div className="segment-control">
            {[
              { value: "reservation", label: language === "uz" ? "Bron" : "Бронь" },
              { value: "delivery", label: language === "uz" ? "Yetkazib berish" : "Доставка" },
              { value: "pickup", label: language === "uz" ? "Olib ketish" : "Самовывоз" },
            ].map((mode) => (
              <button
                key={mode.value}
                type="button"
                className={form.serviceType === mode.value ? "segment active" : "segment"}
                onClick={() => updateFormField("serviceType", mode.value)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="branch-picker">
            <span>{text.reservation.branchLabel}</span>
            <div className="branch-picker-grid">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  className={form.branchId === branch.id ? "branch-option active" : "branch-option"}
                  onClick={() => updateFormField("branchId", branch.id)}
                >
                  <strong>{branch.name}</strong>
                  <small>{language === "uz" ? branch.addressUz : branch.addressRu}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="quick-picks">
            <div>
              <span>{text.reservation.guestChips}</span>
              <div className="chip-row">
                {guestOptions.map((guest) => (
                  <button
                    key={guest}
                    type="button"
                    className={String(guest) === form.guests ? "mini-chip active" : "mini-chip"}
                    onClick={() => updateFormField("guests", String(guest))}
                  >
                    {guest}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span>{text.reservation.timeChips}</span>
              <div className="chip-row">
                {quickTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={time === form.time ? "mini-chip active" : "mini-chip"}
                    onClick={() => updateFormField("time", time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-grid">
            <label>
              <span>{text.reservation.name}</span>
              <input
                value={form.name}
                onChange={(event) => updateFormField("name", event.target.value)}
                placeholder={language === "uz" ? "Masalan, Madina" : "Например, Madina"}
              />
            </label>

            <label>
              <span>{text.reservation.phone}</span>
              <input
                value={form.phone}
                onChange={(event) => updateFormField("phone", event.target.value)}
                placeholder="+998 90 000 00 00"
              />
            </label>

            <label>
              <span>{text.reservation.date}</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateFormField("date", event.target.value)}
              />
            </label>

            <label>
              <span>{text.reservation.time}</span>
              <input
                type="time"
                value={form.time}
                onChange={(event) => updateFormField("time", event.target.value)}
              />
            </label>

            <label>
              <span>{text.reservation.guests}</span>
              <input
                type="number"
                min="1"
                max="20"
                value={form.guests}
                onChange={(event) => updateFormField("guests", event.target.value)}
              />
            </label>

            {form.serviceType === "delivery" ? (
              <label>
                <span>{text.reservation.address}</span>
                <input
                  value={form.address}
                  onChange={(event) => updateFormField("address", event.target.value)}
                  placeholder={text.reservation.addressPlaceholder}
                />
              </label>
            ) : (
              <div className="form-placeholder glass-subpanel">
                <strong>{branchMap[form.branchId].name}</strong>
                <p>
                  {language === "uz"
                    ? branchMap[form.branchId].addressUz
                    : branchMap[form.branchId].addressRu}
                </p>
              </div>
            )}

            <label className="full-width">
              <span>{text.reservation.notes}</span>
              <textarea
                rows="4"
                value={form.notes}
                onChange={(event) => updateFormField("notes", event.target.value)}
                placeholder={text.reservation.notesPlaceholder}
              />
            </label>
          </div>

          <div className="form-footer">
            <div>
              <strong>
                {form.serviceType === "reservation"
                  ? text.reservation.submitReservation
                  : `${text.reservation.totalLabel}: ${formatCurrency(total)}`}
              </strong>
              <p>
                {isFirebaseConfigured
                  ? text.reservation.firebaseReady
                  : text.reservation.firebaseDemo}
              </p>
            </div>

            <button className="primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? language === "uz"
                  ? "Yuborilmoqda..."
                  : "Отправка..."
                : form.serviceType === "reservation"
                  ? text.reservation.submitReservation
                  : text.reservation.submitOrder}
            </button>
          </div>
        </form>
      </div>

      <aside className="cart-panel glass-panel" data-reveal>
        <div className="cart-head">
          <span>{text.reservation.summary}</span>
          <strong>
            {selectedItems.length ? formatCurrency(total) : text.reservation.summaryEmpty}
          </strong>
        </div>

        {selectedItems.length ? (
          <div className="cart-list">
            {selectedItems.map((item) => (
              <article key={item.key} className="cart-item">
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.quantity} x {item.priceLabel || formatCurrency(item.price)}
                  </p>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </article>
            ))}
          </div>
        ) : (
          <div className="cart-empty">
            <h3>{text.reservation.summaryEmpty}</h3>
            <p>{text.reservation.summaryHint}</p>
            <button className="soft-btn" type="button" onClick={onScrollToMenu}>
              {language === "uz" ? "Menyuga o'tish" : "Перейти к меню"}
            </button>
          </div>
        )}

        <div className="cart-note">
          <span>{isFirebaseConfigured ? (language === "uz" ? "Onlayn" : "Онлайн") : (language === "uz" ? "Sinov" : "Тест")}</span>
          <p>
            {isFirebaseConfigured
              ? language === "uz"
                ? "Buyurtma yuborilgach, u tizimda darhol paydo bo'ladi va kompyuterdan ko'rinadi."
                : "После отправки заказ сразу появляется в системе и виден с компьютера."
              : language === "uz"
                ? "Kalitlar qo'shilmaguncha buyurtmalar shu qurilmada sinov rejimida saqlanadi."
                : "Пока ключи не подключены, заказы сохраняются локально в тестовом режиме."}
          </p>
        </div>
      </aside>
    </section>
  );
}
