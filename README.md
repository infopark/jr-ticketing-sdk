# JustRelate Ticketing SDK

## Description

SDK for the functionality that is used from the JustRelate Customer Portal API. This includes tickets and user functionality.

## Build package

To build the package run the following in your shell:

```bash
npm run build
```

## Install

To install the package to your project run the following in your shell:

```bash
npm install jr-ticketing-sdk
```

## JustRelate Customer Portal SDK and Scrivito Example App

### Context

In your App.js you should include the following:

```javascript
import {
  UserDataProvider,
  TicketingContextProvider,
  ErrorAPIProvider,
  ErrorNotification
} from "jr-customer-portal-sdk";
```

It could look for example like:

```javascript
  <TicketingContextProvider>
    ...
  </TicketingContextProvider>
```

### For Editing the ticket form with custom attributes and order

Import to `ScrivitoExtensions`

```
import "jr-ticketing-sdk/dist/ScrivitoExtensions";
```

Import to `ScrivitoEditing`

```
import "jr-ticketing-sdk/dist/ScrivitoEditing";
```


### Environment Variables

In your webpack.config.js add the following to the `EnvironmentPlugin`:

```javascript
JUST_RELATE_SITE_ORIGIN: "",
CUSTOMER_PORTAL_SDK_CDN_URL: "",
SCRIVITO_PRERENDER: "",
API_BASE_URL: "",
API_INSTANCE_ID: "",
API_DEPLOYMENT_STAGE: "",
```


### Styles

In index.scss add the following:

```javascript
@import "~jr-customer-portal-sdk/dist/cssBundle.css";
```

### Proxy for local Development

In your .env add the following:

```
CUSTOMER_PORTAL_SDK_CDN_URL=https://jr-customer-portal-develop.justrelate.io
```

In your webpack.config.js add the following to the top:

```javascript
const DEV_SERVER_PORT = 8080;
const API_TARGET_URL = "https://api.justrelate.com/";
const CDN_TARGET_URL = "https://jr-customer-portal-develop.justrelate.io";
```

And the following to the `devServer`:

```javascript
proxy: {
  "/cdn": {
    secure: false,
    changeOrigin: true,
    target: CDN_TARGET_URL,
    onProxyReq(request) {
      request.setHeader(
        "X-JR-API-Location",
        `http://localhost:${DEV_SERVER_PORT}`
      );
    },
  },
  "/iam": {
    secure: false,
    changeOrigin: true,
    target: API_TARGET_URL,
    onProxyReq(request) {
      request.setHeader(
        "X-JR-API-Location",
        `http://localhost:${DEV_SERVER_PORT}`
      );
    },
  },
  "/portal": {
    secure: false,
    changeOrigin: true,
    target: API_TARGET_URL,
  },
  "/neoletter": {
    secure: false,
    changeOrigin: true,
    target: API_TARGET_URL,
  },
},
```

### User profile header badge

There is a badge displaying information about the logged in user and offering some functionality like logout and language switch. It needs to be imported and included in some component, preferably a header:

```javascript
import { UserProfile } from "jr-customer-portal-sdk";
…
<UserProfile />
```

### Language redirect

There is a component that offers automated redirects to the preferred language of a user. It needs to be imported and included in some component that gets always rendered, for example a header:

```javascript
import { LanguageRedirect } from "jr-customer-portal-sdk";
…
<LanguageRedirect />
```

### Widgets/Components

There are the Tickets, Ticket List, History, Chat Page and Profile Page. These need to be added via the Scrivito Editor.
