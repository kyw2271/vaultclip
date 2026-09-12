# Chrome Web Store listing — English

## Name
VaultClip - Markdown + PDF

## Short description
Save the current web page to a local vault as a compact Markdown summary linked to a full PDF archive.

## Recommended category
Productivity

## Detailed description
VaultClip is a local-first web clipper for keeping web pages searchable and available for later reference.

With one click, it saves the current page in two formats:

- A lightweight Markdown note containing the saved time, a compact extracted summary, and a PDF link
- A full PDF archive of the currently rendered web page
- Direct saving to a local folder selected by the user
- Wiki-style PDF links that work well with Markdown vault apps such as Obsidian
- No account, cloud service, analytics, or external upload required

### How it works
1. Select your local vault folder.
2. Choose a subfolder such as `WebClip`.
3. On a page you want to archive, select **Save MD + PDF**.
4. VaultClip writes the Markdown note and PDF directly into your selected vault.

### Privacy
VaultClip reads only the active page when the user explicitly invokes the extension.
Page content is processed locally to create the summary and PDF. It is not transmitted to the developer or any third-party server.

For automatic PDF creation, VaultClip uses Chrome's `debugger` permission only during the user-initiated save operation. It attaches to the active tab, calls `Page.printToPDF`, and immediately detaches after the PDF is generated.

VaultClip is an independent third-party extension and is not affiliated with or endorsed by Obsidian.
