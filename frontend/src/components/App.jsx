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
  const [dataUser, setDataUser] = useState('')
  
  const [cards, setCards] = useState([])
  const [isDeleteCards, setDeleteCards] = useState('')


  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isInfoTooltip, setInfoTooltip] = useState(false)
  const [isCheckToken, setCheckToken] = useState(true)
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
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserEmail(res.email);
            navigate('/');
          }
        })
        .catch((err) => {
          console.log(`Ошибка при проверке токена ${err}`);
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (localStorage.jwt) {
      auth.checkToken(localStorage.jwt)
        .then(res => {
          setDataUser(res.email)
          setLoggedIn(true)
          setCheckToken(false)
          navigate('/')
        })
        .catch((err) => {
          console.log(`Ошибка авторизации повторного входа ${err}`)
        });
    } else {
      setCheckToken(false)
      setLoggedIn(false)
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getInfo(localStorage.jwt), api.getCards(localStorage.jwt)])
        .then(([dataUser, dataCard]) => {
          setCurrentUser(dataUser)
          setCards(dataCard.reverse());
        })
        .catch((err) => console.error(`Ошибка загрузки начальных данных и карточек ${err}`));
      }
  }, [loggedIn])
  
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

  function handleRegistration(password, email) {
    auth.registration(password, email)
     .then(res => {
        setInfoTooltip(true)
        navigate('/sign-in')
     })
     .catch((err) => {
      setInfoTooltip(false)
      console.log(`Ошибка регистрации ${err}`)
     })
     .finally(() => setResultPopup(true))
  }

  function handleLogin(password, email) {
    auth.login(password, email)
     .then(res => {
        localStorage.setItem('jwt', res.token)
        navigate('/')
        setUserEmail(res.email)
        setLoggedIn(true)
     })
     .catch((err) => {
      setInfoTooltip(false)
      setResultPopup(true)
      console.log(`Ошибка авторизации ${err}`)
     })
  }

  function onloginOut() {
    setLoggedIn(false)
    localStorage.removeItem('jwt')
    setUserEmail('')
  }

  function handleUpDateUser(dataUser, reset) {
    api.getUserInfo(dataUser, localStorage.jwt)
      .then(res => {
        setCurrentUser(res);
        closePopups();
        reset();
      })
      .catch((err) => console.error(`Ошибка редактирования профиля ${err}`));
  }

  function handleUpDateAvatar(dataUser, reset) {
    api.setAvatar(dataUser, localStorage.jwt)
      .then(res => {
        setCurrentUser(res);
        closePopups();
        reset();
      })
      .catch((err) => console.error(`Ошибка обновления аватара ${err}`));
  }

  function handleAddCards(dataCard, reset) {
    api.addCards(dataCard, localStorage.jwt)
      .then((res) => {
        setCards([res, ...cards]);
        closePopups();
        reset();
      })
      .catch((err) => console.error(`Ошибка добавления карточки ${err}`));
  }

  const handleLikes = useCallback((card) => {
    const isLikes = card.likes.some(item => currentUser._id === item._id)
    if (isLikes) {
    api.deleteLike(card._id, localStorage.jwt)
      .then(res => {
        setCards(cards => cards.map((element) => element._id === card._id ? res : element))
      })
      .catch((err) => console.error(`Ошибка удаления лайка ${err}`)) 
    } else {
      api.addLike(card._id, localStorage.jwt)
        .then(res => {
          setCards(cards => cards.map((element) => element._id === card._id ? res : element))
        })
        .catch((err) => console.error(`Ошибка установки лайка ${err}`))
    }
  }, [currentUser._id])

  function handleCardDelete() {
    api.deleteCard(isDeleteCards, localStorage.jwt)
      .then(() => {
        setCards(cards.filter((element) => element._id !== isDeleteCards));
        closePopups();
      })
      .catch((err) => console.error(`Ошибка удаления карточки ${err}`));
  }

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
            element={<Register isCheckToken={isCheckToken} onRegistration={handleRegistration}/>}
          />
          <Route 
            path='/sign-in'
            element={<Login isCheckToken={isCheckToken} onLogin={handleLogin}/>}
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
                isCheckToken={isCheckToken}
                loggedIn={loggedIn}
                dataUser={dataUser}
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
