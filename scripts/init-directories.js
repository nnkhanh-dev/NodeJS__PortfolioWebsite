const fs = require('fs');
const path = require('path');

const directories = [
    'public/uploads',
    'public/uploads/avatars',
    'public/uploads/resumes',
    'public/uploads/posts',
    'public/uploads/posts/images'
];

console.log('🚀 Initializing upload directories...\n');

directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created: ${dir}`);
    } else {
        console.log(`✓  Exists: ${dir}`);
    }
});

console.log('\n✨ All directories initialized successfully!');
