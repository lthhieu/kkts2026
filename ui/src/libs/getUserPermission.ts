
import { Action, DeviceSubject, NewsSubject, RequestSubject, RoomSubject, SnapshotSubject, UnitSubject, UploadSubject, UserSubject } from "@/libs/enum";
import { AbilityBuilder, createMongoAbility, InferSubjects, MongoAbility } from "@casl/ability";

type Subjects = InferSubjects<typeof DeviceSubject | typeof UserSubject | typeof RoomSubject | typeof UnitSubject | typeof NewsSubject | typeof UploadSubject | typeof RequestSubject> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

export function getUserPermission(user: any) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility)
    if (user.role === 'superadmin') {
        can(Action.Manage, 'all'); // read-write access to everything
    } else if (user.role === 'admin') {
        can(Action.Manage, UserSubject); // read-write access to UserSubject
        can(Action.Read, DeviceSubject); // read access to DeviceSubject
        can(Action.Read, UnitSubject);
        can(Action.Read, RoomSubject);
        can(Action.Read, NewsSubject);
        can(Action.Read, RequestSubject);
        can(Action.Read, SnapshotSubject);
        cannot(Action.Manage, UploadSubject);
    } else if (user.role === 'thukho') {
        cannot(Action.Manage, UserSubject);
        cannot(Action.Manage, NewsSubject);
        cannot(Action.Manage, UploadSubject);
        can(Action.Manage, DeviceSubject);
        can(Action.Manage, UnitSubject);
        can(Action.Manage, RoomSubject);
        can(Action.Manage, RequestSubject);
        can(Action.Manage, SnapshotSubject);
    } else if (user.role === 'truongdv') {
        can(Action.Read, UserSubject);
        cannot(Action.Manage, NewsSubject);
        cannot(Action.Manage, UploadSubject);
        can(Action.Read, DeviceSubject);
        can(Action.Read, UnitSubject);
        can(Action.Read, RoomSubject);
        can(Action.Read, RequestSubject);
        can(Action.Create, RequestSubject);
        can(Action.Comment, RequestSubject);
        can(Action.Read, SnapshotSubject);
    } else if (user.role === 'gv') {
        can(Action.Read, DeviceSubject);
        can(Action.Read, UnitSubject);
        can(Action.Read, RoomSubject);
        cannot(Action.Manage, UserSubject);
        cannot(Action.Manage, NewsSubject);
        cannot(Action.Manage, UploadSubject);
        can(Action.Read, RequestSubject);
        can(Action.Create, RequestSubject);
        can(Action.Comment, RequestSubject);
        can(Action.Read, SnapshotSubject);
    } else if (user.role === 'guest') {
        cannot(Action.Manage, UserSubject);
        cannot(Action.Manage, DeviceSubject);
        cannot(Action.Manage, RoomSubject);
        cannot(Action.Manage, NewsSubject);
        cannot(Action.Manage, UploadSubject);
        cannot(Action.Manage, RequestSubject);
        cannot(Action.Manage, SnapshotSubject);
        can(Action.Read, UnitSubject);
    }
    return build()
}
