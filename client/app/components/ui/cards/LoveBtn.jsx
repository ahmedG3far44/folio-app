"use client";
import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

function LoveBtn({ likes }) {
  const [isLiked, setLike] = useState(false);
  const [likesNumber, setLikesNumber] = useState(likes);
  const handleLike = () => {
    setLike(!isLiked);
    isLiked ? setLikesNumber(likes + 1) : setLikesNumber(likes - 1);
  };
  return (
    <button
      onClick={handleLike}
      className="flex justify-start items-center gap-2"
    >
      {isLiked ? (
        <span>
          <GoHeartFill size={20} />
        </span>
      ) : (
        <span>
          <GoHeart size={20} />
        </span>
      )}
      <span>{likesNumber}</span>
    </button>
  );
}

export default LoveBtn;

  