export const login = (token, role, userId) => ({
    type: 'LOGIN',
    payload: { token, role, userId }
  });
  
  export const logout = () => ({
    type: 'LOGOUT'
  });
  