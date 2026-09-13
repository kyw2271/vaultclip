# VaultClip

Save the active webpage locally as a compact Markdown note and a PDF archive.

[Chrome Web Store](https://chromewebstore.google.com/detail/jiimmmnmmgdaebglpiginogkfabikdkc)

## Version 1.1.0

Korean and English UI, progress/error messages and labels in newly saved Markdown notes. Chrome language is used automatically; unsupported languages fall back to Korean. Select 한국어 or English in the popup to override it. Language preferences stay in local browser storage. Original webpage content is not translated.

- Source: `extension/`
- Upload package: `vaultclip-cws-v1.1.0.zip`
- Store materials: `store-listing/`
- Changes: `CHANGELOG.md`
- Validation: `TEST_REPORT_1.1.0.md`

## Local development

Open `chrome://extensions`, enable Developer mode, choose Load unpacked and select `extension/`. Open an HTTP/HTTPS page, choose a writable local Vault folder, then click Save summary MD + PDF (요약 MD + PDF 저장).

Run automated tests with Node.js 22 or newer:

```sh
node --test tests/runtime.test.mjs
```

VaultClip processes page content locally. The debugger permission is used for user-initiated PDF generation and released afterward. Translation catalogs are packaged with the extension; no remote translation service is used.

## Privacy policy

- [한국어 (기본)](https://kyw2271.github.io/vaultclip/privacy-policy.html)
- [English](https://kyw2271.github.io/vaultclip/privacy-policy-en.html)

## Contact

kyw2271@gmail.com
