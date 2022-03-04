import * as Joi from 'joi';
import {
  TutorChosenBy,
  JobStatus,
  UserType,
  PaymentOptions,
  ContractStatus,
  Visibility,
  OptionTypes
} from '../interfaces';
// import JoiphoneNumber from 'joi-phone-number';
// const customJoi = Joi.extend(JoiphoneNumber);
const custom = Joi.extend((joi) => {
  return {
    type: 'stringArray',
    base: joi.array(),
    coerce(value) {
      console.log(value);
      return { value: value.split ? value.split(',') : value };
    }
  };
});
const mongoIDValidation = Joi.string().regex(
  /^[0-9a-fA-F]{24}$/,
  'Invalid MongoDB ID in params.'
);

const customValidation = Joi.extend((joi) => {
  return {
    type: 'queryArray',
    base: joi.array(),
    coerce(value) {
      return { value: value.split ? value.split(',') : value };
    }
  };
});

const dateValidation = Joi.string().regex(
  /^\d{1,2}\/\d{1,2}\/\d{4}$/,
  'Invalid date format. Please provide date as a string.'
);

const DocumentSchema = Joi.array().items(
  Joi.object({
    name: Joi.string(),
    image_path: Joi.string()
  })
);

// const phoneNumberValidation = Joi.string().regex(
//   /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/,
//   'Invalid number format. Please provide valid number.'
// );

const timeValidation = Joi.string().regex(
  /^\d{1,2}:\d{2}([ap]m)?$/,
  'Invalid time format. Please provide time like this: 3:00 AM as a string.'
);

const LocationSchema = Joi.object({
  address: Joi.string(),
  lat: Joi.string(),
  lngs: Joi.string(),
  time_zone: Joi.string(),
  country: Joi.string(),
  street_address: Joi.string(),
  city: Joi.string(),
  postal_code: Joi.string()
});

const ServiceSchema = Joi.object({
  title: Joi.string().allow('').allow(null),
  description: Joi.string().allow('').allow(null)
});

export const Schema = {
  mongoID: Joi.object({
    id: mongoIDValidation,
    userId: mongoIDValidation
  }),
  createUser: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    user_type: Joi.string()
      .required()
      .valid(...Object.values(UserType))
      .messages({
        'string.match': `Invalid user type. valid: ${Object.values(UserType)}`
      }),

    password: Joi.string().min(8).required(),
    referral_code: Joi.string().allow('').allow(null),
    registration_source: Joi.string()
  }),
  updateUser: Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    languages: Joi.array().items(Joi.string()),
    location: LocationSchema,
    company_name: Joi.string().allow('').allow(null),
    company_description: Joi.string().allow('').allow(null),
    company_logo: Joi.string().allow('').allow(null),
    service: ServiceSchema
  }),
  FilterAgent: Joi.object({
    per_page: Joi.string().required(),
    page: Joi.string().required()
  }),
  QueryUsers: Joi.object({
    queries: customValidation.queryArray().items(Joi.string()).required()
  }),
  SendInvites: Joi.object({
    queries: customValidation.queryArray().items(Joi.string()).required()
  }),

  FilterUsers: Joi.object({
    ids: custom.stringArray().items(mongoIDValidation)
  }),
  FilterUser: Joi.object({
    search_type: Joi.string().valid('phone', 'email', 'id').required(),
    query: Joi.when('search_type', {
      is: 'email',
      then: Joi.string().email().required()
    }).when('search_type', {
      is: 'id',
      then: mongoIDValidation.required()
    })
  }),
  sendVerificationEmail: Joi.object({
    email: Joi.string().required()
  }),
  verifyEmail: Joi.object({
    email: Joi.string().required(),
    verification_code: Joi.string().required()
  }),

  changePassword: Joi.object({
    old_password: Joi.string().min(8).required(),
    new_password: Joi.string().min(8).required()
  }),
  createUserWithPhone: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string().required(),
    user_type: Joi.string()
      .required()
      .valid(...Object.values(UserType))
      .messages({
        'string.match': `Invalid user type. valid: ${Object.values(UserType)}`
      }),
    password: Joi.string().min(8).required(),
    referral_code: Joi.string().allow('').allow(null)
  }),
  createCategory: Joi.object({
    title: Joi.string().required(),
    active: Joi.boolean()
  }),

  updateCategory: Joi.object({
    title: Joi.string().required(),
    active: Joi.boolean()
  }),

  createSchool: Joi.object({
    country: Joi.string().required(),
    graduate_school: Joi.boolean().required(),
    undergraduate_school: Joi.boolean().required(),
    junior_transfer_school: Joi.boolean().required()
  }),

  updateSchool: Joi.object({
    country: Joi.string().required(),
    graduate_school: Joi.boolean(),
    undergraduate_school: Joi.boolean(),
    junior_transfer_school: Joi.boolean()
  }),

  createTest: Joi.object({
    name: Joi.string().required()
  }),

  updateTest: Joi.object({
    name: Joi.string().required()
  }),

  createStudent: Joi.object({
    interested_subjects: Joi.array().unique().items(Joi.string()),
    payment_method_verified: Joi.boolean(),
    payment_method: mongoIDValidation,
    free_question_available: Joi.boolean(),
    free_book_solutions_available: Joi.boolean(),
    solutions: Joi.array().items(Joi.string()),
    attachments: Joi.array().unique().items(mongoIDValidation),
    user: mongoIDValidation.required()
  }),
  updateStudent: Joi.object({
    interested_subjects: Joi.array().unique().items(Joi.string()),
    payment_method_verified: Joi.boolean(),
    payment_method: mongoIDValidation,
    free_question_available: Joi.boolean(),
    amount: Joi.number(),
    free_book_solutions_available: Joi.boolean(),
    solutions: Joi.array().items(Joi.string()),
    attachments: Joi.array().items(
      Joi.object({
        document_type: Joi.string().required(),
        link: Joi.string()
      })
    )
  }),

  createTutor: Joi.object({
    services: Joi.array().unique().items(mongoIDValidation).required(),
    user: mongoIDValidation.required()
  }),

  updateTutor: Joi.object({
    services: Joi.array().unique().items(mongoIDValidation),
    service: mongoIDValidation,
    total_earned: Joi.number(),
    total_jobs_completed: Joi.number(),
    total_jobs_in_progress: Joi.number()
  }),
  createTax: Joi.object({
    name: Joi.string().required(),
    country: Joi.string(),
    street_address: Joi.string(),
    postal_code: Joi.string(),
    city: Joi.string().required(),
    classification: Joi.string()
  }),
  updateTax: Joi.object({
    name: Joi.string().required(),
    country: Joi.string(),
    street_address: Joi.string(),
    postal_code: Joi.string().required(),
    city: Joi.string().required(),
    classification: Joi.string()
  }),
  createQuestion: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
  }),

  updateQuestion: Joi.alternatives()
    .try(
      Joi.object().keys({
        title: Joi.string().required()
      }),
      Joi.object().keys({
        description: Joi.string().required()
      })
    )
    .messages({
      'alternatives.match': 'Please provide title or description'
    }),

  createService: Joi.object({
    title: Joi.string().required(),
    description: Joi.string()
  }),

  updateService: Joi.object({
    title: Joi.string(),
    description: Joi.string()
  }),

  createAgent: Joi.object({
    services: Joi.array().unique().items(mongoIDValidation).required(),
    user: mongoIDValidation.required()
  }),

  createCoupon: Joi.object({
    discount_amount: Joi.number().required(),
    discount_type: Joi.string().allow('').allow(null),
    user: mongoIDValidation
  }),

  updateCoupon: Joi.object({
    discount_amount: Joi.number().required(),
    discount_type: Joi.string().allow('').allow(null),
    user: mongoIDValidation
  }),

  updateAgent: Joi.object({
    company_name: Joi.string().allow('').allow(null),
    company_description: Joi.string().allow('').allow(null),
    company_logo: Joi.string().allow('').allow(null),
    total_earned: Joi.number(),
    amount: Joi.number(),
    total_jobs_completed: Joi.number(),
    total_jobs_in_progress: Joi.number(),
    service: mongoIDValidation,
    services: Joi.array().unique().items(mongoIDValidation)
  }),

  createQuickQuestion: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    posted_by: mongoIDValidation.required()
  }),

  assignQuickQuestion: Joi.object({
    assigned_to: mongoIDValidation.required()
  }),

  answerQuickQuestion: Joi.object({
    answer: Joi.string().required(),
    answered_by: mongoIDValidation.required()
  }),
  image: Joi.object({
    props: Joi.string(),
    image_path: Joi.string(),
    documents: DocumentSchema
  }),
  createJob: Joi.object({
    budget: Joi.number().required(),
    tip: Joi.number(),
    image_path: Joi.string(),
    languages: Joi.array().unique().items(Joi.string()),
    title: Joi.string(),
    description: Joi.string(),
    course_name: Joi.string(),
    coupon: mongoIDValidation,
    deadline_date: dateValidation,
    deadline_time: timeValidation,
    start_date: Joi.date(),
    end_date: Joi.date(),
    exam_length: Joi.number().min(1).max(8),
    exam_date: Joi.date(),
    exam_time: Joi.string(),
    time_zone: Joi.string(),
    grad_level: Joi.string(),
    school: mongoIDValidation,
    documents: DocumentSchema,
    number_of_pages: Joi.number(),
    tutor_chosen_by: Joi.string().valid(...Object.values(TutorChosenBy)),
    invites: Joi.array().unique().items(mongoIDValidation),
    category: mongoIDValidation.required(),
    subject: mongoIDValidation.required(),
    service: mongoIDValidation,
    student: mongoIDValidation.required()
  }),

  updateJob: Joi.object({
    budget: Joi.number(),
    tip: Joi.number(),
    languages: Joi.array().unique().items(Joi.string()),
    title: Joi.string(),
    image_path: Joi.string(),
    description: Joi.string(),
    course_name: Joi.string(),
    exam_date: Joi.date(),
    exam_time: Joi.string(),
    coupon: mongoIDValidation,
    deadline_date: dateValidation,
    deadline_time: timeValidation,
    start_date: Joi.date(),
    end_date: Joi.date(),
    exam_length: Joi.number().min(1).max(8),
    time_zone: Joi.string(),
    grad_level: Joi.string(),
    school: mongoIDValidation,
    status: Joi.string().valid(...Object.values(JobStatus)),
    documents: DocumentSchema,
    number_of_pages: Joi.number(),
    tutor_chosen_by: Joi.string().valid(...Object.values(TutorChosenBy)),
    category: mongoIDValidation,
    subject: mongoIDValidation,
    service: mongoIDValidation
  }),
  inviteAgentsJob: Joi.alternatives()
    .try(
      Joi.object().keys({
        invited_agents: Joi.array().unique().items(mongoIDValidation.required())
      }),
      Joi.object().keys({
        invited_agent: mongoIDValidation.required()
      })
    )
    .messages({
      'alternatives.match': 'Please provide invited_agent or invited_agents'
    }),

  updateCSUser: Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    description: Joi.string(),
    location: LocationSchema,
    company_name: Joi.string(),
    company_description: Joi.string(),
    company_logo: Joi.string()
  }),
  // createCSUser: Joi.object({
  //   first_name: Joi.string().required(),
  //   last_name: Joi.string().required(),
  //   email: Joi.string().email().required(),
  //   user_type: Joi.string().valid(UserType.support).required(),
  //   description: Joi.string().required(),
  //   location: LocationSchema,
  //   languages: Joi.array().unique().items(Joi.string()),
  //   company_name: Joi.string(),
  //   company_description: Joi.string(),
  //   company_logo: Joi.string(),
  //   agent_id: Joi.string(),
  //   registration_source: Joi.string()
  // }),
  createSubject: Joi.object().keys({
    title: Joi.string().required(),
    category: mongoIDValidation.required()
  }),
  updateSubject: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    category: mongoIDValidation
  }),
  removeService: Joi.object({
    service: mongoIDValidation.required()
  }),
  createContract: Joi.object({
    deadline: Joi.date().required(),
    documents: DocumentSchema,
    payment_options: Joi.string()
      .valid(...Object.values(PaymentOptions))
      .required(),
    amount: Joi.when('payment_options', {
      is: PaymentOptions.FIXED,
      then: Joi.number().required(),
      otherwise: Joi.number().forbidden()
    }),
    hourly_rate: Joi.when('payment_options', {
      is: PaymentOptions.HOURLY,
      then: Joi.number().required(),
      otherwise: Joi.number().forbidden()
    }),
    agent: mongoIDValidation.required(),
    image_path: Joi.string(),
    tutors: Joi.array().unique().items(mongoIDValidation.required()),
    job: mongoIDValidation.required()
  }),
  updateContract: Joi.object({
    status: Joi.string().valid(...Object.values(ContractStatus)),
    deadline: Joi.date(),
    payment_options: Joi.string().valid(...Object.values(PaymentOptions)),
    amount: Joi.when('payment_options', {
      is: PaymentOptions.FIXED,
      then: Joi.number().required(),
      otherwise: Joi.number().forbidden()
    }),
    hourly_rate: Joi.when('payment_options', {
      is: PaymentOptions.HOURLY,
      then: Joi.number().required(),
      otherwise: Joi.number().forbidden()
    }),
    agent: mongoIDValidation,
    tutors: Joi.array().unique().items(mongoIDValidation.required())
  }),
  phoneNumber: Joi.object({
    verification_code: Joi.string().required(),
    phone: Joi.string().required()
  }),
  OTP: Joi.object({
    phone: Joi.string().required()
  }),
  noAuthOtp: Joi.object({
    phone: Joi.string().required(),
    code: Joi.string().required()
  }),
  resetPassword: Joi.object({
    id: mongoIDValidation,
    token: Joi.string().required(),
    password: Joi.string().required(),
    source: Joi.string().required()
  }),
  CreateReview: Joi.object({
    ratings: Joi.object({
      skills: Joi.number().min(1).max(5).required(),
      work_quality: Joi.number().min(1).max(5).required(),
      availability: Joi.number().min(1).max(5).required(),
      adherence_to_schedule: Joi.number().min(1).max(5).required(),
      communication: Joi.number().min(1).max(5).required(),
      cooperation: Joi.number().min(1).max(5).required()
    }).required(),
    review: Joi.string().required(),
    visibility: Joi.string().valid(...Object.values(Visibility)),
    contract: mongoIDValidation.required(),
    feedback_by: mongoIDValidation.required(),
    feedback_to: mongoIDValidation.required()
  }),
  UpdateReview: Joi.object({
    ratings: Joi.object({
      skills: Joi.number().min(1).max(5).required(),
      work_quality: Joi.number().min(1).max(5).required(),
      availability: Joi.number().min(1).max(5).required(),
      adherence_to_schedule: Joi.number().min(1).max(5).required(),
      communication: Joi.number().min(1).max(5).required(),
      cooperation: Joi.number().min(1).max(5).required()
    }),
    review: Joi.string(),
    visibility: Joi.string().valid(...Object.values(Visibility))
  }),
  createContact: Joi.object({
    contact: mongoIDValidation.required()
  }),
  createNumberOfPages: Joi.object({
    number_of_pages: Joi.number().required(),
    word_per_page: Joi.number().required(),
    type: Joi.string().valid(...Object.values(OptionTypes))
  })
};
