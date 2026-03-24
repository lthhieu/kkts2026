import { Action, NewsSubject } from "@/libs/enum";
import { getUserPermission } from "@/libs/getUserPermission";

export function canCreateNews(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Create, new NewsSubject())
}
export function canReadNews(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Read, new NewsSubject())
}
export function canUpdateNews(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Update, new NewsSubject())
}
export function canDeleteNews(user: IUser) {
    return getUserPermission(user ?? {} as IUser).can(Action.Delete, new NewsSubject())
}