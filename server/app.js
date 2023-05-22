const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
const port = 8080;


const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());



app.get("/count", async (req, res) => {

    const word = req.query.word;
    if (word == null || word == "")
        res.json(await prisma.entries.count())
    else 
        res.json(await prisma.entries.count({
            where: {
                word
            }
        }))
    
})

app.get("/getWords/:word", async (req, res) => {

    let offset = req.query.offset ? Number(req.query.offset) : 0;
    let count = req.query.count ? Number(req.query.count) : 9;

    const word = req.params.word;

    res.json(await prisma.entries.findMany({
        where: {
            word
        },
        skip: offset,
        take: count,
    }
    ));

})

app.get("/", async (req, res) => {
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    let count = req.query.count ? Number(req.query.count) : 9;

    res.json(await prisma.entries.findMany({
        skip: offset,
        take: count
    }));
})


app.listen(port, async () => {
    console.log(`Server started on http://localhost:${port}`);
})
