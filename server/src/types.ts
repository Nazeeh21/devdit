import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createCommentUpdootLoader } from './utils/createCommentUpdootLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';
import { createUserLoader } from './utils/createUserLoader';

export type MyContext = {
  // @ts-ignore-start
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis,
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
  commentUpdootLoader: ReturnType<typeof createCommentUpdootLoader>
  // @ts-ignore-end
};
