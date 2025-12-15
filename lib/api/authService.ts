import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { api } from "./apiClient";

// Get Firebase ID token
export const getIdToken = async (
  forceRefresh = false
): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
};

// Sign up with email/password
export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const signUpCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(signUpCredential.user, { displayName });
  return signUpCredential.user;
};

// Sign in with email/password
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  const signInCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return signInCredential.user;
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const googleCredential = await signInWithPopup(auth, provider);
  return googleCredential.user;
};

// Sign out
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

// Password reset
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Subscribe to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Exchange Firebase token for backend JWT
export const exchangeToken = async () => {
  return api.post<{
    jwt: string;
    firebaseIdToken: string;
    role: string;
    schoolId: string | null;
    status: string;
  }>("/auth/token");
};
