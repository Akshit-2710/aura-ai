const fs = require('fs');
const path = require('path');

function fixDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (f.endsWith('.js')) {
            const fullPath = path.join(dir, f);
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/\\\$/g, '$');
            content = content.replace(/\\`/g, '`');
            
            const newPath = fullPath.replace(/\.js$/, '.tsx');
            fs.writeFileSync(newPath, content, 'utf8');
            fs.unlinkSync(fullPath);
        }
    }
}

fixDir(path.join(__dirname, 'src', 'components'));
fixDir(path.join(__dirname, 'src', 'utils'));
