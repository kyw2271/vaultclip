import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');
const html = await read('extension/popup.html');
const sources = await Promise.all(['i18n.js', 'popup.js'].map(file => read(`extension/${file}`)));
const catalogs = Object.fromEntries(await Promise.all(['ko', 'en'].map(async locale =>
  [locale, JSON.parse(await read(`extension/_locales/${locale}/messages.json`))])));
const manifest = JSON.parse(await read('extension/manifest.json'));

function element(value = '') {
  const classes = new Set(['bad']);
  return { value, checked: true, disabled: false, textContent: '', style: {}, dataset: {},
    listeners: {}, classList: { add: c => classes.add(c), remove: c => classes.delete(c) },
    addEventListener(name, fn) { this.listeners[name] = fn; } };
}

function folder(name, files = new Map(), prefix = '') {
  return { name,
    async queryPermission() { return 'granted'; },
    async requestPermission() { return 'granted'; },
    async getDirectoryHandle(part) { return folder(part, files, `${prefix}${part}/`); },
    async getFileHandle(file, {create}) {
      const key = prefix + file;
      if (!create && !files.has(key)) throw new DOMException('Missing', 'NotFoundError');
      if (create && !files.has(key)) files.set(key, null);
      return {async createWritable() {return {
        async write(data) {files.set(key, typeof data === 'string' ? data : Buffer.from(data));},
        async close() {},
      };}};
    },
  };
}

async function harness({locale = 'ko', settings = {}, url = 'https://example.com/', printFailure = false,
  files = new Map(), pickerCanceled = false} = {}) {
  const nodes = Object.fromEntries(['pickVault','vaultStatus','subfolder','summaryChars','embedPdf',
    'saveBoth','status','language'].map(id => [id, element()]));
  nodes.subfolder.value = 'WebClip';
  nodes.summaryChars.value = '900';
  nodes.language.value = 'auto';
  const translated = [...html.matchAll(/<[^>]*data-i18n="([^"]+)"[^>]*>/g)].map(match => {
    const id = match[0].match(/\bid="([^"]+)"/)?.[1];
    const node = id ? nodes[id] : element();
    node.dataset.i18n = match[1];
    return node;
  });
  const calls = [];
  const vault = folder('Test Vault', files);
  const document = {documentElement: {}, getElementById: id => nodes[id],
    querySelectorAll: () => translated};
  const db = {objectStoreNames: {contains: () => true}, transaction() {
    const tx = {objectStore() {return {
      get() {const req = {result: vault}; queueMicrotask(() => req.onsuccess()); return req;},
      put() {queueMicrotask(() => tx.oncomplete());},
    };}};
    return tx;
  }};
  const chrome = {
    runtime: {getURL: path => `chrome-extension://test/${path}`},
    i18n: {getUILanguage: () => locale, getMessage: key => catalogs.ko[key]?.message || ''},
    storage: {local: {async get() {return {...settings};}, async set(data) {Object.assign(settings, data);}}},
    tabs: {async query() {return [{id: 1, url}];}},
    scripting: {async executeScript({func, args}) {
      calls.push('extract');
      const paragraph = 'This is an English article used to verify that source content remains unchanged when interface language switches.';
      const article = {querySelectorAll: () => [{innerText: paragraph}], innerText: paragraph};
      const pageDocument = {title: 'Example article', body: article,
        querySelector: selector => selector === 'article' ? article : null};
      return [{result: vm.runInNewContext(`(${func})(...args)`,
        {args, document: pageDocument, location: {hostname: 'example.com'}})}];
    }},
    debugger: {async attach() {calls.push('attach');}, async detach() {calls.push('detach');},
      async sendCommand(_, method) {calls.push(method);
        return method === 'Page.printToPDF' ? (printFailure ? {} : {data: Buffer.from('%PDF-1.4\nTest').toString('base64')}) : {};
      }},
  };
  const context = vm.createContext({document, chrome, console, Map, Uint8Array, atob, queueMicrotask,
    indexedDB: {open() {const req = {result: db}; queueMicrotask(() => req.onsuccess()); return req;}},
    window: {async showDirectoryPicker() {if(pickerCanceled) throw new DOMException('Canceled', 'AbortError'); return vault;}},
    fetch: async resource => {
      calls.push(resource);
      const match = /^chrome-extension:\/\/test\/_locales\/(ko|en)\/messages.json$/.exec(resource);
      assert.ok(match, 'only bundled translation catalogs may be fetched');
      return {ok: true, async json() {return catalogs[match[1]];}};
    },
  });
  for (const source of sources) vm.runInContext(source, context);
  await vm.runInContext('ready', context);
  return {nodes, translated, context, settings, files, calls, document,
    async language(value) {nodes.language.value = value; await nodes.language.listeners.change();},
    async save() {await nodes.saveBoth.listeners.click();},
  };
}

test('1.1.0 catalogs cover every UI and manifest message with the same placeholders', () => {
  assert.equal(manifest.version, '1.1.0');
  assert.equal(manifest.default_locale, 'ko');
  assert.deepEqual(manifest.permissions, ['activeTab','scripting','debugger','storage']);
  assert.equal(manifest.host_permissions, undefined);
  assert.deepEqual(Object.keys(catalogs.en).sort(), Object.keys(catalogs.ko).sort());
  const refs = [...html.matchAll(/data-i18n="([^"]+)"/g), ...sources[1].matchAll(/\bt\("([^"]+)"/g),
    ...JSON.stringify(manifest).matchAll(/__MSG_(\w+)__/g)].map(m => m[1]);
  for (const key of refs) assert.ok(catalogs.en[key] && catalogs.ko[key], key);
  for (const [key, entry] of Object.entries(catalogs.en)) {
    assert.ok(entry.message.trim(), key);
    assert.doesNotMatch(entry.message, /[가-힣]/, key);
    assert.deepEqual(entry.placeholders, catalogs.ko[key].placeholders, key);
  }
  for (const catalog of Object.values(catalogs)) assert.ok(catalog.extensionDescription.message.length <= 132);
});

test('Chrome locale selects English variants; unsupported locales fall back to Korean', async () => {
  for (const [locale, expected] of [['en-US','en'],['en_GB','en'],['ko-KR','ko'],['fr','ko']]) {
    const app = await harness({locale});
    assert.equal(app.document.documentElement.lang, expected);
    assert.equal(app.nodes.pickVault.textContent, catalogs[expected].pickVault.message);
    assert.equal(app.nodes.language.value, 'auto');
  }
});

test('1.0.0 settings survive initialization; explicit English choice persists across popup reopen', async () => {
  const settings = {subfolder: 'Existing/Nested', summaryChars: 1500, embedPdf: false};
  const app = await harness({settings});
  assert.equal(app.nodes.subfolder.value, 'Existing/Nested');
  assert.equal(app.nodes.summaryChars.value, '1500');
  assert.equal(app.nodes.embedPdf.checked, false);
  await app.language('en');
  assert.equal(settings.language, 'en');
  assert.equal(app.document.documentElement.lang, 'en');
  for (const node of app.translated) assert.doesNotMatch(node.textContent, /[가-힣]|\$[a-z_]+\$/i);
  const reopened = await harness({settings});
  assert.equal(reopened.document.documentElement.lang, 'en');
  assert.equal(reopened.nodes.subfolder.value, 'Existing/Nested');
});

test('both languages save localized Markdown, unchanged source text, valid PDF link and release debugger', async () => {
  const files = new Map();
  const app = await harness({files});
  for (const language of ['en','ko']) {
    await app.language(language);
    app.nodes.embedPdf.checked = language === 'ko';
    app.nodes.subfolder.value = `WebClip/${language}`;
    await app.save();
    assert.equal(app.nodes.saveBoth.disabled, false);
    assert.equal(app.nodes.language.disabled, false);
    assert.ok(app.nodes.status.textContent.startsWith(language === 'en' ? 'Saved successfully' : '저장 완료'));
    const [mdPath, md] = [...files].find(([name]) => name.startsWith(`WebClip/${language}/`) && name.endsWith('.md'));
    assert.match(md, /^# Example article/);
    assert.ok(md.includes(`- ${catalogs[language].savedAt.message}: `));
    assert.ok(md.includes(`## ${catalogs[language].summaryHeading.message}`));
    assert.match(md, /This is an English article used to verify/);
    const pdfPath = md.match(/\[\[(.+\.pdf)\]\]/)[1];
    assert.ok(files.has(pdfPath));
    assert.equal(files.get(pdfPath).subarray(0, 5).toString(), '%PDF-');
    assert.equal(md.includes('![['), language === 'ko');
    assert.ok(app.nodes.status.textContent.includes(mdPath));
  }
  assert.equal(files.size, 4);
  assert.deepEqual(app.calls.filter(x => !x.includes('://')),
    ['extract','attach','Page.enable','Page.printToPDF','detach','extract','attach','Page.enable','Page.printToPDF','detach']);
});

test('PDF failure displays a localized error, detaches debugger and restores controls', async () => {
  const app = await harness({locale:'en', printFailure:true});
  await app.save();
  assert.equal(app.nodes.status.textContent, 'Error: Could not generate the PDF.');
  assert.equal(app.calls.at(-1), 'detach');
  assert.equal(app.files.size, 0);
  assert.equal(app.nodes.saveBoth.disabled, false);
});

test('restricted pages fail before script/debugger access and canceled folder picker is harmless', async () => {
  const app = await harness({locale:'en', url:'chrome://extensions/', pickerCanceled:true});
  await app.save();
  assert.equal(app.nodes.status.textContent, 'Error: Open a regular webpage (http/https) before saving.');
  assert.equal(app.calls.filter(x => !x.includes('://')).length, 0);
  const before = app.nodes.status.textContent;
  await app.nodes.pickVault.listeners.click();
  assert.equal(app.nodes.status.textContent, before);
  assert.equal(app.nodes.pickVault.disabled, false);
});
