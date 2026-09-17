export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
export const LocalStorageEventTarget = new EventTarget()

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('emailAccount')
  localStorage.removeItem('role')
  localStorage.removeItem('userId')
  localStorage.removeItem('groupId')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
