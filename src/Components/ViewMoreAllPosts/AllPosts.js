import React, { useContext } from "react";
import { useHistory } from "react-router";
import { AllPostContext } from "../../contextStore/AllPostContext";
import PostCards from "../PostCards/PostCards";
import "./allposts.css";
function AllPosts() {
  const { allPost } = useContext(AllPostContext);
  let displayAllPosts = allPost.map((product, index) => {
    return (
      <div className="all-post-card">
        {" "}
        <PostCards product={product} index={index} />{" "}
      </div>
    );
  });
  console.log(allPost);
  let length = allPost.length; //if user refresh the whole page context will be empty so we want to redirect the user to the home page
  const history = useHistory();
  return (
    <>
      {length !== 0 ? (
        <div className="display-all-parent">
          <div className="container-allpost">{displayAllPosts}</div>
        </div>
      ) : (
        history.push("/")
      )}
    </>
  );
}

export default AllPosts;
