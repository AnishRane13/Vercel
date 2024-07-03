"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const file_1 = require("./file");
const aws_1 = require("./aws");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    const id = (0, utils_1.generate)(); // asd12
    const localPath = path_1.default.join(__dirname, `output/${id}`);
    try {
        yield (0, simple_git_1.default)().clone(repoUrl, localPath);
        const files = (0, file_1.getAllFiles)(localPath);
        for (const file of files) {
            const s3FilePath = path_1.default.relative(__dirname, file).replace(/\\/g, '/'); // Replace backslashes with forward slashes
            yield (0, aws_1.uploadFile)(s3FilePath, file);
        }
        res.json({ id: id });
    }
    catch (error) {
        console.error("Error deploying repository:", error);
        res.status(500).json({ error: "Failed to deploy repository" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
