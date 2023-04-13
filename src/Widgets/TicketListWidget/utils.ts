export function combineUrl(baseUrl, ticketId) {
  if (!baseUrl || !ticketId) {
    return null;
  }

  const parsedUrl = new URL(baseUrl);
  parsedUrl.searchParams.set("ticketid", ticketId);

  return parsedUrl.toString();
}

export const ticketSorters = {
  byNumber: {
    sort: (objects) => {
      return [...objects].sort(dynamicSort("number"));
    },
  },
  reverseByNumber: {
    sort(objects) {
      return [...objects].sort(dynamicSort("-number"));
    },
  },
  byCreatedAt: {
    sort: (objects) => {
      return [...objects].sort(dynamicSort("created_at"));
    },
  },
  reverseByCreatedAt: {
    sort(objects) {
      return [...objects].sort(dynamicSort("-created_at"));
    },
  },
  byUpdatedAt: {
    sort: (objects) => {
      return [...objects].sort(dynamicSort("updated_at"));
    },
  },
  reverseByUpdatedAt: {
    sort(objects) {
      return [...objects].sort(dynamicSort("-updated_at"));
    },
  },
};

export const ticketFilters = {
  all: {
    filter: (objects) => {
      return objects;
    }
  },
  active: {
    filter: (objects) => {
      return objects.filter((o) => o.status !== "closed");
    }
  },
  new: {
    filter: (objects) => {
      return objects.filter((o) => o.status === "new");
    }
  },
  open: {
    filter: (objects) => {
      return objects.filter((o) => o.status === "open");
    }
  },
  waiting: {
    filter: (objects) => {
      return objects.filter((o) => o.status === "waiting");
    }
  },
  closed: {
    filter: (objects) => {
      return objects.filter((o) => o.status === "closed");
    }
  },
};

/*
 * @link https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
 */
function dynamicSort(property: string) {
  let sortOrder = 1;
  let sortProp = property;

  if(property[0] === "-") {
    sortOrder = -1;
    sortProp = property.substr(1);
  }

  return function (a, b) {
    const av = a[sortProp];
    const bv = b[sortProp];

    switch(true) {
      case av < bv: return -1 * sortOrder;
      case av > bv: return 1 * sortOrder;
      default: return 0;
    }
  };
}
