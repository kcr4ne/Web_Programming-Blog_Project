import { db } from './firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
} from 'firebase/firestore';

/**
 * Fetches all user profiles from the 'users' collection in Firestore.
 * Role-based access control should be handled by Firebase Security Rules.
 */
export const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('사용자 목록을 불러오는 데 실패했습니다.');
  }
};

export const updateProfile = async (userId, updates) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, updates);
    return { id: userId, ...updates };
  } catch (error) {
    console.error(`Error updating user profile (${userId}):`, error);
    // Firebase Firestore errors for unique constraints are not as direct as Supabase.
    // You might need to implement custom logic or Cloud Functions for more complex validation.
    throw new Error('프로필 업데이트에 실패했습니다.');
  }
};