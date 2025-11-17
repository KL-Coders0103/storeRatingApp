import React, { createContext, startTransition, useEffect, useState } from 'react';
import {authAPI} from '../services/api.js'

export const AuthContext = createContext()


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        startTransition(() => {
        if(token && userData){
                setUser(JSON.parse(userData));
                authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            setLoading(false)
        });
    }, [])

    const login = async(email, password) => {
        try{
            const response = await authAPI.post('/auth/login', {email, password})
            const {user: userData, token} = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(userData))
            authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(userData)

            return {success: true}
        } catch (error) {
            return{
                success: false,
                error: error.response?.data?.error || 'Login Failed'
            }
        }
    }

    const register = async(userData) => {
        try {
            const response = await authAPI.post('/auth/register', userData)
            const {user: newUser, token} = response.data
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(newUser))
            authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(newUser)

            return {success: true}
        } catch (error) {
            return{
                success: false,
                error: error.response?.data?.error || 'Registration Failed'
            }
        }
    }

    const logout = () => {
        return new Promise((resolve) => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete authAPI.defaults.headers.common['Authorization']
        setUser(null)
        setTimeout(() => {
            resolve()
        }, 50)
    })
}

    const updatePassword = async(passwordData) => {
        try{
            await authAPI.put('/auth/password', passwordData)
            return {success: true}
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Password update failed'
            }
        }
    }

    const value = {
        user,
        login,
        register,
        logout,
        updatePassword,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}