import React from "react";
import useFormValidation from "../../utils/useFormValidation";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

export default function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

  const { listValue, errorMessages, isValidInput, isValid, handleChange, reset } = useFormValidation()

  function resetAfterClose() {
    onClose()
    reset()
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    onAddPlace({ title: listValue.title, link: listValue.link }, reset)
  }

  return (
    <PopupWithForm
      name='add-card'
      title='Новое место'
      titleButton='Создать'
      isOpen={isOpen}
      isValid={isValid}
      onClose={resetAfterClose}
      onSubmit={handleSubmit}
    >
      <input id="title-input" type="text" className={`popup__input popup__input_type_title ${isValidInput.title === undefined || isValidInput.title ? '' : 'popup__input_invalid'}`} name="title" placeholder="Название" minLength={2} maxLength={30} required
        value={listValue.title ? listValue.title : ''}
        onChange={handleChange}
      />
      <span id="title-input-error" className="popup__input-error">{errorMessages.title}</span>
      <input id="link-input" type="url" className={`popup__input popup__input_type_link ${isValidInput.link === undefined || isValidInput.link ? '' : 'popup__input_invalid'}`} name="link" placeholder="Ссылка на картинку" required
        value={listValue.link ? listValue.link : ''}
        onChange={handleChange}
      />
      <span id="link-input-error" className="popup__input-error">{errorMessages.link}</span>
    </PopupWithForm>
  )
}