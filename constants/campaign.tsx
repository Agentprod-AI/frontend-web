export interface CampaignInterface {
    isEnabled?: boolean;
    campaignId?: number;
    campaignName?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date
    userId?: string;
    goalId?: string;
    analytics?: object
  }

export const DummyCampaign: CampaignInterface[] = [
    {
      isEnabled: true,
      campaignId: 1,
      campaignName: "Strategic Finance Analyst",
      startDate: new Date('2024-02-27T00:00:00.000Z'),
      endDate: new Date('2024-02-28T23:59:59.999Z'),
      createdAt: new Date('2024-02-27T07:15:00.000Z'),
      userId: "1",
      goalId: "1",
      analytics: {
        active: 1734,
        paused: 15,
        notSent: 1,
        bounced: 9,
        finished: 2,
        scheduled: 1734,
        delivered: 290,
        open: 12.4,
        reply: 1,
        interested: 20
      }
    },
    {
      isEnabled: false,
      campaignId: 2,
      campaignName: "Ricardo Reachout to Phillipines YC Senior Engineers",
      startDate: new Date('2024-02-27T00:00:00.000Z'),
      endDate: new Date('2024-03-01T23:07:00.00Z'),
      createdAt: new Date('2024-02-27T07:27:00.000Z'),
      userId: "2",
      goalId: "2",
      analytics: {
        active: 200,
        paused: 7,
        notSent: 3,
        bounced: 5,
        finished: 70,
        scheduled: 115,
        delivered: 10,
        open: 20.6,
        reply: 2.7,
        interested: 3
      }
    }
  ];