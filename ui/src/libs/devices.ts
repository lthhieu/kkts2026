import { Action, DeviceSubject, RoomSubject, UserSubject } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateDevice(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new DeviceSubject())
}
export function canUpdateDevice(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new DeviceSubject())
}
export function canDeleteDevice(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new DeviceSubject())
}
export function canReadDevice(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new DeviceSubject())
}
export function canManageDevice(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Manage, new DeviceSubject())
}