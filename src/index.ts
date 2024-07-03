import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path"
import { generate } from "./utils"
import { getAllFiles } from "./file"

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`))
    console.log(files)
    // put this to s3
    res.json({
        id: id
    });
})

app.listen(3000);