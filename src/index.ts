import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path"
import { generate } from "./utils"
import { getAllFiles } from "./file"
import { uploadFile } from "./aws";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate(); // asd12
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })

    // put this to s3
    res.json({
        id: id
    });
})

app.listen(3000);