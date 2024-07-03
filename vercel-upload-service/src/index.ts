import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate(); // asd12
    const localPath = path.join(__dirname, `output/${id}`);

    try {
        await simpleGit().clone(repoUrl, localPath);

        const files = getAllFiles(localPath);

        for (const file of files) {
            const s3FilePath = path.relative(__dirname, file).replace(/\\/g, '/'); // Replace backslashes with forward slashes
            await uploadFile(s3FilePath, file);
        }
        
        publisher.lPush("build-queue", id)

        res.json({ id: id });
    } catch (error) {
        console.error("Error deploying repository:", error);
        res.status(500).json({ error: "Failed to deploy repository" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
