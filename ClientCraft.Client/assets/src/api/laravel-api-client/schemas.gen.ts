// This file is auto-generated by @hey-api/openapi-ts

export const AccountModelSchema = {
    properties: {
        id: {
            description: 'Unique account ID',
            type: 'integer',
            example: 1
        },
        name: {
            description: 'Account name',
            type: 'string',
            example: 'John Doe'
        },
        status: {
            description: 'Account status',
            type: 'string',
            enum: ['customer', 'churn'],
            example: 'customer'
        },
        industry: {
            description: 'Industry of the account',
            type: 'string',
            example: 'Tech',
            nullable: true
        },
        website: {
            description: 'Website of the account',
            type: 'string',
            example: 'https://example.com',
            nullable: true
        },
        address: {
            description: 'Address of the account',
            type: 'string',
            example: '123 Street Name',
            nullable: true
        },
        phone: {
            description: 'Phone number of the account',
            type: 'string',
            example: '+1234567890',
            nullable: true
        },
        email: {
            description: 'Email address of the account',
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            nullable: true
        },
        created_at: {
            description: 'Date account was created',
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            description: 'Date account was last updated',
            type: 'string',
            format: 'date-time'
        }
    },
    type: 'object'
} as const;

export const ContactModelSchema = {
    properties: {
        id: {
            description: 'Unique contact ID',
            type: 'integer',
            readOnly: true,
            example: 1
        },
        name: {
            description: 'Contact Name',
            type: 'string',
            example: 'John'
        },
        role: {
            description: 'Job that this contact has in the company',
            type: 'string',
            example: 'Marketer',
            nullable: true
        },
        companies: {
            description: 'Companies that this contact is Attached to',
            type: 'string',
            readOnly: true,
            nullable: true
        },
        facebook_url: {
            description: "Url for the contact's facebook",
            type: 'string',
            example: 'www.facebook.com/contact',
            nullable: true
        },
        linkedin_url: {
            description: "Url for the contact's linkedin",
            type: 'string',
            example: 'www.linkedin.com/in/contact',
            nullable: true
        },
        instagram_url: {
            description: "Url for the contact's instagram",
            type: 'string',
            example: 'www.instagram.com/contact',
            nullable: true
        },
        last_contacted: {
            description: 'Date in which this contact was last contacted',
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        email: {
            description: 'Email address of the contact',
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            nullable: true
        },
        phone: {
            description: 'Phone number of the contact',
            type: 'string',
            example: '+1234567890',
            nullable: true
        },
        created_at: {
            description: 'Date contact was created',
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            description: 'Date contact was last updated',
            type: 'string',
            format: 'date-time'
        }
    },
    type: 'object'
} as const;

export const DealModelSchema = {
    properties: {
        id: {
            description: 'Unique contact ID',
            type: 'integer',
            readOnly: true,
            example: 1
        },
        name: {
            description: 'Deal Name',
            type: 'string',
            example: 'Anniversary cake'
        },
        deal_status_id: {
            description: 'ID of the deal status',
            type: 'number',
            example: 1
        },
        amount: {
            description: 'Deal amount',
            type: 'number',
            format: 'double',
            example: 1000.15,
            nullable: true
        },
        close_date: {
            description: 'Expected close date',
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        user_id: {
            description: 'Deal Owner',
            type: 'number',
            example: 1,
            nullable: true
        },
        deal_type_id: {
            description: 'Deal Type',
            type: 'number',
            example: 1,
            nullable: true
        },
        priority: {
            description: 'Deal priority',
            type: 'string',
            enum: ['low', 'medium', 'high'],
            example: 'low'
        },
        created_at: {
            description: 'Date deal was created',
            type: 'string',
            format: 'date-time',
            readOnly: true
        },
        updated_at: {
            description: 'Date deal was last updated',
            type: 'string',
            format: 'date-time',
            readOnly: true
        }
    },
    type: 'object'
} as const;

export const DealStatusModelSchema = {
    properties: {
        id: {
            description: 'Unique deal status ID',
            type: 'integer',
            example: 1
        },
        label: {
            description: 'deal status label',
            type: 'string',
            example: 'New Lead'
        },
        key: {
            description: 'unique key to identify',
            type: 'string',
            uniqueItems: true,
            example: 'new-lead'
        },
        order: {
            description: 'deal status order',
            type: 'integer',
            example: '1'
        },
        color: {
            description: 'deal status color',
            type: 'string',
            enum: ['default', 'positive', 'warning', 'danger'],
            example: 'default'
        },
        created_at: {
            description: 'Date deal status was created',
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            description: 'Date deal status was last updated',
            type: 'string',
            format: 'date-time'
        }
    },
    type: 'object'
} as const;

export const LeadModelSchema = {
    properties: {
        id: {
            description: 'Unique contact ID',
            type: 'integer',
            example: 1
        },
        name: {
            description: 'Lead name',
            type: 'string',
            example: 'John Doe'
        },
        company: {
            description: 'Lead Company name (Only for business leads)',
            type: 'string',
            example: 'ACME'
        },
        role: {
            description: 'Role that this lead works',
            type: 'string',
            example: 'Project Manager'
        },
        phone: {
            description: 'Phone number of the lead',
            type: 'string',
            example: '+1234567890',
            nullable: true
        },
        email: {
            description: 'Email address of the lead',
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            nullable: true
        },
        lead_status_id: {
            description: 'ID of the lead status',
            type: 'integer',
            example: 1
        },
        status: {
            '$ref': '#/components/schemas/LeadStatusModel'
        },
        owners: {
            description: 'List of users who own the lead',
            type: 'array',
            items: {
                '$ref': '#/components/schemas/UserModel'
            }
        },
        facebook_url: {
            description: "Link for Lead's facebook",
            type: 'string',
            example: 'https://facebook.com/user'
        },
        instagram_url: {
            description: "Link for Lead's instagram",
            type: 'string',
            example: 'https://instagram.com/user'
        },
        linkedin_url: {
            description: "Link for Lead's linkedin",
            type: 'string',
            example: 'https://linkedin.com/in/user'
        },
        last_contacted: {
            description: 'Date lead was last contacted',
            type: 'string',
            format: 'date-time'
        },
        created_at: {
            description: 'Date lead was created',
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            description: 'Date lead was last updated',
            type: 'string',
            format: 'date-time'
        }
    },
    type: 'object'
} as const;

export const LeadStatusModelSchema = {
    properties: {
        id: {
            description: 'Unique contact ID',
            type: 'integer',
            example: 1
        },
        label: {
            description: 'Status label',
            type: 'string',
            example: 'New Lead'
        },
        key: {
            description: 'unique key to identify',
            type: 'string',
            uniqueItems: true,
            example: 'new-lead'
        },
        order: {
            description: 'Status order',
            type: 'integer',
            example: '1'
        },
        color: {
            description: 'status',
            type: 'string',
            enum: ['default', 'positive', 'warning', 'danger'],
            example: 'default'
        },
        created_at: {
            description: 'Date status was created',
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            description: 'Date status was last updated',
            type: 'string',
            format: 'date-time'
        }
    },
    type: 'object'
} as const;

export const NoteModelSchema = {
    description: 'A note model representing comments or annotations tied to a notable entity.',
    required: ['content', 'notable_id'],
    properties: {
        id: {
            description: 'The unique identifier of the note.',
            type: 'integer',
            readOnly: true
        },
        content: {
            description: 'The content of the note.',
            type: 'string',
            example: 'This is a sample note.'
        },
        notable_id: {
            description: 'The ID of the notable entity (morph relationship).',
            type: 'integer',
            readOnly: true
        },
        created_at: {
            description: 'The timestamp when the note was created.',
            type: 'string',
            format: 'date-time',
            readOnly: true
        },
        updated_at: {
            description: 'The timestamp when the note was last updated.',
            type: 'string',
            format: 'date-time',
            readOnly: true
        }
    },
    type: 'object'
} as const;

export const PhotoModelSchema = {
    required: ['file_path', 'file_name', 'mime_type', 'file_size', 'uploaded_at', 'visibility'],
    properties: {
        id: {
            description: 'The unique identifier for the photo',
            type: 'integer'
        },
        file_path: {
            description: 'The file path of the photo',
            type: 'string'
        },
        file_name: {
            description: 'The file name of the photo',
            type: 'string'
        },
        mime_type: {
            description: 'The mime type of the photo',
            type: 'string'
        },
        file_size: {
            description: 'The size of the file in bytes',
            type: 'integer'
        },
        title: {
            description: 'The title of the photo',
            type: 'string'
        },
        description: {
            description: 'The description of the photo',
            type: 'string'
        },
        alt_text: {
            description: 'The alt text for the photo',
            type: 'string'
        },
        uploaded_by_id: {
            description: 'The ID of the user or contact who uploaded the photo',
            type: 'integer'
        },
        uploaded_by_type: {
            description: 'The type of the entity who uploaded the photo (e.g., User, Contact)',
            type: 'string'
        },
        uploaded_at: {
            description: 'The date and time when the photo was uploaded',
            type: 'string',
            format: 'date-time'
        },
        visibility: {
            description: 'Visibility status of the photo',
            type: 'string',
            enum: ['private', 'public']
        },
        width: {
            description: 'The width of the photo in pixels',
            type: 'integer'
        },
        height: {
            description: 'The height of the photo in pixels',
            type: 'integer'
        },
        thumbnail_path: {
            description: 'The path to the thumbnail image of the photo',
            type: 'string'
        },
        is_primary: {
            description: 'Indicates whether this is the primary photo',
            type: 'boolean'
        },
        status: {
            description: 'The current status of the photo',
            type: 'string'
        },
        photoable_id: {
            description: 'The ID of the model associated with the photo (e.g., Lead, Account)',
            type: 'integer'
        },
        photoable_type: {
            description: 'The type of the model associated with the photo (e.g., Lead, Account)',
            type: 'string'
        }
    },
    type: 'object'
} as const;

export const RoleModelSchema = {
    properties: {
        id: {
            description: 'Unique ID of the role',
            type: 'integer',
            example: 1
        },
        name: {
            description: 'Name of the role',
            type: 'string',
            example: 'Administrator'
        },
        users: {
            description: 'List of users associated with this role',
            type: 'array',
            items: {
                '$ref': '#/components/schemas/UserModel'
            }
        },
        created_at: {
            description: 'Date the role was created',
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            description: 'Date the role was last updated',
            type: 'string',
            format: 'date-time'
        }
    },
    type: 'object'
} as const;

export const UserModelSchema = {
    properties: {
        id: {
            description: 'Unique ID of the user',
            type: 'integer',
            readOnly: true,
            example: 1
        },
        name: {
            description: 'First name of the user',
            type: 'string',
            example: 'John'
        },
        email: {
            description: 'Email address of the user',
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com'
        },
        reference: {
            description: 'ID that matches with the user id on the source that the user came from',
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000'
        },
        source: {
            description: 'Where did this User came from',
            type: 'string',
            enum: ['umbraco', 'web'],
            example: 'umbraco'
        },
        created_at: {
            description: 'Date the user was created',
            type: 'string',
            format: 'date-time',
            readOnly: true
        },
        updated_at: {
            description: 'Date the user was last updated',
            type: 'string',
            format: 'date-time',
            readOnly: true
        }
    },
    type: 'object'
} as const;

export const AuthFormRequestSchema = {
    properties: {
        email: {
            type: 'string',
            example: 'arthur.nassar@client-craft.com'
        },
        password: {
            type: 'string',
            example: '111'
        }
    },
    type: 'object'
} as const;

export const ConvertLeadRequestSchema = {
    title: 'Convert Lead Request',
    description: 'Request body for converting a lead',
    required: ['lead'],
    properties: {
        lead: {
            description: 'The ID of the lead to convert',
            type: 'integer',
            example: 1
        },
        accountToCreate: {
            description: 'The name of the account to create',
            type: 'string',
            example: 'New Account',
            nullable: true
        },
        accountToAttach: {
            description: 'The ID of the existing account to attach',
            type: 'integer',
            example: 5,
            nullable: true
        },
        dealToCreate: {
            description: 'The name of the deal to create',
            type: 'string',
            example: 'New Deal',
            nullable: true
        },
        dealToAttach: {
            description: 'The ID of the existing deal to attach',
            type: 'integer',
            example: 15,
            nullable: true
        }
    },
    type: 'object'
} as const;

export const StoreAccountRequestSchema = {
    title: 'Store Account Request',
    description: 'Validation schema for creating a new account',
    required: ['name'],
    allOf: [
        {
            '$ref': '#/components/schemas/AccountModel'
        }
    ]
} as const;

export const StoreContactRequestSchema = {
    title: 'Store Contact Request',
    description: 'Validation schema for creating a new contact',
    required: ['first_name', 'last_name'],
    allOf: [
        {
            '$ref': '#/components/schemas/ContactModel'
        }
    ]
} as const;

export const StoreDealRequestSchema = {
    title: 'Store Deal Request',
    description: 'Validation schema for creating a new deal',
    required: ['name'],
    allOf: [
        {
            '$ref': '#/components/schemas/DealModel'
        }
    ]
} as const;

export const StoreLeadRequestSchema = {
    title: 'Store Lead Request',
    description: 'Validation schema for creating a new lead',
    required: ['name'],
    allOf: [
        {
            '$ref': '#/components/schemas/LeadModel'
        }
    ]
} as const;

export const UpdateAccountRequestSchema = {
    title: 'Update Account Request',
    description: 'Validation schema for updating an existing account',
    required: [],
    type: 'object',
    allOf: [
        {
            '$ref': '#/components/schemas/AccountModel'
        },
        {
            properties: {
                _method: {
                    description: 'HTTP method to spoof (e.g., PUT)',
                    type: 'string',
                    example: 'PUT'
                }
            },
            type: 'object'
        }
    ]
} as const;

export const UpdateContactRequestSchema = {
    title: 'Update Contact Request',
    description: 'Validation schema for updating an existing contact',
    required: [],
    type: 'object',
    allOf: [
        {
            '$ref': '#/components/schemas/ContactModel'
        },
        {
            properties: {
                _method: {
                    description: 'HTTP method to spoof (e.g., PUT)',
                    type: 'string',
                    example: 'PUT'
                }
            },
            type: 'object'
        }
    ]
} as const;

export const UpdateDealRequestSchema = {
    title: 'Update Deal Request',
    description: 'Validation schema for creating a new deal',
    required: ['name'],
    allOf: [
        {
            '$ref': '#/components/schemas/DealModel'
        }
    ]
} as const;

export const UpdateLeadRequestSchema = {
    title: 'Update Lead Request',
    description: 'Validation schema for updating an existing lead',
    required: [],
    type: 'object',
    allOf: [
        {
            '$ref': '#/components/schemas/LeadModel'
        },
        {
            properties: {
                _method: {
                    description: 'HTTP method to spoof (e.g., PUT)',
                    type: 'string',
                    example: 'PUT'
                }
            },
            type: 'object'
        }
    ]
} as const;

export const UpdateUserRequestSchema = {
    title: 'Update User Request',
    description: 'Validation schema for updating an existing user',
    required: [],
    type: 'object',
    allOf: [
        {
            '$ref': '#/components/schemas/UserModel'
        },
        {
            properties: {
                _method: {
                    description: 'HTTP method to spoof (e.g., PUT)',
                    type: 'string',
                    example: 'PUT'
                }
            },
            type: 'object'
        }
    ]
} as const;