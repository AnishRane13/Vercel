import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "a9f89213ca6e50374ed8095da3254580",
    secretAccessKey: "f4f24bfe2a4e2d6a6d16f1c545059119a8b6c9dbb63509fe72dfa306f87a890f",
    endpoint: "https://773f178490b86bb9991c2b81cce71b44.r2.cloudflarestorage.com"
})

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}