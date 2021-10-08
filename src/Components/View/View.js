import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../../contextStore/PostContext";
import { Firebase } from "../../firebase/config";
import { useHistory } from "react-router";
import "./View.css";
function View() {
  let { postContent } = useContext(PostContext);

  const [userDetails, setUserDetails] = useState();
  const history = useHistory();
  useEffect(() => {
    let { userId } = postContent;
    if (userId === undefined) {
      history.push("/");
    } else {
      Firebase.firestore()
        .collection("users")
        .where("id", "==", userId)
        .get()
        .then((res) => {
          res.forEach((doc) => {
            setUserDetails(doc.data());
          });
        });
    }
  }, [history, postContent]);
  return (
    <div className="viewParentDiv">
      <div className="imageShowDiv">
        <img src={postContent.url} alt="" />
      </div>{" "}
      <div className="rightSection">
        <div className="productDetails">
          <p>&#x20B9; {postContent.price} </p>
          <span>{postContent.name}</span>
          <p>{postContent.category}</p>
          <span>{postContent.createdAt}</span>
        </div>
        {userDetails && (
          <div className="contactDetails">
            <p>Seller details</p>
            <p>{userDetails.username}</p>
            <p>{userDetails.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default View;
