const Router = require('express').Router

const AuthController = require('../controllers/AuthController')
const ArtistController = require('../controllers/ArtistController')
const TrackController = require('../controllers/TrackController')

const registerValidation = require('../validations/auth')
const artistValidation = require('../validations/artist')

const checkAuthMiddleware = require('../middleware/checkAuthMiddleware')
const upload = require('../multer')
const checkAdminMiddleware = require('../middleware/checkAdminMiddleware')
const UserController = require('../controllers/UserController')

const router = new Router()

router.post('/auth/login', AuthController.login)
router.post('/auth/register', registerValidation, AuthController.register)
router.get('/auth/me', checkAuthMiddleware, AuthController.authMe)
router.patch('/auth/:id', AuthController.update)

router.post('/upload', upload.single('image'), (req, res) => {
    try {
        res.json({
            url: `/files/${req.file.originalname}`
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/user/:id', UserController.getUser)

router.post('/artist', checkAdminMiddleware, artistValidation.artistCreateValidation, ArtistController.create)
router.get('/artist', ArtistController.getAll)
router.get('/artist/:id', ArtistController.getOne)
router.patch('/artist/:id', checkAdminMiddleware, artistValidation.artistEditValidation, ArtistController.update)
router.delete('/artist/:id', checkAdminMiddleware, ArtistController.remove)

router.post('/track', checkAdminMiddleware, TrackController.create)
router.get('/track', TrackController.getAll)
router.get('/track/:id', TrackController.getOne)
router.get('/top-rating-tracks', TrackController.getTopRating)
router.patch('/track/:id', TrackController.update)
router.delete('/track/:id', checkAdminMiddleware, TrackController.remove)


module.exports = router