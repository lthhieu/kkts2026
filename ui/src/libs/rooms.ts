import { Action, RoomSubject } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateRoom(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new RoomSubject())
}
export function canUpdateRoom(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new RoomSubject())
}
export function canDeleteRoom(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new RoomSubject())
}
export function canReadRoom(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new RoomSubject())
}