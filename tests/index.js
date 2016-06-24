const req = require.context('.', true, /\.test.js$/);
const files = req.keys();

files.forEach(file => req(file));
