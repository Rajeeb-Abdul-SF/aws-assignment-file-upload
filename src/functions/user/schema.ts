export default {
  type: 'object',
  properties: {
    user: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstname: { type: 'string' },
          lastname: { type: 'string' },
          email: { type: 'string' },
          email2: { type: 'string' },
          profession: { type: 'string' },
          salary: { type: 'string' },
          dob: { type: 'string' },
        },
        required: ['firstname', 'lastname', 'email'],
      },
    },
  },
  required: ['user'],
} as const;
