var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserChallengeSchema = new Schema({
  challengeStartsAt: String,
  challengeEndsAt: String,
  depositMethod: String,
  deposit: Number,
  verificationStatus: { type: Schema.Types.Mixed },
  completeNum: Number,
  successRate: Number,
  isSuccess: Boolean,
  totalPayback: Number,
  profit: Number,
  challengeReward: Number,
  receivedYieldAmount: Number,
  claimChallenge: Boolean,
  userInfo_id: String,
  challenge_id: String,
});

module.exports = mongoose.model('UserChallenge', UserChallengeSchema);
