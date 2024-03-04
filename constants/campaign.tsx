export interface CampaignInterface {
    campaignId: number;
    campaignName: string;
    status: boolean;
    startDate: Date;
    endDate: Date;
    createdAt: Date
    userId?: string;
    goalId?: string;
    analytics: object
  }

export const DummyCampaign: CampaignInterface[] = [
    {
      status: true,
      campaignId: 1,
      campaignName: "Strategic Finance Analyst",
      startDate: new Date('2024-02-27T00:00:00.000Z'),
      endDate: new Date('2024-02-28T23:59:59.999Z'),
      createdAt: new Date('2024-02-27T07:15:00.000Z'),
      userId: "1",
      goalId: "1",
      analytics: {
        active: "1734",
        paused: "",
        notSent: "1",
        bounced: "9",
        finished: "2",
        scheduled: "1734",
        delivered: "290",
        open: "12.4%",
        reply: "",
        interested: "20%"
      }
    },
    {
      status: true,
      campaignId: 2,
      campaignName: "Ricardo Reachout to Phillipines YC Senior Engineers",
      startDate: new Date('2024-02-27T00:00:00.000Z'),
      endDate: new Date('2024-03-01T23:07:00.00Z'),
      createdAt: new Date('2024-02-27T02:27:00.000Z'),
      userId: "2",
      goalId: "2",
      analytics: {
        active: "200",
        paused: "7",
        notSent: "3",
        bounced: "5",
        finished: "70",
        scheduled: "115",
        delivered: "10",
        open: "20.65%",
        reply: "2.7%",
        interested: ""
      }
    },
    {
      status: false,
      campaignId: 3,
      campaignName: "22Q2 - SDR Manager US",
      startDate: new Date('2024-03-27T02:00:00.000Z'),
      endDate: new Date('2024-04-01T23:07:00.00Z'),
      createdAt: new Date('2024-02-27T09:46:00.000Z'),
      userId: "3",
      goalId: "3",
      analytics: {
        active: "",
        paused: "",
        notSent: "",
        bounced: "",
        finished: "",
        scheduled: "0",
        delivered: "0",
        open: "",
        reply: "",
        interested: ""
      }
    },
    {
      status: true,
      campaignId: 4,
      campaignName: "22Q2 - Account Executive V3 (US Companies LATAM)",
      startDate: new Date('2024-03-15T02:00:00.000Z'),
      endDate: new Date('2024-04-01T23:07:00.00Z'),
      createdAt: new Date('2024-02-27T11:24:00.000Z'),
      userId: "4",
      goalId: "4",
      analytics: {
        active: "743",
        paused: "5",
        notSent: "246",
        bounced: "174",
        finished: "114",
        scheduled: "59",
        delivered: "863",
        open: "38.4%",
        reply: "7.6%",
        interested: "2.2%"
      }
    }
  ];