import React from "react";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

export default function DeleteCardPopup({ isOpen, onClose, onSubmit, cardid}) {

    function handleSubmit(evt) {
        evt.preventDefault()
        onSubmit(cardid)
    }

    return (
        <PopupWithForm
          name='delete'
          title='Вы уверены?'
          titleButton='Да'
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
    )
}