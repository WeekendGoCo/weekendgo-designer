const fs = require('fs');
const path = require('path');

const dirs = [
  'c:\\Users\\User\\Downloads\\weekendgo-designer\\src\\components\\sidebar',
  'c:\\Users\\User\\Downloads\\weekendgo-designer\\src\\components\\sidebar\\sections'
];

dirs.forEach(dir => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Colors
    content = content.replace(/#fff/g, 'var(--text-main)');
    content = content.replace(/#FFFFFF/g, 'var(--text-main)');
    
    // Backgrounds
    content = content.replace(/rgba\(0,0,0,0\.3\)/g, 'var(--bg-input)');
    content = content.replace(/rgba\(0, 0, 0, 0\.3\)/g, 'var(--bg-input)');
    content = content.replace(/rgba\(0,0,0,0\.2\)/g, 'var(--bg-card)');
    content = content.replace(/rgba\(0, 0, 0, 0\.2\)/g, 'var(--bg-card)');
    content = content.replace(/rgba\(255,255,255,0\.05\)/g, 'var(--bg-card-border)');
    content = content.replace(/rgba\(255, 255, 255, 0\.05\)/g, 'var(--bg-card-border)');
    content = content.replace(/rgba\(255,255,255,0\.02\)/g, 'var(--bg-card-dark)');
    content = content.replace(/rgba\(255, 255, 255, 0\.02\)/g, 'var(--bg-card-dark)');
    content = content.replace(/rgba\(255,255,255,0\.1\)/g, 'var(--bg-card-border)');
    content = content.replace(/rgba\(255, 255, 255, 0\.1\)/g, 'var(--bg-card-border)');
    
    // Muted text
    content = content.replace(/rgba\(255,255,255,0\.7\)/g, 'var(--text-muted)');
    content = content.replace(/rgba\(255, 255, 255, 0\.7\)/g, 'var(--text-muted)');
    content = content.replace(/rgba\(255,255,255,0\.6\)/g, 'var(--text-muted)');
    content = content.replace(/rgba\(255,255,255,0\.5\)/g, 'var(--text-muted-dark)');
    content = content.replace(/rgba\(255, 255, 255, 0\.5\)/g, 'var(--text-muted-dark)');

    fs.writeFileSync(filePath, content, 'utf8');
  });
});

console.log('Replaced colors in sidebar components');
