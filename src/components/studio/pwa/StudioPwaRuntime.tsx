"use client";

import { useEffect, useSyncExternalStore } from "react";

import { WifiOff } from "lucide-react";

function subscribeToConnection(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerOnlineSnapshot() {
  return true;
}

type AppleNavigator = Navigator & {
  standalone?: boolean;
};

function subscribeToDisplayMode(callback: () => void) {
  const query = window.matchMedia("(display-mode: standalone)");

  query.addEventListener("change", callback);

  window.addEventListener("pageshow", callback);

  return () => {
    query.removeEventListener("change", callback);

    window.removeEventListener("pageshow", callback);
  };
}

function getStandaloneSnapshot() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as AppleNavigator).standalone === true
  );
}

function getServerStandaloneSnapshot() {
  return false;
}

export function useStudioStandalone() {
  return useSyncExternalStore(
    subscribeToDisplayMode,
    getStandaloneSnapshot,
    getServerStandaloneSnapshot,
  );
}

export default function StudioPwaRuntime() {
  const online = useSyncExternalStore(
    subscribeToConnection,
    getOnlineSnapshot,
    getServerOnlineSnapshot,
  );

  const standalone = useStudioStandalone();

  useEffect(() => {
    const root = document.documentElement;

    if (standalone) {
      root.setAttribute("data-studio-standalone", "true");
    } else {
      root.removeAttribute("data-studio-standalone");
    }

    return () => {
      root.removeAttribute("data-studio-standalone");
    };
  }, [standalone]);

  useEffect(() => {
    // Avoid service worker interference with
    // Next.js development and hot reloading.

    if (
      process.env.NODE_ENV !== "production" ||
      !window.isSecureContext ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let disposed = false;

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register("/studio-sw.js", {
          scope: "/studio",
          updateViaCache: "none",
        });

        if (disposed) return;

        console.info("Studio service worker registered:", registration.scope);
      } catch (error) {
        if (!disposed) {
          console.error("Studio service worker registration failed:", error);
        }
      }
    }

    void registerServiceWorker();

    return () => {
      disposed = true;
    };
  }, []);

  if (online) return null;

  return (
    <div className="studio-pwa-offline-notice" role="status" aria-live="polite">
      <WifiOff size={17} aria-hidden="true" />

      <span>Connection unavailable. Cloud saving requires internet access.</span>
    </div>
  );
}
