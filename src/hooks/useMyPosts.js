import { useState, useEffect } from 'react';
import { subscribeToUserPosts } from '../services/postService';
import { useAuth } from './useAuth';

export const useMyPosts = () => {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) {
      setMyPosts([]);
      setPostsLoading(false);
      return;
    }

    setPostsLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserPosts(user.uid, (posts) => {
      setMyPosts(posts);
      setPostsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]); // Re-subscribe when user logs in or out

  return { myPosts, postsLoading, error };
};
