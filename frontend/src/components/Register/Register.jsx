import { Link } from "react-router-dom";
import useFormValidation from "../../utils/useFormValidation";

export default function Register({ onRegistration }) {

    const { listValue, errorMessages, isValidInput, isValid, handleChange, reset} = useFormValidation()
  
    function handleSubmit(evt) {
      evt.preventDefault();
      onRegistration(listValue);
      reset();
    };
  
    return (
      <div className="authorize">
        <h3 className="authorize__title">Регистрация</h3>
        <form name="register" className="authorize__form" onSubmit={handleSubmit} noValidate>
          <div className="authorize__container">
            <input id="email" type="email" className={`authorize__input ${isValidInput.email === undefined || isValidInput.email ? '' : 'authorize__input_invalid'}`} name="email" value={listValue.email ? listValue.email : ''} placeholder="Email" onChange={handleChange} required
            />
            <span className="authorize__input-error">
                {errorMessages.email}
            </span>
            <input id="password" type="password" className={`authorize__input ${isValidInput.password === undefined || isValidInput.password ? '' : 'authorize__input_invalid'}`} name="password" value={listValue.password ? listValue.password : ''} placeholder="Пароль" minLength={3} maxLength={24} onChange={handleChange} required
              />
            <span className="authorize__input-error">
                {errorMessages.password}
            </span>
          </div>
          <button type="submit" className={`authorize__submit-button ${isValid ? '' : 'authorize__submit-button_disabled'}`} disabled={!isValid}>Зарегистрироваться</button>
        </form>
        <Link to="/sign-in" className="authorize__link">Уже зарегистрированы? Войти</Link>
      </div>
    )
  }