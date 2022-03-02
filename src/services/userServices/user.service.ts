import { UserModel } from 'models/user.model';
import { ReferralModel } from 'models/referral.model';
import { ContactModel } from 'models/contact.model';
import { IUser } from 'interfaces';
import { generateUID } from 'utils/uuid';

export class UserService {
    protected createUser = async (data: IUser) => {
        const user = new UserModel(data);
        user.referral_code = await generateUID();
        user.setPassword(data.password);
        return user.save();
    };
    protected createUserWithRefferal = async (
        data: IUser,
        referral_user: IUser
    ) => {
        const userCreated = await this.createUser(data);
        // if (user.user_type == 'Student') {
        //     const student = new StudentModel(data);
        //     student.user = user;
        //     await student.save();
        // }
        const referral_data = {
            referred_by: referral_user._id,
            referred_user: userCreated,
            referall_link: data.referral_code || '',
            status: 'ACCEPTED'
        };
        const referral = new ReferralModel(referral_data);
        await referral.save();
        await this.addContactsHelper([
            {
                contact: userCreated._id,
                user: referral_user._id
            },
            {
                contact: referral_user._id,
                user: userCreated._id
            }
        ]);
        return userCreated;
    };
    protected addContactsHelper = async (contacts: unknown) => {
        return ContactModel.insertMany(contacts);
    };
    protected getAllUsers = async (filters: unknown) => {
        return UserModel.find(filters)
            .populate('agentProfile')
            .populate('csProfile')
            .populate('tutorProfile')
            .populate('studentProfile')
            .exec();
    };
    protected checkReferralCode = async (query: unknown) => {
        return UserModel.findOne(query);
    };
}

