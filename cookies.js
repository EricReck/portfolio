(() => {
  const storageKey = "ericreck-cookie-consent";
  let consent = null;

  try {
    const savedChoice = window.localStorage.getItem(storageKey);
    if (savedChoice === "accepted" || savedChoice === "rejected") consent = savedChoice;
  } catch {
    consent = null;
  }

  window.ericreckCookieConsent = consent;

  const banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-labelledby", "cookie-title");
  banner.hidden = consent !== null;
  banner.innerHTML = `
    <div class="cookie-art" aria-hidden="true"></div>
    <div class="cookie-copy">
      <p class="cookie-kicker">Preferencias / privacidad</p>
      <h2 id="cookie-title">Tu elección sobre las cookies</h2>
      <p>Si aceptas, Google AdSense podrá cargar anuncios y usar cookies o tecnologías similares. Si rechazas, no cargaremos el script publicitario. Guardamos tu elección en este navegador; puedes cambiarla desde el pie de página.</p>
      <div class="cookie-actions">
        <button class="cookie-action" type="button" data-cookie-choice="rejected">Rechazar opcionales</button>
        <button class="cookie-action cookie-action-primary" type="button" data-cookie-choice="accepted">Aceptar opcionales</button>
      </div>
      <a class="cookie-privacy" href="privacidad.html">Leer la política de privacidad</a>
    </div>`;
  document.body.append(banner);

  function loadAdsScript() {
    if (consent !== "accepted" || !document.querySelector(".adsbygoogle") || document.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3618331689570044";
    document.head.append(script);
  }

  function saveChoice(choice) {
    consent = choice;
    window.ericreckCookieConsent = choice;
    try {
      window.localStorage.setItem(storageKey, choice);
    } catch {
      // The choice remains active for this page if storage is unavailable.
    }
    banner.hidden = true;
    if (choice === "accepted") loadAdsScript();
  }

  banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => saveChoice(button.dataset.cookieChoice));
  });

  document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
    button.addEventListener("click", () => {
      banner.hidden = false;
      banner.querySelector('[data-cookie-choice="rejected"]').focus();
    });
  });

  document.addEventListener("ericreck:request-ad", () => {
    if (consent !== "accepted") return;
    const ad = document.querySelector(".adsbygoogle");
    if (!ad || ad.dataset.requested === "true") return;
    ad.dataset.requested = "true";
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });

  if (consent === "accepted") loadAdsScript();
})();