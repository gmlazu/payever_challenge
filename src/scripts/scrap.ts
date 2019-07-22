import * as rp from "request-promise";
import { PromisifiedReadFile, PromisifiedWriteFile } from "../models";
import * as fs from "fs";
import { promisify } from "util";
import * as path from "path";
import { ILocalStorage } from "../models/ILocalStorage";
import IPageUserResponse from "../models/IPageUserResponse";

const readFile: PromisifiedReadFile = promisify<fs.PathLike | number, string | Buffer>(fs.readFile);
const writeFile: PromisifiedWriteFile = promisify<fs.PathLike | number, any>(fs.writeFile);

const dataReadPromise: Promise<string | Buffer> = readFile(path.resolve(__dirname, `../../data/users.json`), "utf-8");

export const ScrapFunction = () => {
    dataReadPromise.then((localStorage: string | Buffer) => {
        const data: ILocalStorage = JSON.parse(<string> localStorage);

        return rp(`https://reqres.in/api/users?page=${data.lastPage + 1}`)
        .then((response: string) => {
            const deserializedResponse: IPageUserResponse = JSON.parse(response);

            for (let user of deserializedResponse.data) {
                // @ts-ignore
                data.users.push(user);
            }

            return data;
        });
    })
    .then((data: ILocalStorage) => {
        data.lastPage += 1;
        return writeFile(path.resolve(__dirname, `../../data/users.json`), JSON.stringify(data));
    });
};
