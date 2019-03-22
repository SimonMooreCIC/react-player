const http = require("http");
const path = require("path");
const express = require("express");

const app = express();

app.use("/videos", (req, res) => {
    res.sendFile(req.query.filePath);
});

const srv = http.createServer(app)
    .listen(process.env.PORT || 8081, () =>
        console.log("App UI listening on PORT: ", process.env.PORT || 8081)
    );

module.exports = srv;