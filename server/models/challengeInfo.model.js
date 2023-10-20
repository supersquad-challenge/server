var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ChallengeInfoSchema = new Schema({
  category: String,
  challengeName: String,
  joinChallengeStartsAt: String,
  joinChallengeEndsAt: String,
  challengeStartsAt: String,
  challengeEndsAt: String,
  challengeStatus: String,
  challengeVerificationFrequency: String,
  challengeTotalVerificationNum: Number,
  challengeRequiredCompleteNum: Number,
  challengeMaxParticipants: Number,
  challengeParticipantsCount: Number,
  challengeVerificationMethod: String,
  challengeCashDeposit: Number,
  cashSuccessPool: Number,
  cashFailPool: Number,
  challengeCryptoDeposit: Number,
  cryptoSuccessPool: Number,
  cryptoFailPool: Number,
  challengeTotalDeposit: Number,
  defiPool: String,
  cryptoYield: Number,
  description: String,
  challengeThumbnail: String,
	poolAddress: String
});

module.exports = mongoose.model('ChallengeInfo', ChallengeInfoSchema);
