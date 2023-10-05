import { Link, Route, Routes, useLocation } from 'react-router-dom'
import logo from '../../images/logo.svg'
export default function Header({ loggedIn, email, onloginOut}) {

  const location = useLocation()
  const linkHeader = location.pathname === "/sign-in" ? "Регистрация" : "Войти"
  const buttonHeader = loggedIn ? "Выйти" : linkHeader

  return (

    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Место" />
      <div className= "header__links">
        <Routes>
            <Route
              path='/sign-up'
              element={<Link to='/sign-in' className="header__link header__button">Войти</Link>
              }
            />
            <Route
              path='/sign-in'
              element={<Link to='/sign-up' className="header__link header__button">Регистрация</Link>}
            />
            <Route
              path="/"
              element={
                <>
                  <p className="header__email">{email}</p>
                  <button className="header__link header__button" onClick={onloginOut}>{buttonHeader}</button>
                </>
              }
            />
          </Routes>
      </div>
    </header>
  )
}