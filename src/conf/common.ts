export const common = {
  apiUrl: import.meta.env.PROD
    ? 'http://api.money-manager.com'
    : 'http://localhost:3333',
}
