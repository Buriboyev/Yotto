import { getDb, isFirebaseConfigured } from "./firebase";

const STORAGE_KEY = "yotto-orders-local-v1";

const readLocalOrders = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocalOrders = (orders) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

const normalizeTime = (value) => {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  return new Date().toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  }).format(value);

export const submitOrder = async (payload) => {
  const order = {
    ...payload,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured) {
    const [db, firestore] = await Promise.all([getDb(), import("firebase/firestore")]);

    await firestore.addDoc(firestore.collection(db, "orders"), {
      ...payload,
      status: "new",
      createdAt: firestore.serverTimestamp(),
    });
    return;
  }

  const orders = readLocalOrders();
  const next = [
    {
      id: crypto.randomUUID(),
      ...order,
    },
    ...orders,
  ];

  writeLocalOrders(next);
  window.dispatchEvent(new CustomEvent("yotto-local-orders-updated"));
};

export const subscribeToOrders = (callback) => {
  if (isFirebaseConfigured) {
    let unsubscribe = () => {};
    let isClosed = false;

    Promise.all([getDb(), import("firebase/firestore")])
      .then(([db, firestore]) => {
        if (isClosed) {
          return;
        }

        const ordersQuery = firestore.query(
          firestore.collection(db, "orders"),
          firestore.orderBy("createdAt", "desc"),
        );

        unsubscribe = firestore.onSnapshot(ordersQuery, (snapshot) => {
          const orders = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
            createdAt: normalizeTime(item.data().createdAt),
          }));
          callback(orders);
        });
      })
      .catch(() => {
        callback(readLocalOrders());
      });

    return () => {
      isClosed = true;
      unsubscribe();
    };
  }

  const update = () => callback(readLocalOrders());
  update();

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      update();
    }
  };

  const handleCustomUpdate = () => update();

  window.addEventListener("storage", handleStorage);
  window.addEventListener("yotto-local-orders-updated", handleCustomUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("yotto-local-orders-updated", handleCustomUpdate);
  };
};

export const updateOrderStatus = async (id, status) => {
  if (isFirebaseConfigured) {
    const [db, firestore] = await Promise.all([getDb(), import("firebase/firestore")]);
    await firestore.updateDoc(firestore.doc(db, "orders", id), { status });
    return;
  }

  const orders = readLocalOrders();
  const next = orders.map((order) =>
    order.id === id
      ? {
          ...order,
          status,
        }
      : order,
  );

  writeLocalOrders(next);
  window.dispatchEvent(new CustomEvent("yotto-local-orders-updated"));
};

export const deleteOrder = async (id) => {
  if (isFirebaseConfigured) {
    const [db, firestore] = await Promise.all([getDb(), import("firebase/firestore")]);
    await firestore.deleteDoc(firestore.doc(db, "orders", id));
    return;
  }

  const orders = readLocalOrders();
  const next = orders.filter((order) => order.id !== id);

  writeLocalOrders(next);
  window.dispatchEvent(new CustomEvent("yotto-local-orders-updated"));
};
