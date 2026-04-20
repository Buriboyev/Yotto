const cyrillicToLatinMap = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "j",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ъ: "",
  ы: "i",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  қ: "q",
  ғ: "g",
  ў: "o",
  ҳ: "h",
};

const aliasGroups = [
  ["pizza", "pitsa", "pitstsa", "пицца"],
  ["burger", "бургер"],
  ["cheeseburger", "chizburger", "чизбургер"],
  ["cheese", "chiz", "сыр"],
  ["twister", "tvister", "твистер"],
  ["lavash", "лаваш"],
  ["doner", "донер", "шаурма"],
  ["combo", "kombo", "комбо"],
  ["sandwich", "sendvich", "сэндвич"],
  ["hotdog", "hot dog", "hot-dog", "хотдог"],
  ["fries", "fri", "фри", "картошка фри"],
  ["chicken", "kuritsa", "tovuq", "курица"],
  ["roll", "rolls", "ролл", "роллы"],
  ["sushi", "суши"],
  ["gunkan", "гункан"],
  ["tempura", "темпура"],
  ["set", "sets", "setlar", "сет", "сеты", "набор"],
  ["salad", "salat", "салат"],
  ["sauce", "sous", "соус"],
  ["philadelphia", "filadelfiya", "филадельфия"],
  ["california", "kaliforniya", "калифорния"],
  ["caesar", "sezar", "tsezar", "цезарь"],
  ["ice berg", "iceberg", "aysberg", "айсберг"],
  ["jorabayeva", "jurabayeva", "журабаева", "джурабаева"],
];

const transliterateCyrillic = (value = "") =>
  Array.from(value.toLowerCase())
    .map((char) => cyrillicToLatinMap[char] ?? char)
    .join("");

export const normalizeSearchText = (value = "") =>
  transliterateCyrillic(String(value))
    .replace(/['\u2019\u02bb\u02bc]/g, "")
    .replace(/[`]/g, "")
    .replace(/[-_/]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getSearchForms = (value = "") => {
  const forms = new Set([normalizeSearchText(value)].filter(Boolean));
  let expanded = true;

  while (expanded) {
    expanded = false;

    aliasGroups.forEach((group) => {
      const normalizedGroup = group.map((item) => normalizeSearchText(item));
      const hasMatch = normalizedGroup.some((alias) =>
        Array.from(forms).some((form) => form.includes(alias) || alias.includes(form)),
      );

      if (!hasMatch) {
        return;
      }

      normalizedGroup.forEach((alias) => {
        if (alias && !forms.has(alias)) {
          forms.add(alias);
          expanded = true;
        }
      });
    });
  }

  return Array.from(forms);
};

export const buildSearchIndex = (...parts) => {
  const forms = new Set();

  parts.flat().forEach((part) => {
    getSearchForms(part).forEach((form) => {
      if (form) {
        forms.add(form);
      }
    });
  });

  return Array.from(forms).join(" ");
};

export const matchesSearchQuery = (searchIndex, query) => {
  if (!normalizeSearchText(query)) {
    return true;
  }

  return getSearchForms(query).some((form) => form && searchIndex.includes(form));
};
