import { Action, ChungtuSubject } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateChungtu(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new ChungtuSubject())
}
export function canReadChungtu(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new ChungtuSubject())
}
export function canUpdateChungtu(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new ChungtuSubject())
}
export function canDeleteChungtu(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new ChungtuSubject())
}