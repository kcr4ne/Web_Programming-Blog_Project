import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserPosts } from '../hooks/useUserPosts';

const PostsContext = createContext();

export const useMyPosts = () => {
  return useContext(PostsContext);
};

export const PostsProvider = ({ children }) => {
  const { user } = useAuth();
  const { posts: myPosts, loading: postsLoading, refetch: refetchMyPosts, addPost } = useUserPosts(user?.id, !!user);

  const value = {
    myPosts,
    postsLoading,
    refetchMyPosts,
    addPost,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};
