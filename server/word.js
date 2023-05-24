const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require('express')
const router = express.Router()



router.get("/count", async (req, res) => {

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

router.get("/getWords/:word", async (req, res) => {

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

router.get("/", async (req, res) => {
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    let count = req.query.count ? Number(req.query.count) : 9;

    res.json(await prisma.entries.findMany({
        skip: offset,
        take: count
    }));
})

module.exports = router;
