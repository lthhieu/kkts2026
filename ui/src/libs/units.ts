import { Action, UnitSubject } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateUnit(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new UnitSubject())
}
export function canReadUnit(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new UnitSubject())
}
export function canUpdateUnit(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new UnitSubject())
}
export function canDeleteUnit(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new UnitSubject())
}