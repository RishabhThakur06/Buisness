const fs = require('fs');
const https = require('https');
const path = require('path');

// Image URLs mapping (using placeholder service, replace with actual images later)
const imageUrls = {
  'car1.jpg': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
  'car2.jpg': 'https://images.unsplash.com/photo-1503376785-2a5b9cb5c2d3?w=800&auto=format&fit=crop',
  'car3.jpg': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
  'car4.jpg': 'https://images.unsplash.com/photo-1503376785-2a5b9cb5c2d3?w=800&auto=format&fit=crop',
  'car5.jpg': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
  'car6.jpg': 'https://images.unsplash.com/photo-1503376785-2a5b9cb5c2d3?w=800&auto=format&fit=crop',
  'car7.jpg': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
  'car8.jpg': 'https://images.unsplash.com/photo-1503376785-2a5b9cb5c2d3?w=800&auto=format&fit=crop',
  'car9.jpg': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
  'car10.jpg': 'https://images.unsplash.com/photo-1503376785-2a5b9cb5c2d3?w=800&auto=format&fit=crop',
  'car11.jpg': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
  'car12.jpg': 'https://images.unsplash.com/photo-1503376785-2a5b9cb5c2d3?w=800&auto=format&fit=crop'
};

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  try {
    const downloadPromises = Object.entries(imageUrls).map(([filename, url]) => {
      const filepath = path.join(assetsDir, filename);
      return downloadImage(url, filepath);
    });
    
    await Promise.all(downloadPromises);
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

// Run the download
downloadAllImages();
