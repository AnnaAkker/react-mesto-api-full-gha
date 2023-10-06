import React from "react";
import { useContext, useEffect } from "react";
import useFormValidation from "../../utils/useFormValidation.js";
import PopupWithForm from "../PopupWithForm/PopupWithForm.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js"

export default function EditProfilePopup({ isOpen, onClose, onUpDateUser }) {

  const currentUser = useContext(CurrentUserContext);
  const { listValue, errorMessages, isValidInput, isValid, handleChange, reset, setListValues } = useFormValidation()

  useEffect(() => {
    setListValues("username", currentUser.name)
    setListValues("subtitle", currentUser.about)
  }, [currentUser, isOpen, setListValues])

  function resetAfterClose() {
    onClose()
    reset()
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    onUpDateUser({ username: listValue.username, subtitle: listValue.subtitle }, reset)
  }

  return (
    <PopupWithForm
      name='edite-profile'
      title='Редактировать профиль'
      isOpen={isOpen}
      onClose={resetAfterClose}
      isValid={isValid}
      onSubmit={handleSubmit}
    >
      <input id="username-input" type="text" className={`popup__input popup__input_type_username ${isValidInput.username === undefined || isValidInput.username ? '' : 'popup__input_invalid'}`} name="username" placeholder="Введите имя" minLength={2} maxLength={40} required=""
        value={listValue.username ? listValue.username : ''}
        onChange={handleChange}
      />
      <span className="popup__input-error">{errorMessages.username}</span>
      <input id="subtitle-input" type="text" className={`popup__input popup__input_type_subtitle ${isValidInput.subtitle === undefined || isValidInput.subtitle ? '' : 'popup__input_invalid'}`} name="subtitle" placeholder="Расскажите о себе" minLength={2} maxLength={200} required=""
        value={listValue.subtitle ? listValue.subtitle : ''}
        onChange={handleChange}
      />
      <span className="popup__input-error">{errorMessages.subtitle}</span>
    </PopupWithForm>
  )
}