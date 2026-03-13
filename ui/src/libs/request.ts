import { Action, RequestSubject, } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateRequest(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new RequestSubject())
}
export function canUpdateRequest(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new RequestSubject())
}
export function canDeleteRequest(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new RequestSubject())
}
export function canReadRequest(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new RequestSubject())
}
export function canManageRequest(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Manage, new RequestSubject())
}
export function canCommentRequest(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Comment, new RequestSubject())
}