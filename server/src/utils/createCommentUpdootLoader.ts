import DataLoader from 'dataloader';
import { CommentUpdoot } from '../entities/CommentUpdoot';

export const createCommentUpdootLoader = () =>
  new DataLoader<{ commentId: number; userId: number }, CommentUpdoot | null>(
    async (keys) => {
      const commentUpdoots = await CommentUpdoot.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, CommentUpdoot> = {};

      commentUpdoots.forEach((commentUpdoot) => {
        updootIdsToUpdoot[
          `${commentUpdoot.userId}|${commentUpdoot.commentId}`
        ] = commentUpdoot;
      });

      console.log('commentUpdoots: ', commentUpdoots);
      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}|${key.commentId}`]
      );
    }
  );
