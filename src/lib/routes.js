const routeConfig = {
  "/": { page: "home", scrollTarget: "" },
  "/admin": { page: "admin", scrollTarget: "" },
  "/branches": { page: "home", scrollTarget: "branches" },
  "/gallery": { page: "home", scrollTarget: "gallery" },
  "/menu": { page: "menu", scrollTarget: "" },
  "/reservation": { page: "menu", scrollTarget: "reservation" },
};

const knownRouteRoots = new Set(
  Object.keys(routeConfig)
    .filter((path) => path !== "/")
    .map((path) => path.replace(/^\//, "")),
);

const trimTrailingSlash = (value) =>
  value.length > 1 && value.endsWith("/") ? value.slice(0, -1) : value;

export const getRuntimeBasePath = (pathname = "/") => {
  if (typeof window === "undefined") {
    return "";
  }

  const baseFromEnv = import.meta.env.BASE_URL;
  if (baseFromEnv && baseFromEnv !== "/" && baseFromEnv !== "./") {
    return trimTrailingSlash(baseFromEnv);
  }

  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) {
    return "";
  }

  if (knownRouteRoots.has(segments[0])) {
    return "";
  }

  return window.location.hostname.endsWith(".github.io") ? `/${segments[0]}` : "";
};

const stripBasePath = (pathname) => {
  const basePath = getRuntimeBasePath(pathname);

  if (!basePath) {
    return pathname || "/";
  }

  if (pathname === basePath) {
    return "/";
  }

  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
};

export const normalizePath = (inputPath = "/") => {
  let path = stripBasePath(inputPath || "/");

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  path = path
    .replace(/\/index\.html$/i, "/")
    .replace(/\.html$/i, "")
    .replace(/\/{2,}/g, "/");

  path = trimTrailingSlash(path);

  return routeConfig[path] ? path : "/";
};

export const getRouteData = (inputPath = "/") => {
  const path = normalizePath(inputPath);
  return {
    path,
    ...routeConfig[path],
  };
};

export const buildAppUrl = (inputPath = "/") => {
  const path = normalizePath(inputPath);
  const runtimePath =
    typeof window !== "undefined" ? window.location.pathname : path;
  const basePath = getRuntimeBasePath(runtimePath);

  return `${basePath}${path}` || "/";
};

export const buildPublicAssetUrl = (inputPath) => {
  const cleanPath = inputPath.startsWith("/") ? inputPath : `/${inputPath}`;
  const runtimePath =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const basePath = getRuntimeBasePath(runtimePath);

  return `${basePath}${cleanPath}`;
};
