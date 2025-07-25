import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendEmailVerification,
  reload
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

// Convert Firebase user to our User type
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  if (!firebaseUser) return null;

  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || userData?.displayName || '',
      role: userData?.role || 'student',
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: userData?.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: firebaseUser.emailVerified,
    };
  } catch (error) {
    console.error('Error converting Firebase user:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
    }

    const user = await convertFirebaseUser(userCredential.user);
    
    if (!user) {
      throw new Error('Failed to get user data');
    }

    // Update last login
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: 'admin' | 'student' = 'student'
): Promise<{ user: User; needsVerification: boolean }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(userCredential.user, {
      displayName: displayName
    });

    const userData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: false,
    };

    // Save user data to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    // Send email verification
    await sendEmailVerification(userCredential.user, {
      url: `${window.location.origin}/login`, // Redirect URL after verification
      handleCodeInApp: false,
    });

    // Sign out the user until they verify their email
    await firebaseSignOut(auth);

    return { 
      user: userData, 
      needsVerification: true 
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

export const resendVerificationEmail = async (): Promise<void> => {
  try {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });
    } else {
      throw new Error('No user found or email already verified');
    }
  } catch (error: any) {
    console.error('Resend verification error:', error);
    throw new Error(error.message || 'Failed to resend verification email');
  }
};

export const checkEmailVerification = async (): Promise<boolean> => {
  try {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      return auth.currentUser.emailVerified;
    }
    return false;
  } catch (error: any) {
    console.error('Check verification error:', error);
    return false;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        const user = await convertFirebaseUser(firebaseUser);
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

// Real-time auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await convertFirebaseUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
};