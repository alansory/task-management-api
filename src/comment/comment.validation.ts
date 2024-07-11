import { z, ZodType } from 'zod';

export class CommentValidation {
  static readonly baseSchema = z.object({
    content: z.string().min(1).max(200),
    task_id: z.number()
  });

  static readonly VALIDATE: ZodType = this.baseSchema
}
