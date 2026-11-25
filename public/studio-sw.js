/* ============================================================
   Social Design Studio
   Private Alpha Service Worker

   Intentionally network-only for private content.
============================================================ */

const STUDIO_SCOPE = "/studio";

function isStudioPath(pathname) {
  return pathname === STUDIO_SCOPE || pathname.startsWith(`${STUDIO_SCOPE}/`);
}

self.addEventListener("install", () => {
  // Do not force activation while an older
  // application version is still being used.
});

self.addEventListener("activate", () => {
  // No private caches to migrate or retain.
});

function createOfflineResponse() {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover"
  />

  <meta
    name="theme-color"
    content="#FFF7FA"
  />

  <title>Connection unavailable | Social Design Studio</title>

  <style>
    :root {
      color-scheme: light dark;
      font-family: -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      background: #fff7fa;
      color: #241c22;
    }

    * {
      box-sizing: border-box;
    }

    body {
      min-height: 100dvh;
      margin: 0;
      display: grid;
      place-items: center;
      padding: 1.5rem;
    }

    main {
      width: min(100%, 420px);
      padding: 2rem;
      border: 1px solid #ebccdc;
      border-radius: 24px;
      background: #fff;
      text-align: center;
    }

    .symbol {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      margin: 0 auto 1.5rem;
      border-radius: 18px;
      background: #fce7f3;
      color: #c42b70;
      font-size: 2rem;
    }

    h1 {
      margin: 0 0 1rem;
      font-size: 1.5rem;
    }

    p {
      font-size: 0.9rem;
      line-height: 1.7;
    }

    a {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.85rem 1.5rem;
      border-radius: 12px;
      background: #c42b70;
      color: white;
      text-decoration: none;
      font-weight: 600;
    }

    .caption {
      margin-top: 1.5rem;
      opacity: 0.7;
      font-size: 0.75rem;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        background: #160d1a;
        color: #fff7fa;
      }

      main {
        background: #211125;
        border-color: #53324b;
      }

      .symbol {
        background: #321a35;
        color: #ff91b8;
      }
    }
  </style>
</head>

<body>
  <main>
    <div class="symbol" aria-hidden="true">✦</div>

    <h1>Connection unavailable</h1>

    <p>
      Social Design Studio needs an internet
      connection to load your private workspace.
    </p>

    <p>
      Reconnect to continue designing.
      Previously saved cloud projects have not
      been changed by this connection error.
    </p>

    <a href="/studio">Try again</a>

    <p class="caption">
      Social Design Studio · Private Alpha
    </p>
  </main>
</body>
</html>`,
    {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only intercept full Studio page navigations.
  // Leave API calls, RSC requests, assets and
  // external services to their normal handlers.

  if (
    request.method !== "GET" ||
    request.mode !== "navigate" ||
    url.origin !== self.location.origin ||
    !isStudioPath(url.pathname)
  ) {
    return;
  }

  event.respondWith(
    fetch(request, {
      cache: "no-store",
    }).catch(() => createOfflineResponse()),
  );
});
