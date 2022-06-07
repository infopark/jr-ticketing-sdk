import { ticketsListSorters } from "../../src/utils/listSorters";

const ticketList = [
  {
    id: 201,
    title: "Test question",
    status: "PSA_SVC_TRB_ACQ",
    description: "test description",
    progress: 0,
    ticketid: "59576827-96aa-4a02-be20-6ebe45ed16db",
    tickettype: "PSA_SVC_TRB",
    ticketnum: "d418fa51-53d1-43e0-b314-749430825d3e",
    creationdate: "2022-01-12T14:27:15.255Z",
    userid: "b33a13c8-c8bc-4dc1-bdd6-26f1e523bedd",
    salesid: null,
    updatedate: "2022-01-12T14:27:15.255Z",
  },
  {
    id: 332,
    title: "Simple question of life, universe and everything",
    status: "PSA_SVC_TRB_ACQ",
    description: "So what is the ultimate question?",
    progress: 0,
    ticketid: "10f83582-c82f-4af1-ba82-cc14054ab2a2",
    tickettype: "PSA_SVC_TRB",
    ticketnum: "f5cd51c8-caf2-4fc9-8f72-f62790b5b0ce",
    creationdate: "2022-01-13T14:32:13.858Z",
    userid: "b33a13c8-c8bc-4dc1-bdd6-26f1e523bedd",
    salesid: null,
    updatedate: "2022-01-13T14:32:13.858Z",
  },
  {
    id: 430,
    title: "How many tickets should I write?",
    status: "PSA_SVC_TRB_ACQ",
    description: "I feel like I wrote thousands of them already",
    progress: 0,
    ticketid: "7058c5ad-87b1-4896-bdd7-adf9225ab456",
    tickettype: "PSA_SVC_TRB",
    ticketnum: "ce3159d7-7d09-47c4-a144-e1af8c2654d2",
    creationdate: "2022-01-20T12:31:50.210Z",
    userid: "b33a13c8-c8bc-4dc1-bdd6-26f1e523bedd",
    salesid: null,
    updatedate: "2022-01-20T12:31:50.210Z",
  },
];

describe("ticket sorters", () => {
  it("sorts tickets by newest", () => {
    expect(ticketsListSorters.byCreationDate.sorter(ticketList)[0]).toEqual({
      id: 430,
      title: "How many tickets should I write?",
      status: "PSA_SVC_TRB_ACQ",
      description: "I feel like I wrote thousands of them already",
      progress: 0,
      ticketid: "7058c5ad-87b1-4896-bdd7-adf9225ab456",
      tickettype: "PSA_SVC_TRB",
      ticketnum: "ce3159d7-7d09-47c4-a144-e1af8c2654d2",
      creationdate: "2022-01-20T12:31:50.210Z",
      userid: "b33a13c8-c8bc-4dc1-bdd6-26f1e523bedd",
      salesid: null,
      updatedate: "2022-01-20T12:31:50.210Z",
    });
  });
  it("sorts tickets by oldest", () => {
    expect(
      ticketsListSorters.reverseByCreationDate.sorter(ticketList)[0]
    ).toEqual({
      id: 201,
      title: "Test question",
      status: "PSA_SVC_TRB_ACQ",
      description: "test description",
      progress: 0,
      ticketid: "59576827-96aa-4a02-be20-6ebe45ed16db",
      tickettype: "PSA_SVC_TRB",
      ticketnum: "d418fa51-53d1-43e0-b314-749430825d3e",
      creationdate: "2022-01-12T14:27:15.255Z",
      userid: "b33a13c8-c8bc-4dc1-bdd6-26f1e523bedd",
      salesid: null,
      updatedate: "2022-01-12T14:27:15.255Z",
    });
  });
});
