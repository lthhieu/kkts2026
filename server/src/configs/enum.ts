import { AppAbility } from "src/casl/casl-ability.factory/casl-ability.factory";

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
    Comment = "Comment"
}
export class UserSubject {
    _id: string;
    role: string;
    unit: any
}
export class DeviceSubject {
    _id: string;
    unit: string
}
export class UnitSubject {
    _id: string;
}
export class RoomSubject {
    _id: string;
}
export class NewsSubject {
    _id: string;
}
export class UploadSubject {
    _id: string;
}
export class RequestSubject {
    _id: string;
    unit: string
}
export class SnapshotSubject {
    '_id': string;
}

// CSVC Subject (datdai, toanha, phgdht, ktx, ctk, ptn, xth, tbiptn, thuvien)
export class CsvcSubject { _id: string; }
// Danhmuc Subject (16 modules trong csvc/danhmuc/)
export class DanhmucSubject { _id: string; }