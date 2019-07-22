import IUser from "./IUser";

export default interface IPageUserResponse {
    page: number,
    per_page: number,
    total: number,
    total_pages: number,
    data: Array<IUser>
}
