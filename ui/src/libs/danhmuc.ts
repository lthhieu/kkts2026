import { Action, DanhmucSubject } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateDanhmuc(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new DanhmucSubject())
}
export function canReadDanhmuc(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new DanhmucSubject())
}
export function canUpdateDanhmuc(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new DanhmucSubject())
}
export function canDeleteDanhmuc(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new DanhmucSubject())
}
