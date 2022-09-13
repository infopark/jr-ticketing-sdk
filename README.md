# JustRelate Customer Portal SDK

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
npm install jr-customer-portal-sdk
```

## JustRelate Customer Portal SDK and Scrivito Example App

### Context

In your App.js you should include the following:

```bash
import {
  UserDataProvider,
  TenantContextProvider,
  ErrorAPIProvider,
  ErrorNotification
} from "jr-customer-portal-sdk";
```

It could look for example like:

```bash
<ErrorAPIProvider>
  <UserDataProvider>
    <TenantContextProvider>
      <ErrorNotification />
      …
    </TenantContextProvider>
  </UserDataProvider>
</ErrorAPIProvider>
```

### Environment Variables

In your webpack.config.js add the following to the `EnvironmentPlugin`:

```bash
JUST_RELATE_SITE_ORIGIN: "",
CUSTOMER_PORTAL_SDK_CDN_URL: "",
SCRIVITO_PRERENDER: "",
AUTH_CLIENT_ID: "",
AUTH_DOMAIN: "",
AUTH_USER_POOL_ID: "",
AUTH_POOL_ID_REGION: "",
API_BASE_URL: "",
API_INSTANCE_ID: "",
WS_API_BASE_URL: "",
API_DEPLOYMENT_STAGE: "",
```


### Styles

In index.scss add the following:

```bash
@import "~jr-customer-portal-sdk/dist/cssBundle.css";
```

### Proxy for local Development

In your webpack.config.js add the following to the top:

```bash
const DEV_SERVER_PORT = 8080;
const API_TARGET_URL = "https://api.justrelate.com/";
```

And the following to the `devServer`:

```bash
proxy: {
  "/cdn": {
    secure: false,
    changeOrigin: true,
    target: process.env.DEVELOP_ORIGINAL_CDN_TARGET_URL,
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

```bash
import { UserProfile } from "jr-customer-portal-sdk";
…
<UserProfile />
```

### Language redirect

There is a component that offers automated redirects to the preferred language of a user. It needs to be imported and included in some component that gets always rendered, for example a header:

```bash
import { LanguageRedirect } from "jr-customer-portal-sdk";
…
<LanguageRedirect />
```

### Widgets/Components

There are the Tickets, Ticket List, History, Chat Page and Profile Page. These need to be added via the Scrivito Editor.
