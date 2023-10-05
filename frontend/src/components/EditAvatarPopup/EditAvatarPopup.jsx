import { useRef } from "react"
import useFormValidation from "../../utils/useFormValidation.js"
import PopupWithForm from "../PopupWithForm/PopupWithForm.jsx"

export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
    const input = useRef()
    const { listValue, errorMessages, isValidInput, isValid, handleChange, reset } = useFormValidation()

    function resetAfterClose() {
      onClose()
      reset()
    }

    function handleSubmit(evt) {
      evt.preventDefault()
      onUpdateAvatar({image: input.current.value}, reset)
    }

    return (
      <PopupWithForm
        name='edit-avatar'
        title='Обновить аватар'
        isOpen={isOpen}
        isValid={isValid}
        onClose = {resetAfterClose}
        onSubmit={handleSubmit}
      >
        <input ref={input} id="image-input" type="url" className={`popup__input popup__input_type_url ${isValidInput.image === undefined || isValidInput.image ? '' : 'popup__input_invalid'}`} name="image" placeholder="Ссылка на картинку" required
          value={listValue.image ? listValue.image : ''}
          onChange={handleChange}
        />
        <span id="image-input-error" className="popup__input-error">{errorMessages.image}</span>
      </PopupWithForm>
    )
}