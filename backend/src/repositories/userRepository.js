const { createRepository } = require('./dynamoRepository');

const repo = createRepository('users');

async function upsertUser(user) {
  return repo.put({
    pk: `USER#${user.firebaseUid}`,
    sk: 'PROFILE',
    ...user
  });
}

async function getUser(firebaseUid) {
  try {
    return await repo.get({ pk: `USER#${firebaseUid}`, sk: 'PROFILE' });
  } catch (error) {
    console.error(`Error fetching user ${firebaseUid}:`, error);
    return null;
  }
}

module.exports = { upsertUser, getUser };
