export const config = {
    serverUrl:
      process.env.NEXT_PUBLIC_LOCAL_SERVER === 'true'
        ? 'http://localhost:8080/api/v1'
        : '',
  };
  