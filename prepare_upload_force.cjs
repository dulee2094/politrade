const fs = require('fs');
const path = require('path');

const src = 'd:\\앱 개발\\6. Politrade';
const dest = 'd:\\앱 개발\\6. Politrade\\upload_for_github';

const ignoreDirs = new Set(['node_modules', 'dist', 'upload_for_github', '.git']);

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir);
  for (const item of items) {
    if (ignoreDirs.has(item)) continue;
    const s = path.join(srcDir, item);
    const d = path.join(destDir, item);
    const stat = fs.statSync(s);

    if (stat.isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

if (fs.existsSync(dest)) {
  console.log('Clearing old upload_for_github directory...');
  fs.rmSync(dest, { recursive: true, force: true });
}

console.log('Copying fresh source files...');
copyRecursive(src, dest);

console.log('✅ FORCE COPY COMPLETED SUCCESSFULLY!\n');

const heroPath = path.join(dest, 'src', 'features', 'landing', 'components', 'HeroSection.tsx');
if (fs.existsSync(heroPath)) {
  const content = fs.readFileSync(heroPath, 'utf-8');
  if (content.includes('실시간 민심 펄스와 공적 이슈가 살아있는')) {
    console.log('🎉 VERIFICATION CONFIRMED: upload_for_github now contains the LATEST HeroSection.tsx!');
  } else {
    console.log('⚠️ WARNING: HeroSection.tsx in upload_for_github still has old content!');
  }
} else {
  console.log('⚠️ WARNING: HeroSection.tsx missing in upload_for_github!');
}
