const ChallengeInfo = require('../models/challengeInfo.model');
const UserChallenge = require('../models/userChallenge.model');

module.exports = {
  getChallengeAll: async (req, res) => {
    try {
      // if (!req.cookies['cookie-session']) {
      //   return res.status(401).json({
      //     error: 'Unauthorized',
      //   });
      // }

      const challengeInfo = await ChallengeInfo.find({});
      //console.log(challengeInfo);

      const today = new Date().getTime();
      const timestamps = challengeInfo.map((info) => ({
        startsAt: new Date(info.challengeStartsAt).getTime(),
        endsAt: new Date(info.challengeEndsAt).getTime(),
      }));

      for (let i = 0; i < challengeInfo.length; i++) {
        if (timestamps[i].startsAt > today) {
          challengeInfo[i].challengeStatus = 'onApplication';
        } else if (timestamps[i].endsAt < today) {
          challengeInfo[i].challengeStatus = 'completed';
        } else {
          challengeInfo[i].challengeStatus = 'ongoing';
        }
      }

      const updateOps = challengeInfo.map((info) => ({
        updateOne: {
          filter: { _id: info._id },
          update: { $set: { challengeStatus: info.challengeStatus } },
        },
      }));

      await ChallengeInfo.bulkWrite(updateOps);

      const challenges = challengeInfo.map((info) => ({
        challengeId: info._id,
        challengeStatus: info.challengeStatus,
        category: info.category,
        challengeThumbnail: info.challengeThumbnail,
        challengeStatus: info.challengeStatus,
        challengeVerificationFrequency: info.challengeVerificationFrequency,
        challengeName: info.challengeName,
        challengeStartsAt: info.challengeStartsAt,
        challengeEndsAt: info.challengeEndsAt,
        challengeParticipantsCount: info.challengeParticipantsCount,
        challengeTotalDeposit: info.challengeTotalDeposit,
        poolAddress: info.poolAddress,
      }));

      res.status(200).json({
        message: 'Challenge found',
        challenges,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },

  getChallengeById: async (req, res) => {
    try {
      const challengeInfo = await ChallengeInfo.findById(req.params.challengeId);

      if (!challengeInfo) {
        return res.status(404).json({
          error: 'Challenge not found',
        });
      }

      res.status(200).json({
        message: 'Challenge found',
        challengeInfo: {
          challengeId: challengeInfo._id,
          challengeThumbnail: challengeInfo.challengeThumbnail,
          challengeVerificationFrequency: challengeInfo.challengeVerificationFrequency,
          challengeName: challengeInfo.challengeName,
          challengeParticipantsCount: challengeInfo.challengeParticipantsCount,
          challengeTotalDeposit: challengeInfo.challengeTotalDeposit,
          challengeStartsAt: challengeInfo.challengeStartsAt,
          challengeEndsAt: challengeInfo.challengeEndsAt,
          challengeVerificationMethod: challengeInfo.challengeVerificationMethod,
          cryptoYield: challengeInfo.cryptoYield,
          poolAddress: challengeInfo.poolAddress,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  getChallengeByUserChallengeId: async (req, res) => {
    try {
      const userChallengeInfo = await UserChallenge.findById(req.params.userChallengeId);
      //console.log(userChallengeInfo);

      if (!userChallengeInfo) {
        return res.status(404).json({
          error: 'Challenge not found',
        });
      }

      const challengeInfo = await ChallengeInfo.findById(userChallengeInfo.challenge_id);

      res.status(200).json({
        message: 'Challenge found',
        challengeInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },

  createChallenge: async (req, res) => {
    try {
      const challenge = req.body;

      const challengeInfoName = await ChallengeInfo.findOne({
        challengeName: challenge.challengeName,
      });

      if (challenge.challengeName === '' || challengeInfoName) {
        return res.status(400).json({
          error: 'Challenge already exists or name is empty',
        });
      }

      const challengeInfo = await ChallengeInfo.create(challenge);
      res.status(200).json({
        message: 'Challenge created',
        challengeInfo: {
          challengeId: challengeInfo._id,
          challengeName: challengeInfo.challengeName,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  deleteChallengeById: async (req, res) => {
    try {
      const challengeInfo = await ChallengeInfo.findByIdAndDelete(req.params.challengeId);

      if (!challengeInfo) {
        return res.status(404).json({
          error: 'Challenge not found',
        });
      }

      res.status(200).json({
        message: 'Challenge deleted',
        challengeInfo: {
          challengeId: challengeInfo._id,
          challengeName: challengeInfo.challengeName,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
};
