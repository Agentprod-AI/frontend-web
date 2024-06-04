/* eslint-disable no-console */

export const hubspotLogin = (userid: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}v2/hubspot/login/${userid}`;
};

export const salesforceLogin = (userid: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}v2/salesforce/login/${userid}`;
};
