# Reviewer Test Instructions

1. Install the extension.
2. Open a normal `https://` web page with text content.
3. Select the VaultClip toolbar icon.
4. Select **Vault 폴더 선택** and choose a writable local test folder.
5. Leave the subfolder as `WebClip`.
6. Select **요약 MD + PDF 저장**.
7. Chrome may display a temporary debugging indicator while the PDF is generated.
8. Confirm that the test folder contains:
   - `WebClip/<page-title>__<timestamp>.md`
   - `WebClip/_archive/pdf/<page-title>__<timestamp>.pdf`
9. Open the Markdown file and verify that it contains only:
   - the page title
   - saved time
   - compact extracted summary
   - wiki-style link/embed to the saved PDF
10. Confirm that no sign-in, external server, or network account is required.

The `debugger` permission is used only during step 6 to call `Page.printToPDF` on the active tab and is detached immediately afterward.
