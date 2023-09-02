export default {
  type: "object",
  properties: {
    user: {
      type: "array",
      itemType: {
        type: "object",
        properties: {
          firstname: { type: "string" },
          lastname: { type: "string" },
          email: { type: "string" },
          email2: { type: "string" },
          profession: { type: "string" },
          salary: { type: "string" },
          dob: { type: "string" },
        },
      },
    },
  },
  required: ["user"],
} as const;
