export default function InfoTooltip({ name, successful, isOpen, onClose }) {

    return (
      
      <div className={`popup popup_${name} ${isOpen ? 'popup_opened' : ''}`}>
        <div className="popup__container_successful">
          <div className={`popup__successful ${successful ? 'popup__successful_type_complete' : 'popup__successful_type_fail'}`}>
          </div>
          <h2 className="popup__title">
            {successful ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так!Попробуйте еще раз'}
          </h2>
          <button type="button" className="popup__button-close" onClick={onClose}/>
        </div>
      </div>
    );
  }