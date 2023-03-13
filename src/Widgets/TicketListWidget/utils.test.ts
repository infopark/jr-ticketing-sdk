import { ticketFilters, ticketSorters } from "./utils";

const tickets = [
  {
    psa_ticket_num: "CL-23-000017",
    psa_ticket_type: "PSA_SVC_CAL",
    id: "f1b5349e-a218-4768-bf5a-1458a10d3a4d",
    number: 35,
    title: "New Year Review",
    type: null,
    status: "closed",
    created_at: "2023-01-09T09:06:26.000Z",
    updated_at: "2023-01-09T09:42:00.000Z"
  },
  {
    psa_ticket_num: "TT-22-004913",
    psa_ticket_type: "PSA_SVC_TRB",
    id: "8f93cc11-2566-4897-9e28-fbca942f3e59",
    number: 3,
    title: "Wednesday Wednesday",
    type: null,
    status: "open",
    created_at: "2022-12-14T08:55:20.000Z",
    updated_at: "2022-12-27T11:25:09.000Z"
  },
  {
    psa_ticket_num: "TT-22-004917",
    psa_ticket_type: "PSA_SVC_TRB",
    id: "345f78e7-83dc-4272-b9d5-f7c665752140",
    number: 6,
    title: "Thursday Thursday",
    type: null,
    status: "closed",
    created_at: "2022-12-15T09:46:12.000Z",
    updated_at: "2022-12-27T11:25:07.000Z"
  },
  {
    psa_ticket_num: "CP-23-000020",
    psa_ticket_type: "PSA_SVC_CPL",
    psa_ticket_status: "PSA_SVC_CPL_ACQ",
    id: "fb7b5230-f710-4ad0-b2f0-9888a68ded3e",
    number: 38,
    title: "Back from vacation",
    type: null,
    status: "open",
    created_at: "2023-01-23T09:06:46.000Z",
    updated_at: "2023-01-23T09:43:00.000Z"
  },
  {
    psa_ticket_num: "TT-22-004914",
    psa_ticket_type: "PSA_SVC_TRB",
    id: "51f38301-5c44-46b1-9a88-1ceda77588f1",
    number: 2,
    title: "Tuesday Tuesday",
    type: null,
    status: "new",
    created_at: "2022-12-13T19:45:13.000Z",
    updated_at: "2022-12-27T11:25:08.000Z"
  },
  {
    psa_ticket_num: "TT-23-000016",
    psa_ticket_type: "PSA_SVC_TRB",
    id: "1264447b-12fd-4639-a99a-e2c663bd89f5",
    number: 34,
    title: "Test for Monday",
    type: null,
    status: "new",
    created_at: "2023-01-09T09:02:35.000Z",
    updated_at: "2023-01-09T10:42:00.000Z"
  }
]

describe("ticketSorters", () => {
  describe("byCreatedAt", () => {
    it("sorts tickets by .created_at in ascending order", () => {
      const sortedTickets = ticketSorters.byCreatedAt.sort(tickets);
      const sortedIds = sortedTickets.map((t) => t.id);

      expect(sortedIds).toEqual([
        '51f38301-5c44-46b1-9a88-1ceda77588f1',
        '8f93cc11-2566-4897-9e28-fbca942f3e59',
        '345f78e7-83dc-4272-b9d5-f7c665752140',
        '1264447b-12fd-4639-a99a-e2c663bd89f5',
        'f1b5349e-a218-4768-bf5a-1458a10d3a4d',
        'fb7b5230-f710-4ad0-b2f0-9888a68ded3e',
      ]);
    });
  });

  describe("reverseByCreatedAt", () => {
    it("sorts tickets by .created_at in descending order", () => {
      const sortedTickets = ticketSorters.reverseByCreatedAt.sort(tickets);
      const sortedIds = sortedTickets.map((t) => t.id);

      expect(sortedIds).toEqual([
        'fb7b5230-f710-4ad0-b2f0-9888a68ded3e',
        'f1b5349e-a218-4768-bf5a-1458a10d3a4d',
        '1264447b-12fd-4639-a99a-e2c663bd89f5',
        '345f78e7-83dc-4272-b9d5-f7c665752140',
        '8f93cc11-2566-4897-9e28-fbca942f3e59',
        '51f38301-5c44-46b1-9a88-1ceda77588f1',
      ]);
    });
  });
});

describe("ticketFilters", () => {
  describe("open", () => {
    it("filter tickets by stage 'open'", () => {
      const filteredTickets = ticketFilters.open.filter(tickets);
      const filteredIds = filteredTickets.map((t) => t.id);

      expect(filteredIds).toEqual([
        "8f93cc11-2566-4897-9e28-fbca942f3e59",
        "fb7b5230-f710-4ad0-b2f0-9888a68ded3e"
      ]);
    });
  });
});
