export { }

declare global {
    interface IUser {
        _id: string,
        email: string,
        name: string,
        role: string,
        unit: any
    }

}