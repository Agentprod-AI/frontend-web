// pageTitleConfig.js
export const pageTitleConfig = [
  { pathname: "/dashboard", title: "Dashboard", hidden: true },
  { pathname: "/dashboard/mail", title: "Mail", hidden: true },
  { pathname: "/dashboard/chat", title: "Chat with Prod", hidden: true },
  { pathname: "/dashboard/campaign", title: "Campaign", hidden: false },
  { pathname: "/dashboard/leads", title: "Leads", hidden: false },
  { pathname: "/dashboard/campaign/create", title: "Create Campaign", hidden: false },
  {
    pathname: "/dashboard/campaign/create/scheduling-budget",
    title: "Scheduling and Budget",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/create/offering",
    title: "Offering",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/create/goal",
    title: "Goal",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/create/audience",
    title: "Audience",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/create/training",
    title: "Training",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/create/autopilot",
    title: "Autopilot",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/:id",
    title: "Campaign Details",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/:id/scheduling-budget",
    title: "Scheduling and Budget",
    hidden: false,
  },
  // {
  //   pathname: "/dashboard/campaign/:id/offering",
  //   title: "Offering",
  //   hidden: false,
  // },
  {
    pathname: "/dashboard/campaign/:id/goal",
    title: "Goal",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/:id/audience",
    title: "Audience",
    hidden: false,
  },
  {
    pathname: "/dashboard/campaign/:id/training",
    title: "Training",
    hidden: false,
  },
  // {
  //   pathname: "/dashboard/campaign/:id/autopilot",
  //   title: "Autopilot",
  //   hidden: false,
  // },
  {
    pathname: "/dashboard/profile",
    title: "Profile",
    hidden: false,
  },
  {
    pathname: "/dashboard/settings/account-info",
    title: "Settings",
    subTitle: "Account Info",
    hidden: false,
  },
  {
    pathname: "/dashboard/settings/mailbox",
    title: "Settings",
    subTitle: "Mailboxes",
    hidden: false,
  },
  {
    pathname: "/dashboard/settings/integration",
    title: "Settings",
    subTitle: "Integrations",
    hidden: false,
  }
  // Add more configurations as needed
];

export const matchPathname = (currentPathname: string, pattern: any) => {
  const regex = new RegExp(
    "^" + pattern.replace(/:[^\s/]+/g, "([\\w-]+)") + "$"
  );
  return regex.test(currentPathname);
};
