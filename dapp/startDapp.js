require("@babel/register")({
    presets: ["@babel/preset-env"],
    ignore: ["node_modules", ".next", "client"]
});

// Import the rest of our application.
module.exports = require("./src/server/index.js");