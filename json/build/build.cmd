@echo off
node node_modules/webpack/bin/webpack.js --config webpack.prod.js
del dist\app.js
node build/regex.js
