import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function migrateUsernames() {
  console.log('Starting username migration...');

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log('No users found to migrate.');
      return;
    }

    let updatedCount = 0;
    const batch = db.batch();

    snapshot.forEach(doc => {
      const userData = doc.data();
      if (!userData.username && userData.email) {
        const username = userData.email.split('@')[0];
        const userRef = usersRef.doc(doc.id);
        batch.update(userRef, { username: username });
        updatedCount++;
        console.log(`Updating user ${doc.id}: setting username to '${username}'`);
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`Migration complete. ${updatedCount} users updated with usernames.`);
    } else {
      console.log('No users needed username migration.');
    }

  } catch (error) {
    console.error('Error during username migration:', error);
  }
}

migrateUsernames().then(() => {
  console.log('Migration process finished.');
}).catch(error => {
  console.error('Unhandled error in migration script:', error);
});
