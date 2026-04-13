import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      if (user) {
        const flag = await AsyncStorage.getItem(`@onboarding_${user.uid}`);
        setHasCompletedOnboarding(flag === 'true');
      } else {
        setHasCompletedOnboarding(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const completeOnboarding = async () => {
    if (currentUser) {
      await AsyncStorage.setItem(`@onboarding_${currentUser.uid}`, 'true');
      setHasCompletedOnboarding(true);
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, hasCompletedOnboarding, loginWithEmail, registerWithEmail, completeOnboarding, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
