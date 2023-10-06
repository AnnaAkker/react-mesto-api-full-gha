import React from "react";
export default function ButtonLikes({ myid, card, onCardlike }) {

  const isLikes = card.likes.some(item => myid === item._id)
  
  return (
    <>
      <button type="button" className={`elements__like-button ${isLikes ? 'elements__like-button_active' : ''}`} onClick={() => onCardlike(card)} />
      <span className="elements__counter">{card.likes.length}</span>
    </>
  )
}