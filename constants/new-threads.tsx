export interface User {
  userID: string;
  name: string;
  emailAddress: string;
  role: string; // Consider making this an enum if you have a predefined list of roles
}

export interface Contact {
  contactID: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyID: string; // Reference to a Company
  status: "New" | "Contacted" | "Responded" | "Not Interested"; // Consider using an enum for predefined statuses
}

export interface Company {
  companyID: string;
  name: string;
  industry: string;
  size: number;
  address: string;
}

export interface EmailCampaign {
  campaignID: string;
  name: string;
  userID: string; // Reference to a User
  templateID: string; // Reference to an EmailTemplate
  status: "Draft" | "Scheduled" | "Sent"; // Could be an enum for status
  scheduledDateTime: Date;
}

export interface EmailTemplate {
  templateID: string;
  subject: string;
  bodyHTML: string;
  bodyText: string;
  creatorID: string; // Reference to a User
}

export interface EmailLog {
  emailLogID: string;
  campaignID: string; // Reference to an EmailCampaign
  contactID: string; // Reference to a Contact
  sendDateTime: Date;
  openDateTime?: Date;
  clickDateTime?: Date;
  responseDateTime?: Date;
  status: "Sent" | "Opened" | "Clicked" | "Responded" | "Bounced"; // This could be an enum
}

export interface EmailReply {
  replyID: string;
  emailLogID: string; // Reference to an EmailLog
  receivedDateTime: Date;
  fromAddress: string;
  toAddress: string;
  subject: string;
  body: string;
  sentiment: "Positive" | "Neutral" | "Negative"; // Could be an enum
  category:
    | "Interested"
    | "Not Interested"
    | "Request for Information"
    | "Complaint"; // This might be an enum
  followUpActionID?: string; // Reference to a FollowUpAction, optional
}

export interface FollowUpAction {
  actionID: string;
  actionType: "Send Information" | "Schedule Call" | "No Action Needed"; // Could be an enum
  templateID?: string; // Reference to an EmailTemplate, optional
  description: string;
}

// Expanded dummy data for multiple elements

export const users: User[] = [
  {
    userID: "u1",
    name: "Carlo",
    emailAddress: "carlo@firstquadrant.com",
    role: "Sales",
  },
  {
    userID: "u2",
    name: "Alexa",
    emailAddress: "alexa@firstquadrant.com",
    role: "Engineering",
  },
];

export const companies: Company[] = [
  {
    companyID: "c1",
    name: "Neon",
    industry: "Technology",
    size: 200,
    address: "123 Tech Lane, San Francisco, CA",
  },
  {
    companyID: "c2",
    name: "Lumos",
    industry: "Healthcare",
    size: 150,
    address: "456 Health St, San Francisco, CA",
  },
];

export const contacts: Contact[] = [
  {
    contactID: "ct1",
    firstName: "Nikita",
    lastName: "Shamgunov",
    email: "nikita@neon.com",
    phone: "555-1234",
    companyID: "c1",
    status: "Not Interested",
  },
  {
    contactID: "ct2",
    firstName: "Emma",
    lastName: "Stone",
    email: "emma@lumos.com",
    phone: "555-5678",
    companyID: "c2",
    status: "New",
  },
];

export const emailCampaigns: EmailCampaign[] = [
  {
    campaignID: "ec1",
    name: "Tech Founders in SF",
    userID: "u1",
    templateID: "et1",
    status: "Sent",
    scheduledDateTime: new Date("2024-02-29T09:00:00"),
  },
  {
    campaignID: "ec2",
    name: "Healthcare Innovators in SF",
    userID: "u2",
    templateID: "et2",
    status: "Draft",
    scheduledDateTime: new Date("2024-03-01T10:00:00"),
  },
];

export const emailTemplates: EmailTemplate[] = [
  {
    templateID: "et1",
    subject: "Innovative AI Solutions for Your Business",
    bodyHTML: "<p>Hi, check out our new AI product...</p>",
    bodyText: "Hi, check out our new AI product...",
    creatorID: "u1",
  },
  {
    templateID: "et2",
    subject: "Revolutionizing Healthcare with Data",
    bodyHTML: "<p>Hello, discover how data can transform healthcare...</p>",
    bodyText: "Hello, discover how data can transform healthcare...",
    creatorID: "u2",
  },
];

export const emailLogs: EmailLog[] = [
  {
    emailLogID: "el1",
    campaignID: "ec1",
    contactID: "ct1",
    sendDateTime: new Date("2024-02-29T09:05:00"),
    status: "Sent",
  },
  {
    emailLogID: "el2",
    campaignID: "ec2",
    contactID: "ct2",
    sendDateTime: new Date("2024-03-01T10:05:00"),
    status: "Clicked",
  },
];

export const emailReplies: EmailReply[] = [
  {
    replyID: "er2",
    emailLogID: "el2",
    receivedDateTime: new Date("2024-02-01T10:30:00"),
    fromAddress: "naman.barkiya@gmail.com",
    toAddress: "nikita@neon.com",
    subject: "Innovative AI Solutions for Your Business",
    body: "This is our product. Please let me know if you are interested.",
    sentiment: "Positive",
    category: "Interested",
  },
  {
    replyID: "er1",
    emailLogID: "el1",
    fromAddress: "nikita@neon.com",
    toAddress: "naman.barkiya@gmail.com",
    receivedDateTime: new Date("2024-02-02T09:10:00"),
    subject: "Re: Innovative AI Solutions for Your Business",
    body: "I am excited. Please let me know more about the product.",
    sentiment: "Positive",
    category: "Request for Information",
    followUpActionID: "fa2",
  },
  {
    replyID: "er1",
    emailLogID: "el1",
    fromAddress: "naman.barkiya@gmail.com",
    toAddress: "nikita@neon.com",
    receivedDateTime: new Date("2024-02-03T09:10:00"),
    subject: "Re: Innovative AI Solutions for Your Business",
    body: "This is detailed information about the product.",
    sentiment: "Negative",
    category: "Not Interested",
    // followUpActionID: "fa2",
  },
  {
    replyID: "er1",
    emailLogID: "el1",
    fromAddress: "nikita@neon.com",
    toAddress: "naman.barkiya@gmail.com",
    receivedDateTime: new Date("2024-02-04T09:10:00"),
    subject: "Re: Innovative AI Solutions for Your Business",
    body: "Please remove me from your mailing list.",
    sentiment: "Negative",
    category: "Not Interested",
    // followUpActionID: "fa2",
  },
];

export const followUpActions: FollowUpAction[] = [
  {
    actionID: "fa1",
    actionType: "No Action Needed",
    description: "Contact has requested to be removed from the mailing list.",
    templateID: "et1",
  },
  {
    actionID: "fa2",
    actionType: "Send Information",
    description: "Contact has requested more information about the product.",
    templateID: "et2",
  },
];
