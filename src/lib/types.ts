import { z } from 'zod'

export const ClientSchema = z.object({
  name: z.string().describe("the user's name"),
  email: z.string().describe("the user's email"),
  gender: z.string().describe("guess the user's gender: {female | male}"),
  query: z.string().describe("summarizes the user's querys"),
})

const Client = ClientSchema.extend({
  messages_count: z.number().optional(),
})

export type Client = z.infer<typeof Client>
