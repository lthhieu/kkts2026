
import { Action, DeviceSubject, NewsSubject, RoomSubject, UnitSubject, UploadSubject, UserSubject } from "@/libs/enum";
import { AbilityBuilder, createMongoAbility, InferSubjects, MongoAbility } from "@casl/ability";

type Subjects = InferSubjects<typeof DeviceSubject | typeof UserSubject | typeof RoomSubject | typeof UnitSubject | typeof NewsSubject | typeof UploadSubject> | 'all';

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
        cannot(Action.Manage, UploadSubject);
    } else if (user.role === 'thukho') {
        cannot(Action.Manage, UserSubject);
        cannot(Action.Manage, NewsSubject);
        cannot(Action.Manage, UploadSubject);
        can(Action.Manage, DeviceSubject);
        can(Action.Manage, UnitSubject);
        can(Action.Manage, RoomSubject);
    } else if (user.role === 'truongdv') {
        cannot(Action.Manage, UserSubject);
        cannot(Action.Manage, NewsSubject);
        cannot(Action.Manage, UploadSubject);
        can(Action.Read, DeviceSubject);
        can(Action.Read, UnitSubject);
        can(Action.Read, RoomSubject);
    } else if (user.role === 'gv') {
        cannot(Action.Delete, DeviceSubject);
        can(Action.Update, DeviceSubject, { unit: { $eq: user.unit } });
        can(Action.Read, DeviceSubject);
        can(Action.Create, DeviceSubject);
        can(Action.Read, UnitSubject);
        can(Action.Read, RoomSubject);
        cannot(Action.Manage, UserSubject);
        cannot(Action.Manage, NewsSubject);
        cannot(Action.Manage, UploadSubject);
    } else if (user.role === 'guest') {
        cannot(Action.Manage, UserSubject);
        cannot(Action.Manage, DeviceSubject);
        cannot(Action.Manage, RoomSubject);
        cannot(Action.Manage, NewsSubject);
        cannot(Action.Manage, UploadSubject);
        can(Action.Read, UnitSubject);
    }
    return build()
}
