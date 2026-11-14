import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { getAuthErrorMessage } from '../utils/authUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('[CampusFlow Auth] Auth state change error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Signup
  const signup = async (email, password, displayName = '') => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured. Please add your Firebase credentials to environment variables.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim(),
        });
      }
      return userCredential.user;
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Login
  const login = async (email, password) => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured. Please add your Firebase credentials to environment variables.');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return userCredential.user;
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Logout
  const logout = async () => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      setCurrentUser(null);
      return;
    }
    try {
      await signOut(auth);
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Forgot Password / Password Reset
  const resetPassword = async (email) => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured. Please add your Firebase credentials to environment variables.');
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Update User Profile (displayName, photoURL)
  const updateUserProfile = async ({ displayName, photoURL }) => {
    setAuthError(null);
    if (!auth?.currentUser) {
      return;
    }
    try {
      const updateData = {};
      if (displayName !== undefined) updateData.displayName = displayName.trim();
      if (photoURL !== undefined) updateData.photoURL = photoURL;
      await updateProfile(auth.currentUser, updateData);
      setCurrentUser({ ...auth.currentUser });
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Update Password
  const updateUserPassword = async (newPassword) => {
    setAuthError(null);
    if (!auth?.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Delete User Account
  const deleteUserAccount = async () => {
    setAuthError(null);
    if (!auth?.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    try {
      await deleteUser(auth.currentUser);
      setCurrentUser(null);
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        setAuthError,
        signup,
        login,
        logout,
        resetPassword,
        updateUserProfile,
        updateUserPassword,
        deleteUserAccount,
        isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
