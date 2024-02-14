export const common = {
  apiUrl: import.meta.env.PROD
    ? 'https://api.money-manager.com'
    : 'http://localhost:3333',
}
