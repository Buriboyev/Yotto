import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  branches,
  categoryLabels,
  copy,
  images,
  instagramUrl,
  officialMenuBoards,
  serviceModes,
  statusOptions,
  visualMoments,
} from "./data/siteContent";
import { menuCategoryOrder, menuProducts } from "./data/menuProducts";
import { textOverrides } from "./data/textOverrides";
import {
  buildCartKey,
  buildConfiguredCartItem,
  getDefaultSelections,
  groupProductsByCategory,
} from "./lib/menu";
import { buildSearchIndex, getSearchForms } from "./lib/search";
import {
  submitOrder,
  subscribeToOrders,
  updateOrderStatus,
} from "./lib/orders";
import { isFirebaseConfigured } from "./lib/firebase";
import { buildAppUrl, getRouteData } from "./lib/routes";
import AppHeader from "./components/AppHeader";
import AdminPanel from "./components/AdminPanel";
import AuthModal from "./components/AuthModal";
import ImageViewerModal from "./components/ImageViewerModal";
import FooterBar from "./components/FooterBar";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";

const ADMIN_AUTH_KEY = "yotto-admin-auth-v2";
const LANGUAGE_KEY = "yotto-language-v1";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "yotto-admin-2026";
const footerContacts = [
  {
    icon: "telegram",
    href: "https://t.me/yotto_uz",
    external: true,
    title: { ru: "Телеграм-канал", uz: "Telegram kanal" },
    subtitle: { ru: "@yotto_uz", uz: "@yotto_uz" },
  },
  {
    icon: "instagram",
    href: instagramUrl,
    external: true,
    title: { ru: "Инстаграм", uz: "Instagram" },
    subtitle: { ru: "@yotto.uz", uz: "@yotto.uz" },
  },
  {
    icon: "phone",
    href: "tel:+998992660909",
    external: false,
    title: { ru: "Jo'rabayeva", uz: "Jo'rabayeva" },
    subtitle: { ru: "+998 99 266 09 09", uz: "+998 99 266 09 09" },
  },
  {
    icon: "phone",
    href: "tel:+998992660808",
    external: false,
    title: { ru: "Ice Berg", uz: "Ice Berg" },
    subtitle: { ru: "+998 99 266 08 08", uz: "+998 99 266 08 08" },
  },
];

const getDefaultDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
};

const getDisplayBranches = () =>
  branches.map((branch) => {
    if (branch.id === "jorabayeva") {
      return {
        ...branch,
        noteUz:
          "Yotto materiallarida bu joy sushi, tezkor taomlar, pitsa va qarsildoq tovuq menyusiga ega shinam oilaviy maskan sifatida ko'rsatilgan.",
        noteRu:
          "Р’ РјР°С‚РµСЂРёР°Р»Р°С… Yotto СЌС‚Р° С‚РѕС‡РєР° РїРѕРєР°Р·Р°РЅР° РєР°Рє СѓСЋС‚РЅРѕРµ СЃРµРјРµР№РЅРѕРµ РєР°С„Рµ СЃ СЃСѓС€Рё, РїРёС†С†РµР№, Р±С‹СЃС‚СЂС‹РјРё Р±Р»СЋРґР°РјРё Рё С…СЂСѓСЃС‚СЏС‰РµР№ РєСѓСЂРёС†РµР№.",
      };
    }

    if (branch.id === "iceberg") {
      return {
        ...branch,
        badgeUz: "Dam olish formati",
      };
    }

    return branch;
  });

const getDisplayVisualMoments = () =>
  visualMoments.map((item) => {
    if (item.id === "pizza") {
      return {
        ...item,
        titleRu: "РџРёС†С†Р° Рё СЃС‹С‚РЅС‹Рµ Р±Р»СЋРґР°",
        titleUz: "Pitsa va to'yimli taomlar",
        textRu:
          "Р’ Р»РµРЅС‚Рµ СЂРµРіСѓР»СЏСЂРЅРѕ РїРѕСЏРІР»СЏСЋС‚СЃСЏ РїРёС†С†Р°, Р±СѓСЂРіРµСЂС‹, strips, doner, lavash Рё РєРѕРјР±Рѕ-РїРѕР·РёС†РёРё.",
        textUz: "Lentada pitsa, burgerlar, strips, doner, lavash va kombo taomlar muntazam ko'rinadi.",
      };
    }

    return item;
  });

const getLocalizedCategoryLabels = () => ({
  ...categoryLabels,
  fastfood: { ru: "Р‘С‹СЃС‚СЂС‹Рµ Р±Р»СЋРґР° Рё РєСѓСЂРёС†Р°", uz: "Tezkor taomlar va tovuq" },
  pizza: { ru: "РџРёС†С†Р°", uz: "Pitsa" },
  thin: { ru: "РўРѕРЅРєРёРµ СЂРѕР»Р»С‹, СЃСѓС€Рё, РіСѓРЅРєР°РЅС‹", uz: "Yupqa rollar, sushi, gunkan" },
});

const buildProductSearchIndex = (product, branchMap, localizedLabels) =>
  buildSearchIndex(
    product.name,
    product.description,
    localizedLabels[product.category]?.ru,
    localizedLabels[product.category]?.uz,
    ...product.branches.map((branchId) => branchMap[branchId]?.name),
    ...product.options.flatMap((option) => [option.label, option.description]),
  );

const mergeContent = (base, override) => {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base) || Array.isArray(override)) {
    return override;
  }

  if (base && override && typeof base === "object" && typeof override === "object") {
    const keys = new Set([...Object.keys(base), ...Object.keys(override)]);
    return Object.fromEntries(
      Array.from(keys).map((key) => [key, mergeContent(base[key], override[key])]),
    );
  }

  return override;
};

const getInitialForm = () => ({
  serviceType: "reservation",
  branchId: "jorabayeva",
  name: "",
  phone: "",
  guests: "2",
  date: getDefaultDate(),
  time: "19:00",
  address: "",
  notes: "",
});

const formatDateTime = (value, language) =>
  new Intl.DateTimeFormat(language === "uz" ? "uz-UZ" : "ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const fireAlert = async (options) => {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire({
    confirmButtonColor: "#ff7b54",
    ...options,
  });
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => getRouteData(window.location.pathname).path);
  const [pendingScrollTarget, setPendingScrollTarget] = useState(
    () => getRouteData(window.location.pathname).scrollTarget,
  );
  const [language, setLanguage] = useState(() => window.localStorage.getItem(LANGUAGE_KEY) || "ru");
  const [form, setForm] = useState(getInitialForm);
  const [productSelections, setProductSelections] = useState(() => getDefaultSelections(menuProducts));
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState("");
  const [menuCategory, setMenuCategory] = useState("all");
  const [menuBranch, setMenuBranch] = useState("all");
  const [menuSearch, setMenuSearch] = useState("");
  const [boardBranch, setBoardBranch] = useState("jorabayeva");
  const [boardPreview, setBoardPreview] = useState(null);
  const [secretTaps, setSecretTaps] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("all");
  const [adminServiceFilter, setAdminServiceFilter] = useState("all");
  const [adminBranchFilter, setAdminBranchFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const deferredMenuSearch = useDeferredValue(menuSearch);
  const deferredAdminSearch = useDeferredValue(adminSearch);
  const tapTimerRef = useRef(null);
  const currentRoute = getRouteData(currentPath);
  const isMenuRoute = currentRoute.page === "menu";

  const text = useMemo(() => mergeContent(copy[language], textOverrides[language]), [language]);
  const displayBranches = useMemo(() => branches.map((branch) => {
    if (branch.id === "jorabayeva") {
      return {
        ...branch,
        noteUz:
          "Yotto materiallarida bu joy sushi, tezkor taomlar, pitsa va qarsildoq tovuq menyusiga ega shinam oilaviy maskan sifatida ko'rsatilgan.",
        noteRu:
          "В материалах Yotto эта точка показана как уютное семейное кафе с суши, пиццей, быстрыми блюдами и хрустящей курицей.",
      };
    }

    if (branch.id === "iceberg") {
      return {
        ...branch,
        badgeUz: "Dam olish formati",
      };
    }

    return branch;
  }), []);
  const displayVisualMoments = useMemo(() => visualMoments.map((item) => {
    if (item.id === "pizza") {
      return {
        ...item,
        titleRu: "Пицца и сытные блюда",
        titleUz: "Pitsa va to'yimli taomlar",
        textRu: "В ленте регулярно появляются пицца, бургеры, strips, doner, lavash и комбо-позиции.",
        textUz: "Lentada pitsa, burgerlar, strips, doner, lavash va kombo taomlar muntazam ko'rinadi.",
      };
    }

    return item;
  }), []);
  const localizedCategoryLabels = useMemo(() => ({
    ...categoryLabels,
    fastfood: { ru: "Быстрые блюда и курица", uz: "Tezkor taomlar va tovuq" },
    pizza: { ru: "Пицца", uz: "Pitsa" },
    thin: { ru: "Тонкие роллы, суши, гунканы", uz: "Yupqa rollar, sushi, gunkan" },
  }), []);
  const branchMap = useMemo(
    () => Object.fromEntries(displayBranches.map((item) => [item.id, item])),
    [displayBranches],
  );
  const indexedMenuProducts = useMemo(
    () =>
      menuProducts.map((product) => ({
        ...product,
        searchIndex: buildProductSearchIndex(product, branchMap, localizedCategoryLabels),
      })),
    [branchMap, localizedCategoryLabels],
  );
  const selectedItems = useMemo(() => Object.values(cart), [cart]);
  const total = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems],
  );

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    const canonicalUrl = buildAppUrl(window.location.pathname);
    if (window.location.pathname !== canonicalUrl) {
      window.history.replaceState({}, "", canonicalUrl);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToOrders(setOrders);
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = getRouteData(window.location.pathname);
      setCurrentPath(nextRoute.path);
      setPendingScrollTarget(nextRoute.scrollTarget);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.18 },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [currentPath]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setBoardPreview(null);
        setAuthOpen(false);
        setAdminOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!pendingScrollTarget) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const target = document.getElementById(pendingScrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setPendingScrollTarget("");
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [currentPath, pendingScrollTarget]);

  const menuSearchValue = useMemo(() => deferredMenuSearch.trim(), [deferredMenuSearch]);
  const menuSearchForms = useMemo(
    () => getSearchForms(menuSearchValue).filter(Boolean),
    [menuSearchValue],
  );
  const filteredProducts = useMemo(
    () =>
      indexedMenuProducts.filter((product) => {
        const matchesCategory = menuCategory === "all" || product.category === menuCategory;
        const matchesBranch = menuBranch === "all" || product.branches.includes(menuBranch);
        const matchesSearch =
          !menuSearchForms.length ||
          menuSearchForms.some((form) => product.searchIndex.includes(form));

        return matchesCategory && matchesBranch && matchesSearch;
      }),
    [indexedMenuProducts, menuCategory, menuBranch, menuSearchForms],
  );

  const categoryGroups = useMemo(
    () => groupProductsByCategory(filteredProducts, menuCategoryOrder),
    [filteredProducts],
  );
  const hasActiveMenuFilters = useMemo(
    () => menuCategory !== "all" || menuBranch !== "all" || Boolean(menuSearchValue),
    [menuCategory, menuBranch, menuSearchValue],
  );

  const filteredOrders = useMemo(() => {
    const searchValue = deferredAdminSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const branchMatch = adminBranchFilter === "all" || order.branchId === adminBranchFilter;
      const statusMatch = adminStatusFilter === "all" || order.status === adminStatusFilter;
      const serviceMatch = adminServiceFilter === "all" || order.serviceType === adminServiceFilter;
      const matchesSearch =
        !searchValue ||
        order.name?.toLowerCase().includes(searchValue) ||
        order.phone?.toLowerCase().includes(searchValue) ||
        order.orderNumber?.toLowerCase().includes(searchValue);

      return branchMatch && statusMatch && serviceMatch && matchesSearch;
    });
  }, [
    adminBranchFilter,
    adminServiceFilter,
    adminStatusFilter,
    deferredAdminSearch,
    orders,
  ]);

  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => order.id === selectedOrderId) || filteredOrders[0] || null,
    [filteredOrders, selectedOrderId],
  );

  useEffect(() => {
    if (selectedOrder?.id !== selectedOrderId) {
      setSelectedOrderId(selectedOrder?.id || "");
    }
  }, [selectedOrder, selectedOrderId]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === "ru" ? "uz" : "ru"));
  }, []);

  const updateFormField = useCallback((field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }, []);

  const setProductSelection = useCallback((productId, optionId) => {
    setProductSelections((current) => ({
      ...current,
      [productId]: optionId,
    }));
  }, []);

  const changeCartQuantity = useCallback((product, selectedOption, delta) => {
    const cartKey = buildCartKey(product.id, selectedOption.id);

    setCart((current) => {
      const existing = current[cartKey];
      const nextQuantity = (existing?.quantity || 0) + delta;

      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[cartKey];
        return next;
      }

      return {
        ...current,
        [cartKey]: {
          ...(existing || buildConfiguredCartItem(product, selectedOption)),
          quantity: nextQuantity,
        },
      };
    });

    if (delta > 0) {
      setForm((current) =>
        current.serviceType === "reservation"
          ? {
              ...current,
              serviceType: "delivery",
            }
          : current,
      );
    }
  }, []);

  const addToCart = useCallback((product, selectedOption) => {
    changeCartQuantity(product, selectedOption, 1);
  }, [changeCartQuantity]);

  const increaseCart = useCallback((product, selectedOption) => {
    changeCartQuantity(product, selectedOption, 1);
  }, [changeCartQuantity]);

  const decreaseCart = useCallback((product, selectedOption) => {
    changeCartQuantity(product, selectedOption, -1);
  }, [changeCartQuantity]);

  const openAdminAccess = () => {
    if (window.localStorage.getItem(ADMIN_AUTH_KEY) === "granted") {
      setAdminOpen(true);
      setAuthOpen(false);
      return;
    }

    setAdminPassword("");
    setAuthError("");
    setAuthOpen(true);
  };

  const handleFooterTap = () => {
    const nextTapCount = secretTaps + 1;
    setSecretTaps(nextTapCount);

    window.clearTimeout(tapTimerRef.current);
    tapTimerRef.current = window.setTimeout(() => setSecretTaps(0), 1800);

    if (nextTapCount >= 5) {
      setSecretTaps(0);
      openAdminAccess();
    }
  };

  const handleAdminAuth = async (event) => {
    event.preventDefault();

    if (adminPassword === ADMIN_PASSWORD) {
      window.localStorage.setItem(ADMIN_AUTH_KEY, "granted");
      setAuthOpen(false);
      setAdminOpen(true);
      setAuthError("");
      return;
    }

    setAuthError(text.alerts.wrongPassword);
  };

  const logoutAdmin = () => {
    window.localStorage.removeItem(ADMIN_AUTH_KEY);
    setAdminOpen(false);
    setAuthOpen(false);
  };

  const resetFlow = () => {
    setForm(getInitialForm());
    setCart({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      await fireAlert({
        icon: "warning",
        title: text.alerts.required,
      });
      return;
    }

    if (form.serviceType === "delivery" && !form.address.trim()) {
      await fireAlert({
        icon: "warning",
        title: text.alerts.address,
      });
      return;
    }

    if (form.serviceType !== "reservation" && !selectedItems.length && !form.notes.trim()) {
      await fireAlert({
        icon: "warning",
        title:
          language === "uz"
            ? "Kamida bitta taom tanlang yoki izohga buyurtma yozing."
            : "Выбери хотя бы одно блюдо или укажи заказ в комментарии.",
      });
      return;
    }

    const branch = branchMap[form.branchId];
    const orderNumber = `YOTTO-${String(Date.now()).slice(-6)}`;

    try {
      setIsSubmitting(true);

      await submitOrder({
        orderNumber,
        serviceType: form.serviceType,
        branchId: form.branchId,
        location: branch.name,
        name: form.name.trim(),
        phone: form.phone.trim(),
        guests: Number(form.guests || 1),
        date: form.date,
        time: form.time,
        address: form.address.trim(),
        notes: form.notes.trim(),
        items: selectedItems.map((item) => ({
          key: item.key,
          sourceItemId: item.sourceItemId,
          name: item.name,
          baseName: item.baseName,
          optionLabel: item.optionLabel,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        total,
        language,
        source: "website",
        sourceDetail: "yotto grouped product menu",
      });

      await fireAlert({
        icon: "success",
        title:
          form.serviceType === "reservation"
            ? text.alerts.successReservation
            : text.alerts.successOrder,
        text: isFirebaseConfigured ? text.alerts.successTextRealtime : text.alerts.successTextDemo,
      });

      resetFlow();
    } catch (error) {
      await fireAlert({
        icon: "error",
        title: error instanceof Error ? error.message : "Error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setIsUpdatingStatus(id);
      await updateOrderStatus(id, status);
    } finally {
      setIsUpdatingStatus("");
    }
  };

  const navigateTo = useCallback((path, scrollTarget = "") => {
    const nextRoute = getRouteData(path);
    const nextPath = nextRoute.path;
    const nextUrl = buildAppUrl(nextPath);

    if (window.location.pathname !== nextUrl) {
      window.history.pushState({}, "", nextUrl);
    }

    setCurrentPath(nextPath);
    setPendingScrollTarget("");

    const targetId = scrollTarget || nextRoute.scrollTarget;

    if (targetId) {
      window.requestAnimationFrame(() => {
        setPendingScrollTarget(targetId);
      });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const resetMenuFilters = useCallback(() => {
    setMenuSearch("");
    setMenuCategory("all");
    setMenuBranch("all");
  }, []);

  const navigateHome = useCallback(() => navigateTo("/"), [navigateTo]);
  const navigateBranches = useCallback(() => navigateTo("/branches"), [navigateTo]);
  const navigateGallery = useCallback(() => navigateTo("/gallery"), [navigateTo]);
  const navigateMenuPage = useCallback(() => navigateTo("/menu"), [navigateTo]);
  const navigateReservationPage = useCallback(() => navigateTo("/reservation"), [navigateTo]);

  return (
    <>
      <div className="page-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />

        <AppHeader
          text={text}
          language={language}
          currentPath={currentPath}
          instagramUrl={instagramUrl}
          onNavigateHome={navigateHome}
          onNavigateBranches={navigateBranches}
          onNavigateMenu={navigateMenuPage}
          onNavigateReservation={navigateReservationPage}
          onNavigateGallery={navigateGallery}
          onToggleLanguage={toggleLanguage}
        />

        {isMenuRoute ? (
          <MenuPage
            text={text}
            language={language}
            branches={displayBranches}
            branchMap={branchMap}
            categoryLabels={localizedCategoryLabels}
            categoryGroups={categoryGroups}
            menuSearch={menuSearch}
            setMenuSearch={setMenuSearch}
            menuCategory={menuCategory}
            setMenuCategory={setMenuCategory}
            menuBranch={menuBranch}
            setMenuBranch={setMenuBranch}
            boardBranch={boardBranch}
            setBoardBranch={setBoardBranch}
            officialMenuBoards={officialMenuBoards}
            onOpenBoard={setBoardPreview}
            hasActiveFilters={hasActiveMenuFilters}
            onResetFilters={resetMenuFilters}
            productSelections={productSelections}
            cart={cart}
            onSelectOption={setProductSelection}
            onAddToCart={addToCart}
            onIncreaseCart={increaseCart}
            onDecreaseCart={decreaseCart}
            form={form}
            updateFormField={updateFormField}
            handleSubmit={handleSubmit}
            selectedItems={selectedItems}
            total={total}
            isFirebaseConfigured={isFirebaseConfigured}
            isSubmitting={isSubmitting}
            onScrollToMenu={navigateMenuPage}
          />
        ) : (
          <HomePage
            text={text}
            language={language}
            heroImage={images.hero}
            branches={displayBranches}
            visualMoments={displayVisualMoments}
            onScrollToReservation={navigateReservationPage}
            onScrollToMenu={navigateMenuPage}
          />
        )}

        <FooterBar
          language={language}
          footerText={text.footer}
          contacts={footerContacts}
          onSecretTap={handleFooterTap}
        />
      </div>

      <AdminPanel
        adminOpen={adminOpen}
        closeAdmin={() => setAdminOpen(false)}
        language={language}
        text={text}
        branches={displayBranches}
        orders={filteredOrders}
        selectedOrder={selectedOrder}
        selectedOrderId={selectedOrderId}
        setSelectedOrderId={setSelectedOrderId}
        adminSearch={adminSearch}
        setAdminSearch={setAdminSearch}
        adminStatusFilter={adminStatusFilter}
        setAdminStatusFilter={setAdminStatusFilter}
        adminServiceFilter={adminServiceFilter}
        setAdminServiceFilter={setAdminServiceFilter}
        adminBranchFilter={adminBranchFilter}
        setAdminBranchFilter={setAdminBranchFilter}
        branchMap={branchMap}
        statusOptions={statusOptions}
        serviceModes={serviceModes}
        isFirebaseConfigured={isFirebaseConfigured}
        isUpdatingStatus={isUpdatingStatus}
        handleStatusChange={handleStatusChange}
        logoutAdmin={logoutAdmin}
        formatDateTime={formatDateTime}
      />

      <AuthModal
        authOpen={authOpen}
        closeAuth={() => setAuthOpen(false)}
        text={text}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        authError={authError}
        handleAdminAuth={handleAdminAuth}
      />

      <ImageViewerModal boardPreview={boardPreview} closePreview={() => setBoardPreview(null)} />
    </>
  );
}
