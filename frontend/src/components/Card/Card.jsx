import { useContext } from "react"
import CurrentUserContext from "../../contexts/CurrentUserContext"
import ButtonLikes from "../ButtonLikes/ButtonLikes.jsx"

export default function Card({ card, onCardElement, onDeleteCard, onCardlike }) {
    const currentUser = useContext(CurrentUserContext)
    
    const isOwn = currentUser._id === card.owner?._id;

    return (
        <div className="elements__card">
            {isOwn && <button type="button" className="elements__trash-button" onClick={() => onDeleteCard(card._id)} />}
            <img className="elements__image"
                src={card.link}
                alt={`Фотография ${card.name}`}
                onClick={() => onCardElement({ link: card.link, name: card.name })} />

            <div className="elements__description">
                <h2 className="elements__description-title">{card.name}</h2>
                <div className="elements__container">
                <ButtonLikes
                    card={card}
                    myid={currentUser._id}
                    onCardlike={onCardlike}
                />
                </div>
            </div>
        </div>
    )
}

