import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, updateProfile } from '../services/authService.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      setUser(res);
      localStorage.setItem('user', JSON.stringify(res));
      toast.success(`Welcome back, ${res.name}! 👋`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

const register = async (data) => {
  try {
    setLoading(true);

    const res = await registerUser(data);

    console.log("REGISTER RESPONSE:", res);

    if (!res || !res.token) {
      throw new Error("Invalid server response");
    }

    setUser(res);
    localStorage.setItem("user", JSON.stringify(res));

    toast.success(`Welcome ${res.name}! 🎉`);

    return true;

  } catch (error) {

    console.log("FULL ERROR:", error?.response?.data || error.message);

    toast.error(
      error?.response?.data?.message ||
      error.message ||
      "Registration failed"
    );

    return false;

  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
  };

  const updateUser = async (data) => {
    try {
      setLoading(true);
      const res = await updateProfile(data);
      setUser(res);
      localStorage.setItem('user', JSON.stringify(res));
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;