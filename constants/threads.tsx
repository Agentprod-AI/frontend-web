interface Person {
  name: string;
  imageUrl: string;
}

export interface Email {
  id: string;
  from: Person;
  to: Person;
  subject: string;
  body: string;
  timestamp: Date;
}

export interface ThreadEvents {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
}

interface ThreadData {
  emails: Email[];
  threadEvents: ThreadEvents[];
}

interface Thread {
  threadId: string;
  data: ThreadData;
  childThreads?: Thread[];
}
// Sample data
export const sampleThread: Thread = {
  threadId: "t123",
  data: {
    emails: [
      {
        id: "e001",
        from: {
          name: "Alex Johnson",
          imageUrl: "https://www.example.com/alex.jpg",
        },
        to: {
          name: "Casey Smith",
          imageUrl: "https://www.example.com/casey.jpg",
        },
        subject: "Weekly Project Update",
        body: "Hi Casey, please find the weekly update attached. Best, Alex",
        timestamp: new Date("2024-02-20T09:00:00Z"),
      },
      {
        id: "e002",
        from: {
          name: "Casey Smith",
          imageUrl: "https://www.example.com/casey.jpg",
        },
        to: {
          name: "Alex Johnson",
          imageUrl: "https://www.example.com/alex.jpg",
        },
        subject: "Re: Weekly Project Update",
        body: "Thanks Alex, I will review it and get back to you soon.",
        timestamp: new Date("2024-02-20T09:30:00Z"),
      },
      {
        id: "e002",
        from: {
          name: "Casey Smith",
          imageUrl: "https://www.example.com/casey.jpg",
        },
        to: {
          name: "Alex Johnson",
          imageUrl: "https://www.example.com/alex.jpg",
        },
        subject: "Re: Weekly Project Update",
        body: "Thanks Alex, I will review it and get back to you soon.",
        timestamp: new Date("2024-02-24T09:30:00Z"),
      },
      {
        id: "e002",
        from: {
          name: "Casey Smith",
          imageUrl: "https://www.example.com/casey.jpg",
        },
        to: {
          name: "Alex Johnson",
          imageUrl: "https://www.example.com/alex.jpg",
        },
        subject: "Re: Weekly Project Update",
        body: "Thanks Alex, I will review it and get back to you soon.",
        timestamp: new Date("2024-02-28T09:30:00Z"),
      },
    ],
    threadEvents: [
      {
        id: "ev001",
        title: "Document Shared",
        description: "Alex shared the project update document with Casey.",
        timestamp: new Date("2024-02-20T09:05:00Z"),
      },
      {
        id: "ev001",
        title: "Document Shared",
        description: "Alex shared the project update document with Casey.",
        timestamp: new Date("2024-02-22T09:05:00Z"),
      },
      {
        id: "ev001",
        title: "Document Shared",
        description: "Alex shared the project update document with Casey.",
        timestamp: new Date("2024-02-26T09:05:00Z"),
      },
    ],
  },
  childThreads: [
    {
      threadId: "t124",
      data: {
        emails: [
          {
            id: "e003",
            from: {
              name: "Casey Smith",
              imageUrl: "https://www.example.com/casey.jpg",
            },
            to: {
              name: "Project Team",
              imageUrl: "https://www.example.com/team.jpg",
            },
            subject: "Action Items for Next Week",
            body: "Team, please find your action items for next week attached. - Casey",
            timestamp: new Date("2024-02-21T10:00:00Z"),
          },
        ],
        threadEvents: [
          {
            id: "ev002",
            title: "Meeting Scheduled",
            description:
              "Casey scheduled a follow-up meeting for the project next Wednesday.",
            timestamp: new Date("2024-02-21T11:00:00Z"),
          },
        ],
      },
    },
    {
      threadId: "t125",
      data: {
        emails: [
          {
            id: "e004",
            from: {
              name: "Jordan Miles",
              imageUrl: "https://www.example.com/jordan.jpg",
            },
            to: {
              name: "Casey Smith",
              imageUrl: "https://www.example.com/casey.jpg",
            },
            subject: "Budget Approval Needed",
            body: "Casey, the budget for the next quarter needs your approval. Regards, Jordan",
            timestamp: new Date("2024-02-22T14:00:00Z"),
          },
        ],
        threadEvents: [
          {
            id: "ev003",
            title: "Budget Review",
            description:
              "Jordan requested Casey to review and approve the budget for the upcoming quarter.",
            timestamp: new Date("2024-02-22T14:05:00Z"),
          },
        ],
      },
    },
  ],
};

// Now, this 'sampleThread' object can be used in your application.

// You can now use the 'sampleThread' object in your React components or wherever you need to access thread data.
