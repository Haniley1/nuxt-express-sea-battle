export const useAuth = () => {
  const sessionTokenCookie = useCookie<string>('token')
  const sessionNicknameCookie = useCookie<string>('nickname')

  const login = async (username: string) => {
    try {
      const { data, error } = await useFetch(`http://localhost:4000/auth/login`, {
        method: 'POST',
        body: { username },
        credentials: 'include'
      });

      if (error.value) {
        throw new Error(error.value.data?.error || 'Ошибка входа');
      }
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Выход
  const logout = async () => {
    try {
      await $fetch(`http://localhost:4000/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    isAuthenticated: computed(() => !!sessionTokenCookie.value),
    nickname: computed(() => sessionNicknameCookie.value),
    login,
    logout,
  };
};