import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getProfile } from './authService.js';

export const createComment = async (postId, authorId, content) => {
  try {
    const newComment = {
      postId,
      authorId,
      content,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "comments"), newComment);
    return { id: docRef.id, ...newComment };
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("댓글 생성에 실패했습니다.");
  }
};

export const getCommentsByPostId = async (postId) => {
  try {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    const commentsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }));

    // Fetch author profiles for all comments
    const authorIds = [...new Set(commentsData.map(c => c.authorId).filter(id => id))];
    const authorProfiles = await Promise.all(
      authorIds.map(id => getProfile(id).catch(() => null))
    );
    const profilesMap = authorProfiles.reduce((acc, profile) => {
      if (profile) acc[profile.id] = profile;
      return acc;
    }, {});

    const commentsWithAuthors = commentsData.map(comment => ({
      ...comment,
      authorProfile: profilesMap[comment.authorId] || null,
    }));

    return commentsWithAuthors;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("댓글을 불러오는 데 실패했습니다.");
  }
};

export const deleteComment = async (commentId) => {
  try {
    await deleteDoc(doc(db, "comments", commentId));
    return true;
  } catch (error) {
    console.error(`Error deleting comment (${commentId}):`, error);
    throw new Error("댓글 삭제에 실패했습니다.");
  }
};
