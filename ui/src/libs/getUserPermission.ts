
import { Action, DeviceSubject, RoomSubject, UnitSubject, UserSubject } from "@/libs/enum";
import { AbilityBuilder, createMongoAbility, InferSubjects, MongoAbility } from "@casl/ability";

type Subjects = InferSubjects<typeof DeviceSubject | typeof UserSubject | typeof RoomSubject | typeof UnitSubject> | 'all';

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
    } else if (user.role === 'thukho') {
        cannot(Action.Manage, UserSubject);
        can(Action.Manage, DeviceSubject);
        can(Action.Manage, UnitSubject);
        can(Action.Manage, RoomSubject);
    } else if (user.role === 'truongdv') {
        cannot(Action.Manage, UserSubject);
        can(Action.Read, DeviceSubject);
        can(Action.Read, UnitSubject);
        can(Action.Read, RoomSubject);
    } else if (user.role === 'gv') {
        cannot(Action.Delete, DeviceSubject);
        can(Action.Update, DeviceSubject, undefined, { unit: { $eq: user.unit } });
        can(Action.Read, DeviceSubject);
        can(Action.Create, DeviceSubject);
        can(Action.Read, UnitSubject);
        can(Action.Read, RoomSubject);
        cannot(Action.Manage, UserSubject);
    } else if (user.role === 'guest') {
        cannot(Action.Manage, UserSubject);
        cannot(Action.Manage, DeviceSubject);
        cannot(Action.Manage, RoomSubject);
        can(Action.Read, UnitSubject);
    }
    return build()
}
