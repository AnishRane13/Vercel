import express from "express";
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId: "a9f89213ca6e50374ed8095da3254580",
    secretAccessKey: "f4f24bfe2a4e2d6a6d16f1c545059119a8b6c9dbb63509fe72dfa306f87a890f",
    endpoint: "https://773f178490b86bb9991c2b81cce71b44.r2.cloudflarestorage.com"
});

const app = express();

app.get("/*", async (req, res) => {
    // id.100xdevs.com
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `output/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);