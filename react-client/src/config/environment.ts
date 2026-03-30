export const environment = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  hubUrl: import.meta.env.VITE_HUB_URL as string,
  production: import.meta.env.PROD,
};