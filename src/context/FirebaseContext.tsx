import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  auth, 
  firebaseConfig, 
  testFirebaseConnection, 
  signInWithGoogle as fbSignInWithGoogle, 
  signOutFirebase, 
  onAuthChange 
} from '../services/firebase';
import { UserProfile } from '../types';

export type FirebaseConnectionStatus = 'connecting' | 'connected' | 'offline' | 'error';

interface FirebaseContextType {
  isConfigured: boolean;
  projectId: string;
  authDomain: string;
  status: FirebaseConnectionStatus;
  statusMessage: string;
  currentFirebaseUser: FirebaseUser | null;
  checkConnection: () => Promise<boolean>;
  signInWithGoogle: () => Promise<{ user: FirebaseUser | null; error?: string }>;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<FirebaseConnectionStatus>('connecting');
  const [statusMessage, setStatusMessage] = useState<string>('Connecting to Firebase...');
  const [currentFirebaseUser, setCurrentFirebaseUser] = useState<FirebaseUser | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setStatus('connecting');
    setStatusMessage('Checking Firestore connection...');
    try {
      const res = await testFirebaseConnection();
      if (res.success) {
        setStatus('connected');
        setStatusMessage(res.message);
        return true;
      } else {
        setStatus('offline');
        setStatusMessage(res.message);
        return false;
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err?.message || 'Failed to connect to Firebase.');
      return false;
    }
  }, []);

  useEffect(() => {
    // Check initial connection
    checkConnection();

    // Listen to Firebase Auth state
    const unsubscribe = onAuthChange((user) => {
      setCurrentFirebaseUser(user);
    });

    return () => unsubscribe();
  }, [checkConnection]);

  const signInWithGoogle = useCallback(async () => {
    return await fbSignInWithGoogle();
  }, []);

  const signOut = useCallback(async () => {
    await signOutFirebase();
    setCurrentFirebaseUser(null);
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        isConfigured: true,
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        status,
        statusMessage,
        currentFirebaseUser,
        checkConnection,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
