export default {
  type: 'object',
  properties: {
    file: {
      type: 'object',
      properties: {
        filename: { type: 'string' },
        mimetype: 'string',
        content: { type: 'object', properties: { data: { type: 'array' } } },
      },
    },
  },
} as const;
