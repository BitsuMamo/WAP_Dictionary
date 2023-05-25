const wordsRouter = require("./word")
const express = require("express");
const cors = require("cors");
const port = 8080;

const app = express();
app.use(express.json());
app.use(cors());

app.use(wordsRouter);

app.listen(port, async () => {
    console.log(`Server started on http://localhost:${port}`);
})