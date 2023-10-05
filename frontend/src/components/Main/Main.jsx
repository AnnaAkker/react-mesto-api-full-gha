import { useContext } from "react"
import Card from "../Card/Card.jsx"
import CurrentUserContext from "../../contexts/CurrentUserContext.js"

export default function Main({ onEditProfile, onEditeAvatar, onAddPlace, onCardElement, onDeleteCard, cards, onCardlike }) {

    const currentUser = useContext(CurrentUserContext)

    return (
        <main>
            <section className="profile">
                <div className="profile__description">
                    <button className="button-image-overlay profile__image-overlay" type="button" onClick={onEditeAvatar}>
                        <img
                            className="profile__image"
                            src={currentUser.avatar ? currentUser.avatar : '#'}
                            alt="Фотография в профиле"
                        />
                    </button>
                    <div className="profile__block">
                        <h1 className="profile__name">{currentUser.name ? currentUser.name : ''}</h1>
                        <button type="button" className="profile__button-edit" onClick={onEditProfile} />
                        <p className="profile__subtitle">{currentUser.about ? currentUser.about : ''}</p>
                    </div>
                </div>
                <button type="button" className="profile__button-add" onClick={onAddPlace} />
            </section>
            <section className="elements">
                {cards.map(data => {
                    return (
                        <Card
                            key={data._id}
                            card={data}
                            onCardElement={onCardElement}
                            onDeleteCard={onDeleteCard}
                            onCardlike={onCardlike}
                        />
                    )
                })}
            </section>
        </main>
    )
};