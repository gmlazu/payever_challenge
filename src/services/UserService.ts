import IUser from "../models/IUser";
import * as rp from "request-promise";
import IUserResponse from "../models/IUserResponse";

class UserService {

    public static getUser(userId: string): Promise<IUser> {
        return rp(`https://reqres.in/api/users/${userId}`)
        .then((response: string) => {
            const deserializedResponse: IUserResponse = JSON.parse(response);

            return deserializedResponse.data;
        });
    }

    public static getUserAvatar(userId: string): Promise<Buffer> {
        return rp(`https://reqres.in/api/users/${userId}`)
        .then((response: string) => {
            const deserializedResponse: IUserResponse = JSON.parse(response);
            const avatarUrl: string = deserializedResponse.data.avatar;

            return rp(avatarUrl, { encoding: "binary", headers: { "Content-Type": "image/jpeg" } });
        })
        .then((avatar: string) => {
            return Buffer.from(avatar, "binary");
        });
    }
}

export default UserService;
