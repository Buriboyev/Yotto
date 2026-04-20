import { CloseIcon } from "./icons";
import SelectField from "./SelectField";
import { formatCurrency } from "../lib/orders";

export default function AdminPanel({
  adminOpen,
  closeAdmin,
  language,
  text,
  branches,
  orders,
  selectedOrder,
  selectedOrderId,
  setSelectedOrderId,
  adminSearch,
  setAdminSearch,
  adminStatusFilter,
  setAdminStatusFilter,
  adminServiceFilter,
  setAdminServiceFilter,
  adminBranchFilter,
  setAdminBranchFilter,
  branchMap,
  statusOptions,
  serviceModes,
  isFirebaseConfigured,
  isUpdatingStatus,
  handleStatusChange,
  logoutAdmin,
  formatDateTime,
}) {
  const openOrders = orders.filter((order) => order.status !== "done");
  const doneOrders = orders.filter((order) => order.status === "done");
  const reservations = orders.filter((order) => order.serviceType === "reservation");
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  const getStatusLabel = (value) => {
    const match = statusOptions.find((item) => item.value === value);
    return language === "uz" ? match?.labelUz || value : match?.labelRu || value;
  };

  const getServiceLabel = (value) => {
    const match = serviceModes.find((item) => item.value === value);
    return language === "uz" ? match?.labelUz || value : match?.labelRu || value;
  };

  return (
    <div className={adminOpen ? "admin-shell open" : "admin-shell"} aria-hidden={!adminOpen}>
      <button className="modal-backdrop" type="button" onClick={closeAdmin} />

      <aside className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="section-eyebrow">{text.admin.title}</span>
            <h3>{text.admin.subtitle}</h3>
          </div>

          <div className="admin-head-actions">
            <span className="mode-pill">
              {isFirebaseConfigured ? text.admin.modeRealtime : text.admin.modeDemo}
            </span>
            <button className="icon-btn" type="button" onClick={logoutAdmin}>
              {text.admin.logout}
            </button>
            <button className="icon-btn" type="button" onClick={closeAdmin} aria-label={text.admin.close}>
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="admin-metrics">
          <article className="metric-card glass-panel">
            <strong>{openOrders.length}</strong>
            <span>{text.admin.openOrders}</span>
          </article>
          <article className="metric-card glass-panel">
            <strong>{doneOrders.length}</strong>
            <span>{text.admin.completed}</span>
          </article>
          <article className="metric-card glass-panel">
            <strong>{reservations.length}</strong>
            <span>{text.admin.reservations}</span>
          </article>
          <article className="metric-card glass-panel">
            <strong>{formatCurrency(revenue)}</strong>
            <span>{text.admin.revenue}</span>
          </article>
        </div>

        <div className="admin-filters glass-panel">
          <input
            value={adminSearch}
            onChange={(event) => setAdminSearch(event.target.value)}
            placeholder={text.admin.search}
          />

          <SelectField value={adminStatusFilter} onChange={(event) => setAdminStatusFilter(event.target.value)}>
            <option value="all">{text.admin.allStatuses}</option>
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {language === "uz" ? item.labelUz : item.labelRu}
              </option>
            ))}
          </SelectField>

          <SelectField value={adminServiceFilter} onChange={(event) => setAdminServiceFilter(event.target.value)}>
            <option value="all">{text.admin.allServices}</option>
            {serviceModes.map((item) => (
              <option key={item.value} value={item.value}>
                {language === "uz" ? item.labelUz : item.labelRu}
              </option>
            ))}
          </SelectField>

          <SelectField value={adminBranchFilter} onChange={(event) => setAdminBranchFilter(event.target.value)}>
            <option value="all">{text.menu.allBranches}</option>
            {branches.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="admin-content">
          <div className="admin-order-list glass-panel">
            {orders.length ? (
              orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className={order.id === selectedOrderId ? "order-list-item active" : "order-list-item"}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <div className="order-list-top">
                    <span className={`status-pill status-${order.status}`}>{getStatusLabel(order.status)}</span>
                    <strong>{order.orderNumber || "YOTTO"}</strong>
                  </div>
                  <p>
                    {order.name} · {order.phone}
                  </p>
                  <div className="order-list-bottom">
                    <small>{branchMap[order.branchId]?.name || order.location}</small>
                    <strong>
                      {order.serviceType === "reservation"
                        ? language === "uz"
                          ? "Bron"
                          : "Бронь"
                        : formatCurrency(order.total || 0)}
                    </strong>
                  </div>
                </button>
              ))
            ) : (
              <div className="admin-empty">{text.admin.noOrders}</div>
            )}
          </div>

          <div className="admin-order-detail glass-panel">
            {selectedOrder ? (
              <>
                <div className="admin-detail-head">
                  <div>
                    <span className={`status-pill status-${selectedOrder.status}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                    <h3>{selectedOrder.orderNumber || "YOTTO"}</h3>
                    <p>
                      {selectedOrder.name} · {selectedOrder.phone}
                    </p>
                  </div>
                  <strong>
                    {selectedOrder.serviceType === "reservation"
                      ? language === "uz"
                        ? "Bron"
                        : "Бронь"
                      : formatCurrency(selectedOrder.total || 0)}
                  </strong>
                </div>

                <div className="admin-spec-grid">
                  <div>
                    <span>{text.admin.branch}</span>
                    <strong>{branchMap[selectedOrder.branchId]?.name || selectedOrder.location}</strong>
                  </div>
                  <div>
                    <span>{text.admin.service}</span>
                    <strong>{getServiceLabel(selectedOrder.serviceType)}</strong>
                  </div>
                  <div>
                    <span>{text.admin.guestCount}</span>
                    <strong>{selectedOrder.guests || 1}</strong>
                  </div>
                  <div>
                    <span>{text.admin.orderTime}</span>
                    <strong>
                      {selectedOrder.date} · {selectedOrder.time}
                    </strong>
                  </div>
                </div>

                {selectedOrder.address ? (
                  <div className="admin-note-box">
                    <span>{text.admin.address}</span>
                    <p>{selectedOrder.address}</p>
                  </div>
                ) : null}

                {selectedOrder.notes ? (
                  <div className="admin-note-box">
                    <span>{text.admin.notes}</span>
                    <p>{selectedOrder.notes}</p>
                  </div>
                ) : null}

                <div className="admin-note-box">
                  <span>{text.admin.items}</span>
                  {selectedOrder.items?.length ? (
                    <div className="order-items">
                      {selectedOrder.items.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="order-item-chip">
                          {item.name} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{language === "uz" ? "Savatsiz buyurtma yoki faqat bron." : "Без корзины или только бронь."}</p>
                  )}
                </div>

                <div className="admin-status-row">
                  {statusOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={selectedOrder.status === item.value ? "status-btn active" : "status-btn"}
                      disabled={isUpdatingStatus === selectedOrder.id}
                      onClick={() => handleStatusChange(selectedOrder.id, item.value)}
                    >
                      {language === "uz" ? item.labelUz : item.labelRu}
                    </button>
                  ))}
                </div>

                <small className="admin-time-note">
                  {formatDateTime(selectedOrder.createdAt, language)}
                </small>
              </>
            ) : (
              <div className="admin-empty">{text.admin.noSelection}</div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
