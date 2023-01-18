import { TenantContextProvider, useTenantContext } from "./Components/TenantContextProvider";
import getUserData from "./api/getUserData";

import "./Objs/TicketPage/TicketPageComponent";
import "./Objs/TicketPage/TicketPageEditingConfig";
import "./Objs/TicketPage/TicketPageObjClass";
import "./Objs/TicketFormConfiguration/TicketFormConfigurationEditingConfig";
import "./Objs/TicketFormConfiguration/TicketFormConfigurationObjClass";
import "./Widgets/HistoryWidget/HistoryWidgetClass";
import "./Widgets/HistoryWidget/HistoryWidgetComponent";
import "./Widgets/HistoryWidget/HistoryWidgetEditingConfig";
import "./Widgets/TicketListWidget/TicketListWidgetClass";
import "./Widgets/TicketListWidget/TicketListWidgetComponent";
import "./Widgets/TicketListWidget/TicketListWidgetEditingConfig";
import "./Widgets/TicketsWidget/TicketsWidgetClass";
import "./Widgets/TicketsWidget/TicketsWidgetComponent";
import "./Widgets/TicketsWidget/TicketsWidgetEditingConfig";

export {
  TenantContextProvider,
  useTenantContext,
  getUserData,
};
