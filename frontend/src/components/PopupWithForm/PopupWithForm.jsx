import React from "react";
export default function PopupWithForm({ name, title, titleButton, children, isOpen, onClose, onSubmit, isValid = true }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`} onClick={onClose}>
      <div className="popup__container" onClick={(evt => evt.stopPropagation())}>
        <button type="button" className="popup__button-close" onClick={onClose} />
        <form className="popup__form" name={name} noValidate onSubmit={onSubmit}>
          <h2 className="popup__name">{title}</h2>
          {children}
          <button type="submit" className={`popup__submit-button ${isValid ? '' : 'popup__submit-button_disabled'}`}>
            {titleButton || 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  )
}