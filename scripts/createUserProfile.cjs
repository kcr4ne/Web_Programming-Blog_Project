const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// IMPORTANT: Make sure you have the serviceAccountKey.json file in the root of your project
const serviceAccount = require('../serviceAccountKey.json');

// --- Configuration ---
const USER_UID = 'WW36xBcRr4WyJy2u0SEovHkPlbU2';
const USERNAME = 'cr4ne';
const ROLE = 'user'; // or 'admin' if this user should be an admin
// ---------------------

console.log(`Attempting to create profile for UID: ${USER_UID}`);

// Initialize the Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin initialization error:', error);
    process.exit(1);
  }
}

const db = getFirestore();

async function createUserProfile() {
  const userRef = db.collection('users').doc(USER_UID);
  const docSnap = await userRef.get();

  if (docSnap.exists) {
    console.log(`Profile for UID ${USER_UID} already exists. Document data:`);
    console.log(docSnap.data());
    console.log('No action taken.');
    return;
  }

  console.log('Profile does not exist. Creating new profile document...');

  const dummyEmail = `${USERNAME}@blogkyle.com`;

  const newProfileData = {
    username: USERNAME,
    email: dummyEmail, // The email used for auth
    role: ROLE,
    createdAt: new Date(),
  };

  try {
    await userRef.set(newProfileData);
    console.log('Successfully created user profile document!');
    console.log('Data written:', newProfileData);
  } catch (error) {
    console.error('Error creating user profile document:', error);
    process.exit(1);
  }
}

createUserProfile().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
