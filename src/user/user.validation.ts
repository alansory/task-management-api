import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly baseSchema = z.object({
    email: z.string().email().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly REGISTER: ZodType = this.baseSchema
  static readonly LOGIN: ZodType = this.baseSchema

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
  });
}
