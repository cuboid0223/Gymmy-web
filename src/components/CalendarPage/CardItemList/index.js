import React from "react";
import CardItem from "../CardItem";

const CardItemList = ({ items, category, type, showLikeIcon, clickable }) => {
  return (
    <div className="cardItemList">
      <>
        {!items
          ? null
          : items?.map((item) => (
              <CardItem
                type={type}
                item={item}
                id={item.id}
                key={item.id}
                category={category}
                clickable={clickable}
                showLikeIcon={showLikeIcon}
              />
            ))}
      </>
    </div>
  );
};

export default CardItemList;
