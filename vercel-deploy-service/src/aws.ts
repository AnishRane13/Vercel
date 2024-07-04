import { S3 } from "aws-sdk";
import { dir } from "console"
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: "a9f89213ca6e50374ed8095da3254580",
    secretAccessKey: "f4f24bfe2a4e2d6a6d16f1c545059119a8b6c9dbb63509fe72dfa306f87a890f",
    endpoint: "https://773f178490b86bb9991c2b81cce71b44.r2.cloudflarestorage.com"
});

export async function downloadS3Folder(prefix: string){
    console.log(prefix);
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
        Prefix: prefix
    }).promise();


    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise( async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);

            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true});
            }
            s3.getObject({
                Bucket: "vercel",
                Key
            }).createReadStream().pipe(outputFile)
            .on("finish", () => {
                resolve("");
            })
        })
    }) || []
    console.log("Awaiting")

    await Promise.all(allPromises?.filter(x => x !== undefined));
}
