import { Action, UserSubject } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateUser(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new UserSubject())
}
export function canReadUser(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new UserSubject())
}
export function canUpdateUser(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new UserSubject())
}
export function canDeleteUser(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new UserSubject())
}