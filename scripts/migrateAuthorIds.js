import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: Make sure you have the serviceAccountKey.json file in the root of your project
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };

// The UID to set for posts that are missing an authorId
const DEFAULT_AUTHOR_ID = 'dfZ3gj5UX1M6LwYcLEmhUpDTpco1';

console.log(`Using UID: ${DEFAULT_AUTHOR_ID} for migration.`);

// Initialize the Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase app already initialized.');
  } else {
    console.error('Firebase Admin initialization error:', error);
    process.exit(1);
  }
}


const db = getFirestore();

async function migrateAuthorIds() {
  console.log('Starting migration to add missing authorId fields...');
  
  const postsRef = db.collection('posts');
  const snapshot = await postsRef.get();

  if (snapshot.empty) {
    console.log('No posts found in the collection. Nothing to do.');
    return;
  }

  const batch = db.batch();
  let updatedCount = 0;

  snapshot.forEach(doc => {
    const postData = doc.data();
    if (!postData.authorId) {
      console.log(`- Found post [${doc.id}] without an authorId. Scheduling for update.`);
      batch.update(doc.ref, { authorId: DEFAULT_AUTHOR_ID });
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    console.log(`
Found ${updatedCount} posts to update. Committing changes...`);
    try {
      await batch.commit();
      console.log('Successfully updated all posts!');
    } catch (error) {
      console.error('Error committing batch updates:', error);
      throw error;
    }
  } else {
    console.log('
All posts already have an authorId. No migration needed.');
  }

  console.log('Migration process finished.');
}

migrateAuthorIds().catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
