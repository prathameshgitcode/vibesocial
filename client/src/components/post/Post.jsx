import "./post.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { useContext, useEffect, useState } from "react";
import axios from "axios";

// import en from "javascript-time-ago/locale/en";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleDeletePost = async () => {
    try {
      if (currentUser._id) {
        console.log(currentUser._id);
        const response = await axios.delete(
          `/posts/${post._id}/${currentUser._id}`
        );
        // console.log(response.data);
        window.location.reload();
        toast.success(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditPost = async () => {
    try {
      if (user._id) {
        const response = await axios.put(`/posts/${post._id}`, {
          userId: user._id,
          desc: "hey! this is an updated post. Thank you", // TODO: need to update with a function parameter or a state hook
        });
        // console.log(response.data);
        window.location.reload();
        toast.success(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{post.createdAt}</span>
          </div>

          <div className="postTopRight">
            <DownloadRoundedIcon />
            <span className="deleteButtonContainer" onClick={handleDeletePost}>
              <DeleteOutlineOutlinedIcon />
            </span>
            <span className="editButtonContainer" onClick={handleEditPost}>
              <EditRoundedIcon />
            </span>
          </div>
        </div>

        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
