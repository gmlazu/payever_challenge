import * as fs from "fs";
import { PathLike, WriteFileOptions } from "fs";

type PromisifiedReadFile = (path: fs.PathLike | number, options?: { encoding: string; flag?: string; } | string) => Promise<string | Buffer>;
type PromisifiedWriteFile = (path: PathLike | number, data: any) => Promise<void>;
type PromisifiedUnlink = (path: PathLike) => Promise<void>;
