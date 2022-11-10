import { sortBy } from "lodash";

const ticketsListSorters = {
  byCreationDate: {
    sorter(data) {
      return sortBy(data, (obj) => obj.created_at).reverse();
    },
    label: "newest first",
  },
  reverseByCreationDate: {
    sorter(data) {
      return sortBy(data, (obj) => obj.created_at);
    },
    label: "oldest first",
  },
  // DO NOT REMOVE.
  // byProgress: {
  //   sorter(data) {
  //     return sortBy(
  //       data,
  //       (obj) => !isNaN(parseInt(obj.SUC_PRB, 10)) && parseInt(obj.SUC_PRB, 10)
  //     ).reverse();
  //   },
  //   label: "highest progress first",
  // },
  // reverseByProgress: {
  //   sorter(data) {
  //     return sortBy(
  //       data,
  //       (obj) => !isNaN(parseInt(obj.SUC_PRB, 10)) && parseInt(obj.SUC_PRB, 10)
  //     );
  //   },
  //   label: "lowest progress first",
  // },
};

export { ticketsListSorters };
