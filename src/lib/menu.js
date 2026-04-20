export const getDefaultSelections = (products) =>
  Object.fromEntries(products.map((product) => [product.id, product.options[0]?.id || ""]));

export const getSelectedOption = (product, selectedOptionId) =>
  product.options.find((option) => option.id === selectedOptionId) || product.options[0];

export const getProductPriceFrom = (product) =>
  Math.min(...product.options.map((option) => option.price));

export const buildCartKey = (productId, optionId) => `${productId}::${optionId}`;

export const buildConfiguredCartItem = (product, selectedOption) => ({
  key: buildCartKey(product.id, selectedOption.id),
  productId: product.id,
  sourceItemId: selectedOption.sourceItemId,
  name:
    product.options.length > 1
      ? `${product.name} - ${selectedOption.label}`
      : product.name,
  baseName: product.name,
  optionLabel: selectedOption.label,
  image: product.image,
  category: product.category,
  branches: product.branches,
  price: selectedOption.price,
  priceLabel: selectedOption.priceLabel,
  quantity: 1,
});

export const groupProductsByCategory = (products, categoryOrder) => {
  const map = new Map();

  categoryOrder.forEach((category) => map.set(category, []));
  products.forEach((product) => {
    if (!map.has(product.category)) {
      map.set(product.category, []);
    }

    map.get(product.category).push(product);
  });

  return Array.from(map.entries()).filter(([, items]) => items.length);
};
