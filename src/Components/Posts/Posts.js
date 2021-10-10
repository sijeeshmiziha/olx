import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Heart from "../../assets/Heart";
import "./Post.css";
import { Firebase } from "../../firebase/config";
import BarLoading from "../Loading/BarLoading";
import PostCards from "../PostCards/PostCards";

import { AllPostContext } from "../../contextStore/AllPostContext";

function Posts() {
  const {setAllPost } = useContext(AllPostContext);
  let [posts, setPosts] = useState([]); //for showing all posts
  let [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);

    Firebase.firestore() //retreving all posts from firebase
      .collection("products")
      .get()
      .then((snapshot) => {
        let allPosts = snapshot.docs.map((product) => {
          return {
            ...product.data(),
            id: product.id,
          };
        });
        setPosts(allPosts); //set to post
        setAllPost(allPosts);
        setLoading(false);
        
      });
  }, [setAllPost]);
  // quickMenuCards assign all cards of post item later it will be displayed
  let quickMenuCards = posts.map((product, index) => {
    return <PostCards product={product} index={index} />;
  });

  return (
    <div className="postParentDiv">
      {posts && (
        <div className="moreView">
          <div className="heading">
            <span>Quick Menu</span>
            <Link to="./viewmore">
              {" "}
              <span>View more</span>{" "}
            </Link>
          </div>
          <div className="cards">
            {" "}
            {loading ? <BarLoading /> : quickMenuCards}
          </div>
        </div>
      )}
      <div className="recommendations">
        <div className="heading">
          <span>Fresh recommendations</span>
        </div>
        <div className="cards">
          <div className="card">
            <div className="favorite">
              <Heart></Heart>
            </div>
            <div className="image">
              <img src="../../../Images/R15V3.jpg" alt="" />
            </div>
            <div className="content">
              <p className="rate">&#x20B9; 250000</p>
              <span className="kilometer">Two Wheeler</span>
              <p className="name"> YAMAHA R15V3</p>
            </div>
            <div className="date">
              <span>10/5/2021</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Posts;
