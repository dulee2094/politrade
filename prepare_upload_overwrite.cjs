const fs = require('fs');
const path = require('path');

const src = 'd:\\앱 개발\\6. Politrade';
const dest = 'd:\\앱 개발\\6. Politrade\\upload_for_github';

const ignoreDirs = new Set(['node_modules', 'dist', 'upload_for_github', '.git']);

function copyOverwrite(srcDir, destDir) {
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
      copyOverwrite(s, d);
    } else {
      fs.copyFileSync(s, d); // Overwrite file forcefully
    }
  }
}

console.log('Copying fresh source files with force overwrite...');
copyOverwrite(src, dest);

console.log('✅ FORCE OVERWRITE COMPLETED SUCCESSFULLY!\n');

const pulseCardPath = path.join(dest, 'src', 'features', 'pulse', 'components', 'WeeklyPulseReportCard.tsx');
if (fs.existsSync(pulseCardPath)) {
  const content = fs.readFileSync(pulseCardPath, 'utf-8');
  if (content.includes('주간 민심 펄스 현황')) {
    console.log('🎉 VERIFICATION CONFIRMED: upload_for_github contains the LATEST WeeklyPulseReportCard.tsx!');
  } else {
    console.log('⚠️ WARNING: WeeklyPulseReportCard.tsx in upload_for_github has old content!');
  }
} else {
  console.log('⚠️ WARNING: WeeklyPulseReportCard.tsx missing in upload_for_github!');
}

