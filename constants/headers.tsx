// pageTitleConfig.js
export const pageTitleConfig = [
  { pathname: "/dashboard", title: "Dashboard", hidden: false },
  { pathname: "/dashboard/mail", title: "Mail", hidden: true },
  { pathname: "/dashboard/chat", title: "Chat with Prod", hidden: true },
  { pathname: "/dashboard/campaign", title: "Campaign", hidden: false },
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
  {
    pathname: "/dashboard/campaign/:id/offering",
    title: "Offering",
    hidden: false,
  },
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
  {
    pathname: "/dashboard/campaign/:id/autopilot",
    title: "Autopilot",
    hidden: false,
  },
  {
    pathname: "/dashboard/profile",
    title: "Profile",
    hidden: false,
  },
  // Add more configurations as needed
];

export const matchPathname = (currentPathname: string, pattern: any) => {
  const regex = new RegExp(
    "^" + pattern.replace(/:[^\s/]+/g, "([\\w-]+)") + "$",
  );
  return regex.test(currentPathname);
};
