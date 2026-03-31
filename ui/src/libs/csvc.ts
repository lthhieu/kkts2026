import { Action, CsvcSubject } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateCsvc(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new CsvcSubject())
}
export function canReadCsvc(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new CsvcSubject())
}
export function canUpdateCsvc(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new CsvcSubject())
}
export function canDeleteCsvc(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new CsvcSubject())
}
