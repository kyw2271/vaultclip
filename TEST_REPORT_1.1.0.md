# VaultClip 1.1.0 validation

Date: 2026-09-13 (Asia/Seoul)

- 6 automated runtime tests passed using Node 22: complete catalogs, locale fallback, 1.0.0 settings migration, persisted language override, Korean/English Markdown and PDF writes, debugger detach on success/failure, restricted-page handling and canceled folder selection.
- Reloaded the existing unpacked extension in desktop Chrome; version 1.1.0 and Korean manifest description verified.
- Native English popup selected; preference and WebClip settings persisted after reload/reopen.
- Actual English save: WebClip/v1.1.0-en/VaultClip Privacy Policy__2026-09-13_180000.md and matching PDF (106,084 bytes). English Saved at/Summary labels and embedded PDF link verified.
- Actual Korean save: WebClip/v1.1.0-ko/VaultClip Privacy Policy__2026-09-13_180035.md and matching PDF (106,084 bytes). Korean 저장 시간/요약 labels and plain PDF wiki link verified.
- Both PDFs start with %PDF-. Both notes retain the original English source page content.
- Actual final popup screenshots captured for both languages; 1280x800 store canvases add padding only.
- Final ZIP entries verified byte-for-byte against tested extension sources.
- ZIP SHA256: b1ba03b196d9bb9f937bc36aacd1fdf2671e825d626ea32600ad7c72de042315

Limitations: existing macOS Chrome profile, not a clean profile; native browser language was Korean (English Chrome locale variants covered with mocked API tests). No browser restart, long-page stress test or PDF visual pagination review performed.

Store update submitted on 2026-09-13. CWS confirmed submission and status 검토 대기 중 (pending review). Automatic publishing on approval enabled. Draft version 1.1.0 and published version 1.0.0 were verified before submission. Korean/English descriptions and localized screenshots, unchanged data-use disclosures, updated language storage explanation and reviewer instructions saved.
