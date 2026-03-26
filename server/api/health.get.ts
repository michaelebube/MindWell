export default defineEventHandler(() => {
  return {
    status: 'ok',
    service: 'mindwell-web',
    timestamp: new Date().toISOString(),
  }
})