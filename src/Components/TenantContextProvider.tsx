import React, { useState, useEffect, useRef } from "react";
import {
  each,
  head,
  isEmpty,
  isNil,
  keys,
  map,
  reduce,
  sortBy,
} from "lodash-es";
import { CDN_BASE_PATH, DEVELOPMENT_ENVIRONMENT } from "../utils/constants";
import { callApiPost } from "../api/portalApiCalls";
import { dictTranslate, getDictionary, getLanguage } from "../utils/translate";

const TenantContext = React.createContext({} as any);

/**
 * Warning: This context provider uses tenant specific IDs in order to
 * manage meaningful defaults. Please use the provided contxt functions,
 * never access the IDs directly outside this module and simply add
 * additional functions to the context if necessary.
 */

const DEFAULT_LOCALIZATION = {
  en: {
    PSA_SVC_TRB_CLS: "Closed",
    PSA_SVC_TRB_DON: "Done",
    PSA_SVC_TRB_DCS: "Decided",
    PSA_SVC_TRB_ACQ: "Captured",
    PSA_SVC_TRB_DSP: "Disposed",
    PSA_SVC_CAL: "Question",
    PSA_SVC_CPL: "Claim",
    PSA_SVC_SUP: "Support",
    PSA_SVC_TRB: "Fault",
    PSA_SVC_TRB_LIT: "Minor Fault",
  },
};

const DEFAULT_TICKET_STATUS_POSITIONS = {
  PSA_SVC_TRB: {
    initial_open: "PSA_SVC_TRB_ACQ",
    initial_closed: "PSA_SVC_TRB_CLS",
    open: [
      "PSA_SVC_TRB_ACQ",
      "PSA_SVC_TRB_DON",
      "PSA_SVC_TRB_DSP",
      "PSA_SVC_TRB_DCS",
    ],
    closed: ["PSA_SVC_TRB_CLS"],
  },
};

const DEFAULT_TICKET_TYPE = "PSA_SVC_TRB";

const QUICKFIXED_TENANT = DEVELOPMENT_ENVIRONMENT ? "psatst" : "jrint";

export function TenantContextProvider(props) {
  const [readyLocalization, setReadyLocalization] = useState(false);
  const [readySalesMeta, setReadySalesMeta] = useState(false);
  const [tenantLocalization, setTenantLocalization] = useState<any>();
  const [localizationTimestamp, setLocalizationTimestamp] = useState();
  const [ticketStatusPositions, setTicketStatusPositions] = useState<any>();
  const ticketTypesAsOptions = useRef({});

  useEffect(() => {
    const loadLocalization = async () => {
      if (!readySalesMeta) {
        return;
      }

      const localizationFile = `sales_idns${
        localizationTimestamp ? `_${localizationTimestamp}` : ""
      }.json`;

      try {
        const localizationResponse = await fetch(
          `${CDN_BASE_PATH}/cdn/i18ns/${QUICKFIXED_TENANT}/${localizationFile}`
        )
          .then(async (response) => {
            const result = await response.json();
            return result;
          })
          .catch(() => {});

        const localization = localizationResponse || DEFAULT_LOCALIZATION;
        setTenantLocalization(localization);
      } catch (error) {
        setTenantLocalization(DEFAULT_LOCALIZATION);
      }
      setReadyLocalization(true);
    };
    loadLocalization();
  }, [readySalesMeta, localizationTimestamp]);

  useEffect(() => {
    const loadSalesMeta = async () => {
      try {
        const salesMetaData = await callApiPost(
          `get-sales-meta/${QUICKFIXED_TENANT}`,
          {}
        );

        const ticketPositions = extractTicketStatusPositions(salesMetaData);
        setTicketStatusPositions(ticketPositions);
        setLocalizationTimestamp(extractLocalizationTimestamp(salesMetaData));
      } catch (error) {
        setTicketStatusPositions(DEFAULT_TICKET_STATUS_POSITIONS);
      }
      setReadySalesMeta(true);
    };
    loadSalesMeta();
  }, []);

  // useMemo, useEffect do not work here, the language is set too late
  // so we useRef to cache computation results
  const getTicketTypesAsOptions = () => {
    if (!readyLocalization || !readySalesMeta) {
      return [];
    }
    const language = getLanguage();
    if (!language) {
      return [];
    }
    const dictionary = getDictionary(tenantLocalization);
    if (isEmpty(dictionary)) {
      return [];
    }

    // stored version
    if (
      ticketTypesAsOptions.current &&
      !isEmpty(ticketTypesAsOptions.current[language])
    ) {
      return ticketTypesAsOptions.current[language];
    }

    // ok, let's compute the type names
    const tickettypes = keys(ticketStatusPositions);
    const result = sortBy(
      map(tickettypes, (tickettype) => ({
        value: tickettype,
        name: dictTranslate(tickettype, dictionary),
      })),
      "name"
    );
    ticketTypesAsOptions.current[language] = result;
    return result;
  };

  function isTicketStatusClosed(
    ticketType = DEFAULT_TICKET_TYPE,
    ticketStatus
  ) {
    if (isEmpty(ticketType) || isEmpty(ticketStatus)) {
      return false;
    }
    const positions = ticketStatusPositions[ticketType];
    if (isNil(positions)) {
      return false;
    }
    return positions.closed.indexOf(ticketStatus) >= 0;
  }

  function isTicketStatusOpen(ticketType = DEFAULT_TICKET_TYPE, ticketStatus) {
    if (isEmpty(ticketType) || isEmpty(ticketStatus)) {
      return false;
    }
    const positions = ticketStatusPositions[ticketType];
    if (isNil(positions)) {
      return false;
    }
    return positions.open.indexOf(ticketStatus) >= 0;
  }

  function getInitialTicketStatusOpen(ticketType = DEFAULT_TICKET_TYPE) {
    if (isEmpty(ticketType)) {
      return "";
    }
    const positions = ticketStatusPositions[ticketType];
    if (isNil(positions)) {
      return "";
    }
    let initial = positions.initial_open;
    if (!isNil(initial)) {
      return initial;
    }
    initial = head(positions.open);
    if (!isNil(initial)) {
      return initial;
    }
    return "";
  }

  function getInitialTicketStatusClosed(ticketType = DEFAULT_TICKET_TYPE) {
    if (isEmpty(ticketType)) {
      return "";
    }
    const positions = ticketStatusPositions[ticketType];
    if (isNil(positions)) {
      return "";
    }
    let initial = positions.initial_closed;
    if (!isNil(initial)) {
      return initial;
    }
    initial = head(positions.closed);
    if (!isNil(initial)) {
      return initial;
    }
    return "";
  }

  function isTenantContextReady() {
    return readyLocalization && readySalesMeta;
  }

  return (
    <TenantContext.Provider
      value={{
        tenantLocalization,
        isTicketStatusOpen,
        isTicketStatusClosed,
        getInitialTicketStatusOpen,
        getInitialTicketStatusClosed,
        getTicketTypesAsOptions,
        isTenantContextReady,
      }}
    >
      {props.children}
    </TenantContext.Provider>
  );
}

export function useTenantLocalization() {
  return React.useContext(TenantContext);
}

export function useTenantContext() {
  return React.useContext(TenantContext);
}

function extractTicketStatusPositions(metadata) {
  if (!metadata) {
    return DEFAULT_TICKET_STATUS_POSITIONS;
  }
  if (!metadata.ticket_status || !metadata.ticket_status.length) {
    return DEFAULT_TICKET_STATUS_POSITIONS;
  }

  const positions = createTicketStatusPositionsPerType(metadata.ticket_type);
  assignTicketStatiToTicketTypes(positions, metadata.ticket_status);
  filterInvalidTicketStatusPositions(positions);

  // keep default ticket type around if everything else fails
  if (isEmpty(positions)) {
    return DEFAULT_TICKET_STATUS_POSITIONS;
  }

  return positions;
}

function extractLocalizationTimestamp(metadata) {
  if (
    !metadata ||
    !metadata.localization_timestamp ||
    !metadata.localization_timestamp.length
  ) {
    return "";
  }
  return metadata.localization_timestamp[0].id;
}

function createTicketStatusPositionsPerType(ticketTypes) {
  if (isEmpty(ticketTypes)) {
    return {};
  }
  return reduce(
    ticketTypes,
    (accum, t) => {
      if (!t) {
        return accum;
      }
      accum[t.id] = createInitialTicketStatusPositions();
      return accum;
    },
    {}
  );
}

function assignTicketStatiToTicketTypes(ticketTypes, ticketStati) {
  reduce(
    ticketStati,
    (accum, value) => {
      if (!value) {
        return accum;
      }
      const { id, tags, ref } = value;
      if (isEmpty(id) || isNil(tags) || isEmpty(ref)) {
        return accum;
      }
      if (!accum[ref]) {
        accum[ref] = createInitialTicketStatusPositions();
      }
      const typePositions = accum[ref];

      const initial = tags.indexOf("initial") >= 0;
      if (tags.indexOf("open") >= 0) {
        typePositions.open.push(id);
        if (initial) {
          typePositions.initial_open = id;
        }
      } else if (tags.indexOf("done") >= 0) {
        typePositions.closed.push(id);
        if (initial) {
          typePositions.initial_closed = id;
        }
      }

      return accum;
    },
    ticketTypes
  );
}

function filterInvalidTicketStatusPositions(positions) {
  if (isEmpty(positions)) {
    return;
  }
  each(keys(positions), (k) => {
    const p = positions[k];
    if (isNil(p)) {
      return;
    }
    if (isEmpty(p.open) || isEmpty(p.closed)) {
      delete positions[k];
    }
  });
}

function createInitialTicketStatusPositions() {
  return {
    initial_open: undefined,
    initial_closed: undefined,
    open: [],
    closed: [],
  };
}
