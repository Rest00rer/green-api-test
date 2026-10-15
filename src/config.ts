export const greenApiDefaults = {
  baseUrl: import.meta.env.VITE_GREEN_API_URL ?? 'https://api.green-api.com',
  idInstance: import.meta.env.VITE_GREEN_API_INSTANCE ?? '',
  apiTokenInstance: '',
}
