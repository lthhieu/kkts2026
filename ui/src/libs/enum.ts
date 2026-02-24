import { AppAbility } from "@/libs/getUserPermission";

interface IPolicyHandler {
    handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}
export class UserSubject {
    '_id': string;
    'role': string;
    unit: any
}
export class DeviceSubject {
    '_id': string;
    'unit': string
}
export class UnitSubject {
    '_id': string;
}
export class RoomSubject {
    '_id': string;
}