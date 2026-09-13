# Chrome Web Store — Privacy practices / Permission justifications

## Single purpose
Save the user-selected active web page into a user-selected local vault as a compact Markdown note linked to a PDF archive.

## activeTab
Used only after the user opens VaultClip and starts a save operation. It grants temporary access to the current tab so the extension can read the page title/content needed to create the local summary and PDF archive.

## scripting
Used to execute the page-text extraction function in the active tab after a user-initiated save action. No script is injected into background tabs and no continuous monitoring is performed.

## debugger
Required for automatic PDF generation on desktop Chrome. During a user-initiated save operation, VaultClip temporarily attaches to the active tab and invokes Chrome DevTools Protocol `Page.printToPDF`. It immediately detaches after PDF creation. The permission is not used for network monitoring, credential access, unrelated debugging, telemetry, or external transmission.

## storage
Used only to remember local extension preferences such as the selected Vault subfolder, summary length, PDF embed preference, and UI language choice. No analytics or server-side storage is used.

## Remote code
Select: **No, I am not using remote code.**

All executable JavaScript and Korean/English translation catalogs are packaged with the extension. The catalogs are read only from local chrome-extension:// URLs. The extension does not download or execute remotely hosted code.

## Data usage disclosure
Conservative disclosure recommendation:
- Website content: YES
- Web history / active-page URL: If the dashboard asks whether accessing the current page/URL counts as browsing activity, disclose it. The extension accesses only the current page after explicit user action and does not transmit or continuously collect it.
- Personally identifiable information: NO
- Authentication information: NO
- Financial/payment information: NO
- Personal communications: NO, unless the user intentionally clips a page containing such content; the extension treats it only as active-page content and does not transmit it.
- Location: NO
- User activity / analytics: NO

## Data sale / advertising / transfer
- Data sold: NO
- Data used for personalized advertising: NO
- Data transferred to third parties: NO
- Human review of user data: NO
