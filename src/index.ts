import isLoggedIn from "./Components/Auth/utils";
import UserProfile from "./Components/Layout/UserProfile";
import ErrorAPIProvider from "./Components/ErrorAPIContext";
import ErrorNotification from "./Components/ErrorNotification";
import LanguageRedirect from "./Components/LanguageRedirect";
import { UserDataProvider, useUserData } from "./Components/UserDataContext";
import { TenantContextProvider, useTenantContext } from "./Components/TenantContextProvider";
import "./Objs/ChatPage/ChatPageComponent";
import "./Objs/ChatPage/ChatPageEditingConfig";
import "./Objs/ChatPage/ChatPageObjClass";
import "./Objs/ProfilePage/ProfilePageComponent";
import "./Objs/ProfilePage/ProfilePageEditingConfig";
import "./Objs/ProfilePage/ProfilePageObjClass";
import { translate, getLanguage } from "./utils/translate";
import { isInVisitedPages, addToVisitedPages } from "./utils/visitedPages";
import "./Widgets/HistoryWidget/HistoryWidgetClass";
import "./Widgets/HistoryWidget/HistoryWidgetComponent";
import "./Widgets/HistoryWidget/HistoryWidgetEditingConfig";
import "./Widgets/TicketListWidget/TicketListWidgetClass";
import "./Widgets/TicketListWidget/TicketListWidgetComponent";
import "./Widgets/TicketListWidget/TicketListWidgetEditingConfig";
import "./Widgets/TicketsWidget/TicketsWidgetClass";
import "./Widgets/TicketsWidget/TicketsWidgetComponent";
import "./Widgets/TicketsWidget/TicketsWidgetEditingConfig";
import * as InitialContentBodyFactory from "./Bridge/InitialContentBodyFactory";
export * as portalApiCalls from "./api/portalApiCalls";

export {
  UserDataProvider,
  useUserData,
  UserProfile,
  LanguageRedirect,
  TenantContextProvider,
  useTenantContext,
  ErrorAPIProvider,
  ErrorNotification,
  isLoggedIn,
  translate,
  getLanguage,
  isInVisitedPages,
  addToVisitedPages,
  InitialContentBodyFactory
};
