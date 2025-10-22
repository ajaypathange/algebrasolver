export const getUserId = () => {
  let userId = localStorage.getItem("algebraSolverId")
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("algebraSolverId", userId)
  }
  return userId
}

export const clearUserId = () => {
  localStorage.removeItem("algebraSolverId")
}
