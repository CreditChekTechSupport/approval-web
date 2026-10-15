# Changelog

## 3.0.3

README only.

- "Migrating to v3" replaces "Migrating from v1", with steps from both v2 and v1.

## 3.0.2

README only.

- Sessions are now created with `widgetId` instead of `sdkId`. Step 1 shows the new request.

## 3.0.1

README only.

- Sessions are now created with `sdkId` (the widget ID from the business dashboard) instead of `services`. Step 1 shows the new request.
- `publicKey`, `widgetId` and `sessionId` are listed as required in "Before you start" and the API reference.

## 3.0.0

Breaking: the widget URL now takes `publicKey`, `sessionId` and `widgetId`, plus optional prefill values.

- New required `widgetId` option. Opening without it fails with `invalid_config`.
- Removed the `modules` and `environment` options. The widget decides the steps, and the public key decides live or test mode.
- Removed the `CreditChekEnvironment` type.
- Removed the `themeColor` option. The loading spinner is deep grey.

## 2.0.0

Rewritten for the session-based CreditChek widget. See "Migrating from v1" in the README.

- New `useCreditChek` hook and `CreditChekButton` component.
- New `openCreditChekWidget` for use outside React components.
- The widget opens in a modal on your page, with an iframe, a loading state and enter/exit transitions. It becomes a full-screen sheet on phones. No other window or tab opens.
- Requires a `sessionId` created by your server with your secret key. `open` also accepts a function that creates the session on click.
- `onStep` reports each finished step; `onClose` reports the session ID and the steps once the widget closes; `onError` reports a failed session or invalid options.
- Only messages from the widget's frame or window, and its origin, are accepted. The widget is told this page's origin, so it addresses its messages to this page only.
- Supports the `identity` and `liveness` modules. Credit, income and Recova are coming later.
- Options: `publicKey`, `modules`, `environment`, `themeColor`, `prefill`, `widgetUrl`.
- `environment` (`"production"` or `"development"`) is passed to the widget as a URL parameter. Both environments use `https://securedwidget.creditchek.africa`; the development widget address is no longer used.
- `WIDGET_URL` exports the widget address.
- ESM and CommonJS builds with TypeScript types. Marked `"use client"` for Next.js. React is now a peer dependency (17+).
- Removed the default `creditchekSDK` export, and the `module`, `onComplete` and `postMessageParam` options.

## 1.0.1

- Initial public release.
