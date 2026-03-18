import { Action, SnapshotSubject, } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateSnapshot(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new SnapshotSubject())
}
export function canUpdateSnapshot(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new SnapshotSubject())
}
export function canDeleteSnapshot(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new SnapshotSubject())
}
export function canReadSnapshot(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new SnapshotSubject())
}
export function canManageSnapshot(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Manage, new SnapshotSubject())
}