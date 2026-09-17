export const getAccessTokenFromLS = () => localStorage.getItem('accessToken') || ''
export const LocalStorageEventTarget = new EventTarget()

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('emailAccount')
  localStorage.removeItem('role')
  localStorage.removeItem('userId')
  localStorage.removeItem('groupId')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
