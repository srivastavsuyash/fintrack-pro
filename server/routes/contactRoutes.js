import express from 'express'
import { sendContactEmail } from '../controllers/contactController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, sendContactEmail)

export default router