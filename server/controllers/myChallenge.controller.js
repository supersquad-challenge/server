const ChallengeInfo = require('../models/challengeInfo.model');
const UserChallenge = require('../models/userChallenge.model');
const VerificationPhoto = require('../models/verificationPhoto.model');

module.exports = {
  registerMyChallenge: async (req, res) => {
    try {
      const userChallengeInfo = req.body;

      const userChallenge = await UserChallenge.find({
        userInfo_id: userChallengeInfo.userInfoId,
      });

      for (let i = 0; i < userChallenge.length; i++) {
        if (userChallenge[i].challenge_id === userChallengeInfo.challengeId) {
          return res.status(409).json({
            error: 'My challenge already registered',
            userChallengeId: userChallenge[i]._id,
          });
        }
      }

      const challengeInfo = await ChallengeInfo.findById(userChallengeInfo.challengeId);

      if (!challengeInfo) {
        return res.status(404).json({
          error: 'Challenge not found',
        });
      }

      const userRegisterData = {
        depositMethod: '',
        deposit: 0,
        completeNum: challengeInfo.challengeTotalVerificationNum,
        successRate: 100,
        isSuccess: false,
        totalPayback: 0,
        profit: 0,
        challengeReward: 0,
        receivedYieldAmount: 0,
        claimChallenge: false,
        userInfo_id: userChallengeInfo.userInfoId,
        challenge_id: userChallengeInfo.challengeId,
      };

      const userChallengeData = await UserChallenge.create(userRegisterData);

      res.status(200).json({
        message: 'My challenge registered',
        userChallengeId: userChallengeData._id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  getAllMychallenge: async (req, res) => {
    try {
      const userChallengeInfo = await UserChallenge.find({
        userInfo_id: req.params.userInfoId,
      });

      if (!userChallengeInfo) {
        return res.status(404).json({
          error: 'My challenge not found',
        });
      }

      const getChallengeInfoByIds = async (ids) => {
        try {
          const challengeInfo = await ChallengeInfo.find({ _id: { $in: ids } }); // ids에 해당하는 challenge 정보를 조회합니다.
          return challengeInfo;
        } catch (err) {
          console.error(err);
          throw new Error('Failed to get challenge info');
        }
      };

      const challengeIds = userChallengeInfo.map((info) => info.challenge_id);
      const challengeInfo = await getChallengeInfoByIds(challengeIds);
      //console.log(challengeInfo);

      res.status(200).json({
        message: 'My challenge found',
        challengeInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  getMychallengeByChallengeId: async (req, res) => {
    try {
      const userChallenge = await UserChallenge.findOne({
        challenge_id: req.body.challengeId,
        userInfo_id: req.body.userInfoId,
      });

      if (!userChallenge) {
        return res.status(404).json({
          error: 'My challenge not found',
        });
      }

      res.status(200).json({
        message: 'My challenge found',
        userChallengeId: userChallenge._id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  getMyStatus: async (req, res) => {
    try {
      const userChallengeInfo = await UserChallenge.findById(req.params.userChallengeId);

      if (!userChallengeInfo) {
        return res.status(404).json({
          error: 'User Challenge not found',
        });
      }

      const challengeInfo = await ChallengeInfo.findById(userChallengeInfo.challenge_id);
      const verificationPhotoInfo = await VerificationPhoto.find({
        userChallenge_id: req.params.userChallengeId,
      });

      const callDate = new Date();
      //console.log(callDate);

      res.status(200).json({
        message: 'My status found',
        myStatus: {
          challengeId: challengeInfo._id,
          successRate: userChallengeInfo.successRate,
          deposit: userChallengeInfo.deposit,
          challengeName: challengeInfo.challengeName,
          challengeStatus: challengeInfo.challengeStatus,
          challengeVerificationFrequency: challengeInfo.challengeVerificationFrequency,
          challengeStartsAt: challengeInfo.challengeStartsAt,
          challengeEndsAt: challengeInfo.challengeEndsAt,
          userChallengeId: userChallengeInfo._id,
          challengeParticipantsCount: challengeInfo.challengeParticipantsCount,
          challengeTotalDeposit: challengeInfo.challengeTotalDeposit,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  getTotalStatus: async (req, res) => {
    try {
      const userChallengeInfo = await UserChallenge.findById(req.params.userChallengeId);

      if (!userChallengeInfo) {
        return res.status(404).json({
          error: 'User Challenge not found',
        });
      }

      const challengeInfo = await ChallengeInfo.findById(userChallengeInfo.challenge_id);

      const cryptoYieldBoostAmount =
        challengeInfo.challengeCryptoDeposit * challengeInfo.cryptoYield * 0.01;
      const totalStatus = {
        challengeId: challengeInfo._id,
        challengeTotalDeposit: challengeInfo.challengeTotalDeposit,
        cryptoYieldBoost: cryptoYieldBoostAmount,
        cashSuccessPool: challengeInfo.cashSuccessPool,
        cashFailPool: challengeInfo.cashFailPool,
        challengeCryptoDeposit: challengeInfo.challengeCryptoDeposit,
        cryptoSuccessPool: challengeInfo.cryptoSuccessPool,
        cryptoFailPool: challengeInfo.cryptoFailPool,
      };

      res.status(200).json({
        message: 'Total status found',
        totalStatus,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  getPayback: async (req, res) => {
    try {
      const userChallengeInfo = await UserChallenge.findById(req.params.userChallengeId);

      if (!userChallengeInfo) {
        return res.status(404).json({
          error: 'User Challenge not found',
        });
      }

      const challengeInfo = await ChallengeInfo.findById(userChallengeInfo.challenge_id);
      if (userChallengeInfo.depositMethod === 'cash') {
        let profit = 0;

        if (userChallengeInfo.successRate === 100) {
          userChallengeInfo.totalPayback =
            userChallengeInfo.deposit +
            (challengeInfo.cashFailPool * 0.6 * userChallengeInfo.deposit) /
              challengeInfo.challengeCashDeposit;
          profit = userChallengeInfo.totalPayback - userChallengeInfo.deposit;
        } else if (userChallengeInfo.successRate >= 80) {
          userChallengeInfo.totalPayback = userChallengeInfo.deposit;
        } else {
          userChallengeInfo.totalPayback =
            userChallengeInfo.deposit *
            (userChallengeInfo.completeNum / challengeInfo.challengeRequiredCompleteNum);
        }

        const userChallengeData = await UserChallenge.findByIdAndUpdate(
          req.params.userChallengeId,
          {
            $set: {
              totalPayback: userChallengeInfo.totalPayback,
              profit: profit,
              challengeReward: (profit / userChallengeInfo.deposit) * 100,
            },
          },
          { new: true }
        );

        res.status(200).json({
          message: 'Payback found',
          payback: {
            successRate: userChallengeData.successRate,
            totalPayback: userChallengeData.totalPayback,
            profit: userChallengeData.profit,
            challengeReward: userChallengeData.challengeReward,
            cryptoYieldBoost:
              (userChallengeData.receivedYieldAmount / userChallengeData.deposit) * 100,
          },
        });
      } else {
        let profit = 0;
        let receivedYieldAmount =
          userChallengeInfo.deposit *
          challengeInfo.cryptoYield *
          0.01 *
          (challengeInfo.challengeTotalVerificationNum / 365);
        let challengeReward =
          (challengeInfo.cryptoFailPool * 0.6 * userChallengeInfo.deposit) /
          challengeInfo.challengeCryptoDeposit;

        if (userChallengeInfo.successRate === 100) {
          userChallengeInfo.totalPayback =
            userChallengeInfo.deposit + challengeReward + receivedYieldAmount;

          profit = userChallengeInfo.totalPayback - userChallengeInfo.deposit;
        } else if (userChallengeInfo.successRate >= 80) {
          userChallengeInfo.totalPayback =
            userChallengeInfo.deposit + receivedYieldAmount;

          profit = userChallengeInfo.totalPayback - userChallengeInfo.deposit;
          challengeReward = 0;
        } else {
          userChallengeInfo.totalPayback =
            userChallengeInfo.deposit *
            (userChallengeInfo.completeNum / challengeInfo.challengeRequiredCompleteNum);
          receivedYieldAmount = 0;
          challengeReward = 0;
        }

        const userChallengeData = await UserChallenge.findByIdAndUpdate(
          req.params.userChallengeId,
          {
            $set: {
              totalPayback: userChallengeInfo.totalPayback,
              profit: profit,
              challengeReward: (challengeReward / userChallengeInfo.deposit) * 100,
              receivedYieldAmount: receivedYieldAmount,
            },
          },
          { new: true }
        );

        res.status(200).json({
          message: 'Payback found',
          payback: {
            successRate: userChallengeData.successRate,
            totalPayback: userChallengeData.totalPayback,
            profit: userChallengeData.profit,
            challengeReward: userChallengeData.challengeReward,
            cryptoYieldBoost:
              (userChallengeData.receivedYieldAmount / userChallengeData.deposit) * 100,
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  getVerifyPhoto: async (req, res) => {
    try {
      const { userChallengeId } = req.params;
      const verifyPhotos = await VerificationPhoto.find({
        userChallenge_id: userChallengeId,
      });

      if (!verifyPhotos || verifyPhotos.length === 0) {
        return res.status(404).json({
          error: 'Verification Photo not found',
        });
      }

      const currentDate = new Date();
      let isUploaded = false;

      for (const verifyPhoto of verifyPhotos) {
        const uploadedDate = new Date(verifyPhoto.uploadedAt);
        const timezoneOffset = uploadedDate.getTimezoneOffset() * 60 * 1000;
        const convertedUploadedDate = new Date(uploadedDate.getTime() - timezoneOffset);

        if (
          currentDate.getMonth() === convertedUploadedDate.getMonth() &&
          currentDate.getDate() === convertedUploadedDate.getDate()
        ) {
          isUploaded = true;
          break;
        }
      }

      res.status(200).json({
        message: 'Verification Photo found',
        isUploaded,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
};
