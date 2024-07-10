import { z, ZodType } from 'zod';

export class TaskValidation {
  static readonly baseSchema = z.object({
    title: z.string().min(1).max(200),
  });

  static readonly CREATE: ZodType = this.baseSchema
}
