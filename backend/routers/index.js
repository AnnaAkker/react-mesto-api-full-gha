const router = require('express').Router();

const users = require('./users');
const cards = require('./cards');

const auth = require('../middlewares/auth');
const signup = require('./signup');
const signin = require('./signin');

const NotFoundError = require('../errors/NotFoundError');

router.get('/crash-test', (req, res, next) => {
  setTimeout(() => {
    next(new Error('Сервер сейчас упадет'));
  }, 0);
});

router.use('/signup', signup);
router.use('/signin', signin);

router.use(auth);

router.use('/users', auth, users);
router.use('/cards', auth, cards);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такая страница не найдена'));
});

module.exports = router;
