const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK with service account
const serviceAccount = require(path.resolve("D:/Shopease/ecom-f6cc0-firebase-adminsdk-vg7u0-c831f5821e.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecom-f6cc0-default-rtdb.firebaseio.com"
});

// Reference to your Firebase database
const db = admin.database();

// Path to your image folder
const imagePath = "D:/Shopease/images";

// Function to recursively read files from a directory
function readFilesFromDirectory(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);
      // Check if it's a directory
      if (fs.lstatSync(filePath).isDirectory()) {
        // If it's a directory, recursively read files from it
        readFilesFromDirectory(filePath);
      } else {
        // If it's a file, upload its path to Firebase Realtime Database
        uploadImagePathToDatabase(filePath);
      }
    });
  });
}

// Function to upload image path to Firebase Realtime Database
function uploadImagePathToDatabase(filePath) {
  // Generate a unique key for the image
  const key = db.ref().child('images').push().key;

  // Upload the image path to Firebase Realtime Database
  db.ref('images/' + key).set({
    path: filePath
  }).then(() => {
    console.log('Image path uploaded:', filePath);
  }).catch(error => {
    console.error('Error uploading image path:', error);
  });
}

// Start reading files from the image folder
readFilesFromDirectory(imagePath);
