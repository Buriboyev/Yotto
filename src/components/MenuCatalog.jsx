import { memo } from "react";
import SectionHeading from "./SectionHeading";
import SelectField from "./SelectField";
import { formatCurrency } from "../lib/orders";
import { getSelectedOption } from "../lib/menu";

const boardTitleMap = {
  "ice-1": { ru: "Быстрые блюда и курица", uz: "Tezkor taomlar va tovuq" },
  "ice-2": { ru: "Комбо, лаваш и десерты", uz: "Kombo, lavash va desertlar" },
  "ice-3": { ru: "Меню пиццы", uz: "Pitsa menyusi" },
  "jor-1": { ru: "Быстрые блюда и курица", uz: "Tezkor taomlar va tovuq" },
  "jor-2": { ru: "Меню пиццы", uz: "Pitsa menyusi" },
  "jor-3": { ru: "Салаты", uz: "Salatlar" },
  "jor-4": { ru: "Классические роллы", uz: "Klassik rollar" },
  "jor-5": { ru: "Темпура и запеченные роллы", uz: "Tempura va pishirilgan rollar" },
  "jor-6": { ru: "Тонкие роллы, суши и гунканы", uz: "Yupqa rollar, sushi va gunkan" },
  "jor-7": { ru: "Сеты, часть 1", uz: "Setlar 1-qism" },
  "jor-8": { ru: "Сеты, часть 2", uz: "Setlar 2-qism" },
};

const ProductCard = memo(function ProductCard({
  product,
  language,
  label,
  addLabel,
  branchMap,
  selectedOptionId,
  quantity,
  onSelectOption,
  onAdd,
  onIncrease,
  onDecrease,
}) {
  const selectedOption = getSelectedOption(product, selectedOptionId);
  const optionLabel = product.optionLabel?.[language];

  return (
    <article className="dish-card glass-panel">
      <div className="dish-card-image" style={{ backgroundImage: `url(${product.image})` }} />

      <div className="dish-card-body">
        <div className="dish-meta-line">
          <span>{label}</span>
          <strong>{selectedOption.priceLabel || formatCurrency(selectedOption.price)}</strong>
        </div>

        <h3>{product.name}</h3>
        <p>{selectedOption.description || product.description || branchMap[product.branches[0]]?.name}</p>

        {product.options.length > 1 ? (
          <div className="product-option-block">
            <span className="product-option-label">{optionLabel}</span>

            {product.optionDisplay === "chips" && product.options.length <= 4 ? (
              <div className="chip-row">
                {product.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={selectedOption.id === option.id ? "mini-chip active" : "mini-chip"}
                    onClick={() => onSelectOption(product.id, option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <SelectField className="compact-select"
                value={selectedOption.id}
                onChange={(event) => onSelectOption(product.id, event.target.value)}
              >
                {product.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} - {option.priceLabel || formatCurrency(option.price)}
                  </option>
                ))}
              </SelectField>
            )}

            <small className="product-selected-copy">
              {selectedOption.label} - {selectedOption.priceLabel || formatCurrency(selectedOption.price)}
            </small>
          </div>
        ) : null}

        <div className="dish-branches">
          {product.branches.map((branchId) => (
            <span key={branchId} className="tag-chip">
              {branchMap[branchId]?.name}
            </span>
          ))}
        </div>

        <div className="dish-card-actions">
          <div className="qty-controller">
            <button
              type="button"
              onClick={() => onDecrease(product, selectedOption)}
              aria-label={`Minus ${product.name}`}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => onIncrease(product, selectedOption)}
              aria-label={`Plus ${product.name}`}
            >
              +
            </button>
          </div>

          <button className="soft-btn" type="button" onClick={() => onAdd(product, selectedOption)}>
            {addLabel}
          </button>
        </div>
      </div>
    </article>
  );
});

export default function MenuCatalog({
  text,
  language,
  branches,
  branchMap,
  categoryLabels,
  categoryGroups,
  menuSearch,
  setMenuSearch,
  menuCategory,
  setMenuCategory,
  menuBranch,
  setMenuBranch,
  boardBranch,
  setBoardBranch,
  officialMenuBoards,
  onOpenBoard,
  hasActiveFilters,
  onResetFilters,
  productSelections,
  cart,
  onSelectOption,
  onAddToCart,
  onIncreaseCart,
  onDecreaseCart,
}) {
  const activeBoardBranch = branches.find((branch) => branch.id === boardBranch);
  const getBoardTitle = (board) => boardTitleMap[board.id]?.[language] || board.title;
  const emptyTitle = language === "uz" ? "Hech narsa topilmadi" : "Ничего не найдено";
  const emptyText =
    language === "uz"
      ? "Qidiruv yoki filtrlar bo'yicha mos taom topilmadi. So'rovni o'zgartiring yoki filtrlarni tozalang."
      : "По текущему запросу или фильтрам подходящие блюда не найдены. Измени запрос или сбрось фильтры.";
  const resetLabel = language === "uz" ? "Filtrlarni tozalash" : "Сбросить фильтры";

  return (
    <section className="content-section" id="menu">
      <SectionHeading eyebrow={text.menu.eyebrow} title={text.menu.title} text={text.menu.text} />

      <div className="menu-toolbar glass-panel" data-reveal>
        <input
          value={menuSearch}
          onChange={(event) => setMenuSearch(event.target.value)}
          placeholder={text.menu.searchPlaceholder}
        />

        <SelectField value={menuCategory} onChange={(event) => setMenuCategory(event.target.value)}>
          <option value="all">{text.menu.allCategories}</option>
          {Object.entries(categoryLabels).map(([key, value]) => (
            <option key={key} value={key}>
              {value[language]}
            </option>
          ))}
        </SelectField>

        <SelectField value={menuBranch} onChange={(event) => setMenuBranch(event.target.value)}>
          <option value="all">{text.menu.allBranches}</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="menu-section-stack">
        {categoryGroups.length ? (
          categoryGroups.map(([category, products]) => (
            <section key={category} className="menu-category-section">
              <div className="menu-category-head">
                <div>
                  <span className="section-eyebrow">{categoryLabels[category][language]}</span>
                  <h3>{categoryLabels[category][language]}</h3>
                </div>
                <strong>{products.length}</strong>
              </div>

              <div className="dish-grid">
                {products.map((product) => {
                  const selectedOptionId = productSelections[product.id];
                  const selectedOption = getSelectedOption(product, selectedOptionId);
                  const cartKey = `${product.id}::${selectedOption.id}`;
                  const quantity = cart[cartKey]?.quantity || 0;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      language={language}
                      label={categoryLabels[category][language]}
                      addLabel={text.menu.add}
                      branchMap={branchMap}
                      selectedOptionId={selectedOptionId}
                      quantity={quantity}
                      onSelectOption={onSelectOption}
                      onAdd={onAddToCart}
                      onIncrease={onIncreaseCart}
                      onDecrease={onDecreaseCart}
                    />
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="menu-empty-state glass-panel">
            <h3>{emptyTitle}</h3>
            <p>{emptyText}</p>
            {hasActiveFilters ? (
              <button className="soft-btn" type="button" onClick={onResetFilters}>
                {resetLabel}
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div className="board-section">
        <SectionHeading
          eyebrow={text.menu.officialBoards}
          title={text.menu.officialBoards}
          text={text.menu.officialBoardsText}
        />

        <div className="board-switcher glass-panel" data-reveal>
          {branches.map((branch) => (
            <button
              key={branch.id}
              type="button"
              className={boardBranch === branch.id ? "segment active" : "segment"}
              onClick={() => setBoardBranch(branch.id)}
            >
              {branch.name}
            </button>
          ))}
        </div>

        <div className="board-grid">
          {officialMenuBoards[boardBranch].map((board) => (
            <article key={board.id} className="board-card glass-panel">
              <div className="board-card-image" style={{ backgroundImage: `url(${board.image})` }} />

              <div className="board-card-body">
                <div>
                  <h3>{getBoardTitle(board)}</h3>
                  <small>{activeBoardBranch?.name}</small>
                </div>

                <button
                  className="soft-btn"
                  type="button"
                  onClick={() => onOpenBoard({ ...board, title: getBoardTitle(board) })}
                >
                  {text.menu.openBoard}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
