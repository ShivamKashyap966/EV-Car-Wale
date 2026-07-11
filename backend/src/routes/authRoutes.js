const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { syncFirebaseUser } = require('../controllers/authController');

const router = express.Router();

router.post('/firebase/sync', requireAuth, syncFirebaseUser);

module.exports = router;
