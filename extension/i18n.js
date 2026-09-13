// Catalogs are packaged with the extension; no translation service is used.
const i18n = (() => {
  const catalogs = new Map();
  let current = null;
  let locale = "ko";

  function resolveLocale(preference, browserLanguage = chrome.i18n.getUILanguage()) {
    if (preference === "ko" || preference === "en") return preference;
    return /^en(?:[-_]|$)/i.test(browserLanguage) ? "en" : "ko";
  }

  async function setLanguage(preference) {
    const next = resolveLocale(preference);
    if (!catalogs.has(next)) {
      const response = await fetch(chrome.runtime.getURL(`_locales/${next}/messages.json`));
      if (!response.ok) throw new Error("Unable to load bundled language file.");
      catalogs.set(next, await response.json());
    }
    current = catalogs.get(next);
    locale = next;
  }

  function t(key, substitutions = []) {
    const values = Array.isArray(substitutions) ? substitutions : [substitutions];
    const entry = current?.[key];
    if (!entry) return chrome.i18n.getMessage(key, values) || key;
    return entry.message.replace(/\$([a-z_]+)\$/gi, (match, name) => {
      const content = entry.placeholders?.[name.toLowerCase()]?.content;
      return content === undefined ? match : content.replace(/\$(\d+)/g,
        (_, position) => String(values[Number(position) - 1] ?? ""));
    });
  }

  function apply(root = document) {
    root.documentElement.lang = locale;
    for (const element of root.querySelectorAll("[data-i18n]")) {
      element.textContent = t(element.dataset.i18n);
    }
  }

  return { resolveLocale, setLanguage, t, apply };
})();
