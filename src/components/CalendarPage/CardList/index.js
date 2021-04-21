import React from "react";
import CardItem from "../CardItem";

const CardList = ({ items, category, type, showLikeIcon }) => {
  return (
    <div className="cardList">
      <>
        {items.length === 0 ? (
          <p>no result</p>
        ) : (
          items?.map((item) => (
            <CardItem
              type={type}
              item={item}
              id={item.id}
              key={item.id}
              category={category}
              clickable
              showLikeIcon
            />
          ))
        )}
      </>
    </div>
  );
};

export default CardList;
