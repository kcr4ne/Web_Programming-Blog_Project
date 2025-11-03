import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword as firebaseUpdatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const signUp = async (username, password) => {
  try {
    // 1. Check if username already exists in Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("이미 존재하는 사용자 이름입니다.");
    }

    // 2. Generate a dummy email for Firebase Auth
    const dummyEmail = `${username}@blogkyle.com`; // Use a domain you control or a dummy one

    // 3. Create user in Firebase Auth with dummy email
    const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, password);
    const user = userCredential.user;

    // 4. Create a user profile in Firestore with actual username and dummy email
    await setDoc(doc(db, "users", user.uid), {
      email: dummyEmail,
      username: username,
      role: 'user', // Default role
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    // 1. Find the user's dummy email using their username from Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const userData = querySnapshot.docs[0].data();
    const dummyEmail = userData.email; // This is the dummy email stored during signup

    // 2. Log in with the dummy email and provided password
    const userCredential = await signInWithEmailAndPassword(auth, dummyEmail, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const updatePassword = async (newPassword) => {
  try {
    await firebaseUpdatePassword(auth.currentUser, newPassword);
    return { message: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const getUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getProfile = async (userId) => {
  if (!userId) return null;
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such user profile!");
      return null;
    }
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    return null;
  }
};
