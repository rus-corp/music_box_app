import { authBackend } from "./_variables"


export const authPost = async (params) => {
  try {
    const response = await authBackend.post(
      '/auth/token',
      params,
      {headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }}
    )
    return response
  } catch (error) {
    return error.response
  }
}