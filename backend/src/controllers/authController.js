const { asyncHandler } = require('../utils/asyncHandler');
const { upsertFirebaseUser } = require('../services/userService');

const syncFirebaseUser = asyncHandler(async (req, res) => {
  const user = await upsertFirebaseUser(req.firebaseUser, req.body || {});
  res.json({ success: true, data: user });
});

module.exports = { syncFirebaseUser };
