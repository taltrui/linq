import z from "zod";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
};

export const usersContract = {
  list: {
    path: "/users",
    method: "GET",
    response: z.array(
      z.object({
        id: z.string(),
        email: z.string().email(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        image: z.string().nullable(),
        emailVerified: z.string().datetime().nullable(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
      })
    ),
  },
};
