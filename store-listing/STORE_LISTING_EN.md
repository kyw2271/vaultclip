# VaultClip 1.1.0 — EN

VaultClip saves the current webpage to a local folder you choose as a Markdown note and a PDF archive. Use it with Markdown vaults, including Obsidian.

Features
• A Markdown note with the page title, saved time, compact extracted summary and PDF link
• A PDF archive of the currently rendered webpage
• A choice of a wiki-style PDF link or embedded PDF
• Configurable Vault subfolder and maximum summary length
• Korean and English interfaces and Markdown section labels
• Local processing without an account or external server uploads

How to use
1. Open VaultClip on a regular HTTP/HTTPS webpage.
2. Click “Choose Vault folder” and select a local folder.
3. Set the subfolder and summary length.
4. Click “Save summary MD + PDF”.

Languages
VaultClip automatically uses Korean or English based on your Chrome language. Korean is the default for unsupported languages. You can also select 한국어 or English in the popup’s Language menu. Your choice is saved locally and applies to the “Saved at” and “Summary” labels in new Markdown notes. The source page and extracted summary remain in their original language; VaultClip does not translate webpage content.

By default, Markdown notes are saved in WebClip and PDFs in WebClip/_archive/pdf. The summary is extracted from the page description and text; it is not an AI-generated summary. The page’s print styles may affect the PDF.

Privacy and permissions
VaultClip processes the active page’s title and content locally when you start a save. It does not send page data or files to the developer or third-party servers. Automatic PDF generation uses the debugger permission to briefly connect to the current tab, call Page.printToPDF, and disconnect. Chrome may display a temporary debugging notice.

Chrome internal pages and pages that restrict extensions are not supported.
VaultClip is not an official Obsidian product and is not affiliated with or endorsed by Obsidian.

New in 1.1.0: English interface, language selection and English Markdown section labels.
