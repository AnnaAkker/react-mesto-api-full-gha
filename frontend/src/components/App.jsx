import Header from './Header/Header.jsx';
import Main from './Main/Main.jsx';
import Footer from './Footer/Footer.jsx';
import ImagePopup from './ImagePopup/ImagePopup.jsx';
import { useCallback, useState, useEffect } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext.js'
import api from '../utils/api.js';
import auth from '../utils/auth.js';
import EditProfilePopup from './EditProfilePopup/EditProfilePopup.jsx';
import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup.jsx';
import AddPlacePopup from './AddPlacePopup/AddPlacePopup.jsx';
import DeleteCardPopup from './DeleteCardPopup/DeleteCardPopup.jsx'
import Login from './Login/Login.jsx'
import Register from './Register/Register.jsx'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip/InfoTooltip.jsx'

function App() {

  const navigate = useNavigate()

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)

  const [isCardSelect, setCardSelect] = useState({})
  const [isImagePopup, setIsImagePopup] = useState(false)

  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false)

  const [currentUser, setCurrentUser] = useState({})

  const [cards, setCards] = useState([])

  const [isDeleteCards, setDeleteCards] = useState('')

  const [loggedIn, setLodggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isInfoTooltip, setInfoTooltip] = useState(false)

  const [resultPopup, setResultPopup] = useState(false)

  const setStateClosePopup = useCallback(() => {
    setIsEditProfilePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setDeletePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsImagePopup(false)
    setResultPopup(false)
  }, [])

  const closePopupByEsc = useCallback((evt) => {
    if (evt.key === "Escape") {
      closePopups();
    }
  }, []);

  const closePopups = useCallback(() => {
    setStateClosePopup()
    document.removeEventListener('keydown', closePopupByEsc)
  }, [setStateClosePopup, closePopupByEsc])

  function setEvantListenerForKeydown() {
    document.addEventListener('keydown', closePopupByEsc)
  }

  useEffect(() => {
    checkToken();
  }, [])

  
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
    setEvantListenerForKeydown()
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
    setEvantListenerForKeydown()
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
    setEvantListenerForKeydown()
  }

  function handleCardsClick(card) {
    setCardSelect(card)
    setIsImagePopup(true)
    setEvantListenerForKeydown()
  }

  function handleDeletePopup(cardId) {
    setDeleteCards(cardId)
    setDeletePopupOpen(true)
    setEvantListenerForKeydown()
  }

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getInfo(), api.getCards()])
        .then(([dataUser, dataCard]) => {
          setCurrentUser(dataUser)
          setCards(dataCard);
        })
        .catch((err) => console.error(`Ошибка загрузки начальных карточек ${err}`));
      }
  }, [loggedIn])

  function checkToken() {
    const token = localStorage.getItem('jwt')
    if (token) {
      auth.checkToken(token) 
          .then((res) => {
            if (res && res.data) {
              setLodggedIn(true)
              setUserEmail(res.data.email)
              navigate('/')
            }
          })
          .catch((err) => {console.log(`Ошибка токена ${err}`)})
    }
  }

  function handleRegistration(data) {
    auth.registration(data)
     .then((res) => {
      if (res && res.data) {
        setInfoTooltip(true)
        navigate('/sign-in')
      }
     })
     .catch((err) => {
      setInfoTooltip(false)
      console.log(`Ошибка регистрации ${err}`)
     })
     .finally(() => setResultPopup(true))
  }

  function handleLogin(data) {
    auth.login(data)
     .then((res) => {
      if (res && res.token) {
        localStorage.setItem('jwt', res.token)
        setLodggedIn(true)
        setUserEmail(data.email)
        navigate('/')
      }
     })
     .catch((err) => {
      setInfoTooltip(false)
      setResultPopup(true)
      console.log(`Ошибка авторизации ${err}`)
     })
  }

  function onloginOut() {
    setLodggedIn(false)
    localStorage.removeItem('jwt')
    setUserEmail('')
  }

  function handleCardDelete() {
    api.deleteCard(isDeleteCards)
      .then(() => {
        setCards(cards.filter((element) => {
          return element._id !== isDeleteCards;
        }));
        closePopups();
      })
      .catch((err) => console.error(`Ошибка удаления карточки ${err}`));
  }

  function handleUpDateUser(dataUser, reset) {
    api.setUserInfo(dataUser)
      .then(res => {
        setCurrentUser(res);
        closePopups();
        reset();
      })
      .catch((err) => console.error(`Ошибка редактирования профиля ${err}`));
  }

  function handleUpDateAvatar(dataUser, reset) {
    api.setAvatar(dataUser)
      .then(res => {
        setCurrentUser(res);
        closePopups();
        reset();
      })
      .catch((err) => console.error(`Ошибка обновления аватара ${err}`));
  }

  function handleAddCards(dataCard, reset) {
    api.addCards(dataCard)
      .then((res) => {
        setCards([res, ...cards])
        closePopups();
        reset();
      })
      .catch((err) => console.error(`Ошибка добавления карточки ${err}`));
  }

  const handleLikes = useCallback((card) => {
    const isLikes = card.likes.some(item => currentUser._id === item._id)
    if (isLikes) {
    api.deleteLike(card._id)
      .then(res => {
        setCards(cards => cards.map((element) => element._id === card._id ? res : element))
      })
      .catch((err) => console.error(`Ошибка удаления лайка ${err}`)) 
    } else {
      api.addLike(card._id)
        .then(res => {
          setCards(cards => cards.map((element) => element._id === card._id ? res : element))
        })
        .catch((err) => console.error(`Ошибка установки лайка ${err}`))
    }
  }, [currentUser._id])


  return (

    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">

        <Header
          loggedIn={loggedIn}
          onloginOut={onloginOut}
          email={userEmail}
        />

        <Routes>
          <Route 
            path='/sign-up'
            element={<Register onRegistration={handleRegistration}/>}
          />
          <Route 
            path='/sign-in'
            element={<Login onLogin={handleLogin}/>}
          />
          <Route 
            path='*'
            element={<Navigate to={loggedIn ? '/' : '/sign-in'}/>}
          />
          <Route 
            path='/'
            element={
              <ProtectedRoute
                element={Main}
                onEditProfile={handleEditProfileClick}
                onEditeAvatar={handleEditAvatarClick}
                onAddPlace={handleAddPlaceClick}
                onCardElement={handleCardsClick}
                onCardlike={handleLikes}
                onDeleteCard={handleDeletePopup}
                cards={cards}
                loggedIn={loggedIn}
            />}
          />
        </Routes>
        
        {loggedIn && <Footer/>}

        <EditProfilePopup
          onUpDateUser={handleUpDateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={closePopups}
        />

        <EditAvatarPopup
          onUpdateAvatar={handleUpDateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closePopups}
        />

        <AddPlacePopup
          onAddPlace={handleAddCards}
          isOpen={isAddPlacePopupOpen}
          onClose={closePopups}
        />

        <DeleteCardPopup
          isOpen={isDeletePopupOpen}
          onClose={closePopups}
          onSubmit={handleCardDelete}
        />

        <ImagePopup
          card={isCardSelect}
          isOpen={isImagePopup}
          onClose={closePopups}
        />

        <InfoTooltip
          name='result'
          isOpen={resultPopup}
          onClose={closePopups}
          successful={isInfoTooltip}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
