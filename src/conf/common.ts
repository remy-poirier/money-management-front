export const common = {
  apiUrl: import.meta.env.PROD
    ? 'https://api.money-manager.tech'
    : 'http://localhost:3333',
}
