import { db, storage } from "./firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  serverTimestamp,
  getCountFromServer,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { supabase } from './supabase.js';

const POSTS_PER_PAGE = 12;

// Get total post count
export const getPostsCount = async () => {
  try {
    const q = query(collection(db, "posts"));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error fetching post count:', error);
    return 0;
  }
};

// Get a single page of posts by jumping to the correct cursor
export const getPosts = async (orderByField, page = 1) => {
  try {
    let q = query(
      collection(db, "posts"),
      orderBy(orderByField, "desc"),
      limit(POSTS_PER_PAGE)
    );

    // To jump to a page, we have to get the cursor from the previous page.
    if (page > 1) {
      // This is inefficient as it reads documents to find the cursor.
      const prevPageEndQuery = query(
        collection(db, "posts"),
        orderBy(orderByField, "desc"),
        limit((page - 1) * POSTS_PER_PAGE)
      );
      const prevPageSnapshots = await getDocs(prevPageEndQuery);
      const lastDoc = prevPageSnapshots.docs[prevPageSnapshots.docs.length - 1];
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
    }

    const documentSnapshots = await getDocs(q);
    const postsData = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));

    const authorIds = [...new Set(postsData.map(p => p.authorId).filter(id => id))];
    const authorProfiles = await Promise.all(
      authorIds.map(id => getProfile(id).catch(() => null))
    );
    const profilesMap = authorProfiles.reduce((acc, profile) => {
      if (profile) acc[profile.id] = profile;
      return acc;
    }, {});

    const postsWithAuthors = postsData.map(post => ({
      ...post,
      profiles: profilesMap[post.authorId] || null,
    }));

    return { data: postsWithAuthors };

  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: [] };
  }
};

// ... (the rest of the file remains the same)

export const getPostById = async (id) => {
  try {
    const postDocRef = doc(db, "posts", id);
    const postSnap = await getDoc(postDocRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const authorProfile = await getProfile(postData.authorId).catch(() => null);
      return {
        id: postSnap.id,
        ...postData,
        createdAt: postData.createdAt?.toDate(),
        updatedAt: postData.updatedAt?.toDate(),
        profiles: authorProfile ? { username: authorProfile.username || authorProfile.email } : null,
      };
    } else {
      throw new Error('게시물을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error(`Error fetching post by ID (${id}):`, error);
    throw new Error('게시물을 불러오는 데 실패했습니다.');
  }
};

export const deletePost = async (id) => {
  try {
    await deleteDoc(doc(db, "posts", id));
    return true;
  } catch (error) {
    console.error(`Error deleting post (${id}):`, error);
    return false;
  }
};

const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateRandomString = (length = 6) => {
  const array = new Uint32Array(length / 2);
  crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(36)).join('').substring(0, length);
};

export const createPost = async (post) => {
  try {
    const baseSlug = generateSlug(post.title);
    const uniqueSlug = `${baseSlug}-${generateRandomString()}`;

    const newPost = {
      ...post,
      slug: uniqueSlug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "posts"), newPost);
    return { id: docRef.id, ...newPost };
  } catch (error) {
    console.error(`Error creating post:`, error);
    return null;
  }
};

export const updatePost = async (id, post) => {
  try {
    const baseSlug = generateSlug(post.title);
    const uniqueSlug = `${baseSlug}-${generateRandomString()}`;

    const updatedPost = {
      ...post,
      slug: uniqueSlug,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(doc(db, "posts", id), updatedPost);
    return { id, ...updatedPost };
  } catch (error) {
    console.error(`Error updating post (${id}):`, error);
    return null;
  }
};

export const incrementPostView = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const currentViews = postSnap.data().views || 0;
      await updateDoc(postRef, { views: currentViews + 1 });
    }
  } catch (error) {
    console.error('Error incrementing post view:', error);
  }
};

export const uploadImage = async (file, token) => {
  try {
    supabase.auth.setAuth(token);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    throw error;
  } finally {
    supabase.auth.setAuth(null);
  }
};

export const getPostsByUserId = async (userId) => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, "posts"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  } catch (error) {
    console.error(`Error fetching posts by user ID (${userId}):`, error);
    return [];
  }
};

export const subscribeToUserPosts = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, "posts"),
    where("authorId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
    callback(posts);
  }, (error) => {
    console.error(`Error subscribing to user posts (${userId}):`, error);
  });

  return unsubscribe;
};

export const getPostBySlug = async (slug) => {
  try {
    const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const postData = docSnap.data();
      const authorProfile = await getProfile(postData.authorId).catch(() => null);
      return {
        id: docSnap.id,
        ...postData,
        createdAt: postData.createdAt?.toDate(),
        updatedAt: postData.updatedAt?.toDate(),
        profiles: authorProfile ? { username: authorProfile.username || authorProfile.email } : null,
      };
    } else {
      throw new Error('게시물을 찾을 수 없습니다.');
    }
  } catch (error) {
    throw new Error('게시물을 불러오는 데 실패했습니다.');
  }
};

import { getProfile } from './authService';