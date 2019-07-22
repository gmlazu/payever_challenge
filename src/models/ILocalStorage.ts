import IUser from "./IUser";

export interface ILocalStorage {
    users: Array<IUser>,
    lastPage: number
}
