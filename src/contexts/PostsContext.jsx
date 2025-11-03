import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserPosts } from '../hooks/useUserPosts';
import { usePosts } from '../hooks/usePosts'; // Import the new hook

// Create the context
export const PostsContext = React.createContext(null);

export const PostsProvider = ({ children }) => {
  const { user } = useAuth();

  // Fetch all posts for the main list
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    hasMore,
    loadMorePosts,
    refetchPosts,
    setPosts // Expose setPosts to allow adding a new post
  } = usePosts();

  // Fetch posts for the current user (for the sidebar)
  const {
    myPosts,
    postsLoading: myPostsLoading,
    error: myPostsError,
    refetch: refetchMyPosts
  } = useUserPosts();

  // Function to add a new post to the global list
  const addPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    // Optionally, you could also update myPosts if the author is the current user
    if (user && newPost.authorId === user.uid) {
      refetchMyPosts(); // The simplest way is to just refetch
    }
  };

  const value = {
    // All posts data
    posts,
    postsLoading,
    postsError,
    hasMore,
    loadMorePosts,
    refetchPosts,
    addPost, // Provide the addPost function

    // Current user's posts data
    myPosts,
    myPostsLoading,
    myPostsError,
    refetchMyPosts,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};
