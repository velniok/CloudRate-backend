const Router = require('express').Router

const UserController = require('../controllers/UserController')
const ArtistController = require('../controllers/ArtistController')
const TrackController = require('../controllers/TrackController')

const registerValidation = require('../validations/auth')
const artistValidation = require('../validations/artist')

const checkAuthMiddleware = require('../middleware/checkAuthMiddleware')
const upload = require('../multer')
const checkAdminMiddleware = require('../middleware/checkAdminMiddleware')

const router = new Router()

router.post('/auth/login', UserController.login)
router.post('/auth/register', registerValidation, UserController.register)
router.get('/auth/me', checkAuthMiddleware, UserController.authMe)
router.get('/auth/:id', UserController.getUser)
router.patch('/auth/:id', UserController.update)

router.post('/upload', upload.single('image'), (req, res) => {
    try {
        res.json({
            url: `/workspace/uploads/${req.file.originalname}`
        })
    } catch (err) {
        console.log(err)
    }
})

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