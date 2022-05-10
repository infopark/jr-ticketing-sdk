import { sortBy } from "lodash";

const ticketsListSorters = {
  byCreationDate: {
    sorter(data) {
      return sortBy(data, (obj) => obj.creationDate).reverse();
    },
    label: "newest first",
  },
  reverseByCreationDate: {
    sorter(data) {
      return sortBy(data, (obj) => obj.creationDate);
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

const eventListSorters = {
  byBeginDate: {
    sorter(data) {
      return sortBy(data, (obj) => obj.beginDate);
    },
    label: "By begin date",
  },
  reverseByBeginDate: {
    sorter(data) {
      return sortBy(data, (obj) => obj.beginDate).reverse();
    },
    label: "By begin date reverse",
  },
  byTitle: {
    sorter(data) {
      return sortBy(data, (obj) => obj.title);
    },
    label: "By title",
  },
  reverseByTitle: {
    sorter(data) {
      return sortBy(data, (obj) => obj.title).reverse();
    },
    label: "By title reverse",
  },
  byNum: {
    sorter(data) {
      return sortBy(data, (obj) => obj.eventNum);
    },
    label: "By number",
  },
  reverseByNum: {
    sorter(data) {
      return sortBy(data, (obj) => obj.eventNum).reverse();
    },
    label: "By number reverse",
  },
};

export { ticketsListSorters, eventListSorters };
