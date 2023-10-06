class Auth {
  constructor(options) {
    this._url = options.baseUrl;
    this._headers = options.headers;
  };
  
  _getResponse(res) {return res.ok ? res.json() : Promise.reject}
  
    registration(data) {
      return fetch(`${this._url}/signup`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(data),
      })
      .then(this._getResponse)
    };
  
    login(data) {
      return fetch(`${this._url}/signin`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(data),
      })
      .then(this._getResponse)
    };
  
    checkToken(token) {
      return fetch(`${this._url}/users/me`, {
        method: 'GET',
        headers: {
          ...this._headers,
          "Authorization" : `Bearer ${token}`,
        }
      })
      .then(this._getResponse)
    };
  };
  
  const auth = new Auth({
    baseUrl: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  export default auth;