const express = require('express');
const router = express.Router();

const myChallenge = require('../controllers/myChallenge.controller');

router.post('/register', myChallenge.registerMyChallenge);
router.get('/allMychallenge/:userInfoId', myChallenge.getAllMychallenge);
router.post('/userChallengeId/', myChallenge.getMychallengeByChallengeId);
router.get('/myStatus/:userChallengeId', myChallenge.getMyStatus);
router.get('/totalStatus/:userChallengeId', myChallenge.getTotalStatus);
router.get('/payback/:userChallengeId', myChallenge.getPayback);
router.get('/verifyPhoto/:userChallengeId', myChallenge.getVerifyPhoto);
router.get('/thumbnail/:userChallengeId', myChallenge.getThumbnail);

module.exports = router;
