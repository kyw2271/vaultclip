# VaultClip Privacy Policy

Effective date: 2026-09-10

VaultClip is a local-first Chrome extension that saves a user-selected web page into a user-selected local folder as a Markdown note and PDF archive.

## Data the extension accesses

VaultClip may access the following data only when the user explicitly activates the extension on a web page:

- The content of the active web page
- The active page title
- The user's local folder selection and extension settings

VaultClip does not continuously monitor browsing activity.

## How data is used

Active-page content is processed locally in the browser solely to:

- Extract a compact text summary
- Generate a PDF archive of the active page
- Save the Markdown note and PDF to the local folder selected by the user

The selected local folder handle and extension preferences may be stored locally in the browser so the extension can remember the user's settings.

## Data transmission and sharing

VaultClip does not send page content, browsing data, files, analytics, telemetry, or personal information to the developer or to third-party servers.

VaultClip does not sell user data and does not use user data for advertising.

## Chrome debugger permission

VaultClip uses Chrome's `debugger` permission for one purpose: automatic PDF generation without opening the print dialog.

When the user selects the save action, VaultClip temporarily attaches to the active tab, invokes Chrome DevTools Protocol `Page.printToPDF`, receives the PDF data locally, writes the PDF to the user-selected folder, and detaches immediately afterward.

The debugger permission is not used for monitoring users, collecting network traffic, modifying unrelated pages, or transmitting data externally.

## Local files

VaultClip can write only to folders for which the user has explicitly granted access through the browser's folder picker. Files remain on the user's device or in a user-controlled synced folder if the user chooses one.

## Data retention

The developer does not retain user data because VaultClip does not transmit user data to developer-controlled systems.

Locally saved Markdown/PDF files remain until the user deletes them. Locally stored extension settings can be removed by clearing extension data or uninstalling the extension.

## Contact

Developer contact: kyw2271@gmail.com

## Limited Use

VaultClip's use of information received from Chrome APIs is limited to providing the extension's user-facing web clipping and local archiving functionality. Data is not transferred for advertising, creditworthiness, or unrelated purposes.
