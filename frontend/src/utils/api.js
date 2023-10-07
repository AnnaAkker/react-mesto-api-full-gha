class Api {
    constructor(options) {
        this._url = options.baseUrl;
        this._headers = options.headers;
    }

    _checkResponse(res) {
        return res.ok ? res.json() : Promise.reject(`${res.status} ${res.statusText}`)
    }

    getInfo(token) {
        return fetch(`${this._url}/users/me`, {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(this._checkResponse)
    }

    getCards(token) {
        return fetch(`${this._url}/cards`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(this._checkResponse);
    }

    getUserInfo(data, token) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: data.username,
                about: data.subtitle,
            })
        })
        .then(this._checkResponse);
    }

    setAvatar(data, token) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                avatar: data.image,
            })
        })
        .then(this._checkResponse);
    }

    addCards(data, token) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: data.title,
                link: data.link,
            })
        })
        .then(this._checkResponse);
    }

    addLike(cardId, token) {
        return fetch(`${this._url}/cards/${cardId}/likes`, {
            method: `PUT`,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(this._checkResponse);
    }

    deleteLike(cardId, token) {
        return fetch(`${this._url}/cards/${cardId}/likes`, {
            method: `DELETE`,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(this._checkResponse);
    }

    deleteCard(cardId, token) {
        return fetch(`${this._url}/cards/${cardId}`, {
            method: `DELETE`,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(this._checkResponse);
    }
}

const api = new Api({
    baseUrl: 'https://domainname.api.akkermesto.nomoredomainsrocks.ru',
    headers: {
        'Content-Type': 'application/json'
    }
}); 

export default api;