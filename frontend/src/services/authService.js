// En desarrollo usa proxy de Vite, en producción usa variable de entorno
const API_URL = import.meta.env.PROD 
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : '/api/auth';

export const authService = {
  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al registrar');
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al conectar con el servidor'
      };
    }
  },

  async logout() {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      return response.json();
    } catch (error) {
      throw new Error('Error al cerrar sesión');
    }
  },

  async getProfile() {
    try {
      const response = await fetch(`${API_URL}/me`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }
};
