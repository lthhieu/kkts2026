import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action, DeviceSubject, RoomSubject, UnitSubject, UserSubject } from "src/configs/enum";

type Subjects = InferSubjects<typeof DeviceSubject | typeof UserSubject | typeof RoomSubject | typeof UnitSubject> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: UserSubject) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

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
            can(Action.Delete, DeviceSubject);
            can(Action.Update, DeviceSubject, { unit: { $eq: user.unit } });
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

        return build({
            // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
