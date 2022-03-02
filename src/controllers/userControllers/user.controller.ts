import { UserService } from '../../services';
import { successResponse, failureResponse } from '../../utils/responses';
import { IUser, IFacebook, IAgent, ITutor, ICSUser } from '../../interfaces';
import { generateRandomUID } from '../../utils/random.uid';
export class UserController extends UserService {
    protected createUserAsync = async (req: Request, res: Response) => {
        const verify_code = await generateRandomUID(6);
        const body = req.body || {};
        const data: IUser = {
            ...body,
            verification_link: verify_code,
            email_verified: false,
            phone_verified: false
        };
        try {
            let query;
            const { email = '', phone = '', referral_code } = data || {}
            query = { email: email.toLowerCase(), phone };
            // if (registration_source == 'phone') {
            //     // const isValid = await twilio.checkPhoneValidOrNot(data.phone);
            //     // if (!isValid)
            //     //   return failureResponse('Invalid phone number.', null, res);
            //     // query = { phone };
            // }
            const user = await this.getAllUsers(query);
            let userCreated;
            let agentCreated;
            // let studentCreated;
            let tutorCreated;
            let csUserCreated;
            if (user.length) {
                return failureResponse('Sorry! Email Or Number Already Exists.', '', res);
            }
            if (referral_code) {
                const refferalUser = await this.checkReferralCode({
                    referral_code: data.referral_code
                });
                if (!refferalUser) return failureResponse('Invalid Refferral code.', '', res);

                userCreated = await this.createUserWithRefferal(data, refferalUser);
            } else {
                userCreated = await this.createUser(data);
            }
            // if (userCreated.user_type == 'Agent') {
            //     const agent: IAgent = {
            //         ...req.body,
            //         user: userCreated._id
            //     };
            //     agentCreated = await this.createAgent(agent);
            //     userCreated.agentProfile = agentCreated._id;
            // }
            // if (userCreated.user_type == 'Tutor') {
            //     const tutor: ITutor = { ...req.body, user: userCreated._id };
            //     tutorCreated = await this.createTutor(tutor);
            //     userCreated.tutorProfile = tutorCreated._id;
            // }
            // if (userCreated.user_type == 'Student') {
            //   const student: IStudent = { ...req.body, user: userCreated._id };
            //   studentCreated = await this.createStudent(student);
            //   userCreated.studentProfile = studentCreated._id;
            // }
            // if (userCreated.user_type == 'Support') {
            //     const csUser: ICSUser = { ...req.body, user: userCreated._id };
            //     csUserCreated = await this.createCSUser(csUser);
            //     userCreated.csUserProfile = csUserCreated._id;
            // }
            //create twilio conversation user
            // const twilioSid = await twilio.createConversationUser(userCreated);
            // if (twilioSid) {
            //     userCreated.twilio_sid = twilioSid;
            // }

            // await userCreated.save();
            // // console.log(userCreated);
            // delete userCreated.password;
            // delete userCreated.verification_link;
            // if (req.body.registration_source == 'email') {
            //     sendEmail(userCreated.email, 'Email Verification', 'verify_email', {
            //         first_name: userCreated.first_name,
            //         last_name: userCreated.last_name,
            //         link: `${req.get('origin')}/verify-identity/${verify_code}`,
            //         note: ''
            //     });
            // }
            // // phone verification
            // if (req.body.registration_source == 'phone') {
            //     const message = `Please verify your phone number by entering following code: ${verify_code}`;
            //     await sendMessage(userCreated.phone, message);
            // }

            // successResponse('User created successfully.', userCreated, res);
        } catch (error: unknown) {
            failureResponse('Failed to fetch user', error, res);
        }
    };
};

export const userControllerInstance = new UserController()