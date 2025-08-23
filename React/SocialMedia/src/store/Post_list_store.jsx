import React, { useReducer } from "react";
import { createContext } from "react";


const PostList = createContext({
  postList: [],
  addPost: () => {},
  deletePost: () => {},
});

const postListReducer = (currpostList, action) => {
  return currpostList
}
function PostListProvider({ children }) {
  const addPost = () => {};

  const deletePost = () => {};

  const [postList, dispatchPostList] = useReducer(postListReducer,[]);
  return (
    <>
      <PostList.Provider
        value={{
          postList: postList,
          addPost: addPost,
          deletePost: deletePost,
        }}
      >
        {children}
      </PostList.Provider>
    </>
  );
}

export default PostListProvider;
