import { Request, Response, Router } from "express";
import { promisify } from "util";
import { PromisifiedReadFile, PromisifiedUnlink, PromisifiedWriteFile } from "../models";
import * as fs from "fs";
import * as path from "path";
import IAvatarResponse from "../models/IAvatarResponse";
import UserService from "../services/UserService";
import IUser from "../models/IUser";
import { StatusCodeError } from "request-promise/errors";

const readFile: PromisifiedReadFile = promisify<fs.PathLike | number, string | Buffer>(fs.readFile);
const writeFile: PromisifiedWriteFile = promisify<fs.PathLike | number, any>(fs.writeFile);
const unlink: PromisifiedUnlink = promisify<fs.PathLike>(fs.unlink);

const router: Router = Router();

router.get("/:userId", (req: Request, res: Response): void => {

    const userId: string = req.params.userId;

    UserService.getUser(userId)
    .then((user: IUser) => {
        res.status(200)
        .send(JSON.stringify(user));
    })
    .catch((err: StatusCodeError) => {
        res.status(err.statusCode)
        .send({ error: err.message });
    });


});

router.get("/:userId/avatar", async (req: Request, res: Response): Promise<void> => {

    const userId: string = req.params.userId;

    // Check if avatar already exists
    if (!fs.existsSync(path.resolve(__dirname, `../../uploads/${userId}.jpg`))) {
        await UserService.getUserAvatar(userId)
        .then((avatar: Buffer) => {
            return writeFile(path.resolve(__dirname, `../../uploads/${userId}.jpg`), avatar);
        })
        .catch((err: StatusCodeError) => {
            res.status(err.statusCode)
            .send({ error: err.message });
        });
    }

    readFile(path.resolve(__dirname, `../../uploads/${userId}.jpg`))
    .then((avatar: string | Buffer) => {
        const base64Avatar: string = avatar.toString("base64");
        const response: IAvatarResponse = { avatar: base64Avatar };

        res.status(200)
        .send(JSON.stringify(response));
    })
    .catch((err: StatusCodeError) => {
        res.status(err.statusCode)
        .send({ error: err.message });
    });

});

router.delete("/:userId/avatar", (req: Request, res: Response): void => {

    const userId: string = req.params.userId;
    const avatarPath: string = path.resolve(__dirname, `../../uploads/${userId}.jpg`);

    if (fs.existsSync(avatarPath)) {
        unlink(avatarPath)
        .then(() => {
            res.status(204).end();
        })
        .catch((err: Error) => {
            res.status(500)
            .send(JSON.stringify(err));
        })
    } else {
        res.status(404).end();
    }

});

export const UserController: Router = router;
