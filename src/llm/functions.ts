const queryExtractor = {
  name: 'searchInDB',
  description: 'Make the search in the database',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: "Summary of the user's query",
      },
    },
    required: ['query'],
  },
}

const messageExtractor = {
  name: 'chatMessage',
  description: 'User message summary if there is no query to the database',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: "Summary of the user's message",
      },
    },
    required: ['message'],
  },
}
