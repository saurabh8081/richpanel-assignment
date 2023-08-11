'use client';
import React, { createContext, useState, useEffect } from 'react';
import api, { setAuthToken, getAuthToken, removeAuthToken } from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const token = getAuthToken();
            if (token) {
              setAuthToken(token);
              setLoading(true);
              const res = await api.get('/users/me');
              setUser(res.data);
              setLoading(false);
            }
          } catch (error) {
            handleApiError(error);
          } finally {
            setLoading(false);
          }
        };
        fetchUser();
      }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const res = await api.post('/users/login', { email, password });
            if (res.status === 200) {
                setSuccess(res.data.msg);
            }
            setAuthToken(res.data.token);
            setUser(res.data.user);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.msg);
            }
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            handleApiError(error);
        }
        setUser(null);
        removeAuthToken();
    };

    const register = async (name, email, password) => {

        setLoading(true);
        try {
            const res = await api.post('/users/register', { name, email, password });
            if (res.status === 200) {
                setSuccess(res.data.msg);
            }
            setAuthToken(res.data.token);
            setUser(res.data.user);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.msg);
            }
            handleApiError(error);
        }
        setLoading(false);
    };    

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, error, success }}>
            {children}
        </AuthContext.Provider>
    );
};