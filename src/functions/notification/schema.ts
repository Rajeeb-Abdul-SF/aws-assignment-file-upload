export default {
  type: 'object',
  properties: {
    email: { type: 'string' },
    message: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        text: { type: 'string' },
      },
      required: ['subject', 'text'],
    },
  },
  required: ['message'],
} as const;
