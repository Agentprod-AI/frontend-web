export const config = {
  serverUrl:
    process.env.NEXT_PUBLIC_LOCAL_SERVER === "true"
      ? "http://localhost:3001/v2/"
      : "",
};
