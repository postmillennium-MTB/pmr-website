#!/bin/sh
# Builds the single-file game: src/page.html + all src/NN-*.js (in order) + closing tag.
set -e
cd "$(dirname "$0")"
mkdir -p build
cat src/[0-9]*.js > build/game.js
node --check build/game.js
cat src/page.html build/game.js > build/quill-and-compass.html
printf '</script>\n</body>\n</html>\n' >> build/quill-and-compass.html
cp build/quill-and-compass.html ../index.html
echo "built build/quill-and-compass.html ($(wc -c < build/quill-and-compass.html) bytes)"
