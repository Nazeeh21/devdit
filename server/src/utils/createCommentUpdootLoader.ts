import DataLoader from 'dataloader';
import { CommentUpdoot } from '../entities/CommentUpdoot';

export const createCommentUpdootLoader = () =>
  new DataLoader<{ commentId: number; userId: number }, CommentUpdoot | undefined | null>(
    async (keys) => {
      const commentUpdoots = await CommentUpdoot.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, CommentUpdoot> = {};

      console.log('keys from createCommentUpdootLoader: ', keys)
      commentUpdoots.forEach((commentUpdoot) => {
        updootIdsToUpdoot[
          `${commentUpdoot.userId}|${commentUpdoot.commentId}`
        ] = commentUpdoot;
      });

      console.log('----------------commentupdootloader running ------------------')
      console.log('commentUpdoots: ', commentUpdoots);
      // keys.filter(
      //   (key) => {
      //     const content = updootIdsToUpdoot[`${key.userId}|${key.commentId}`];
      //     return content === undefined ? false : true

      //   }
      // );

      // keys.map(
      //   (key) => {
      //     const content = updootIdsToUpdoot[`${key.userId}|${key.commentId}`];
      //     console.log('return from createCommentUpdootLoader: ', content)

      //   }
      // );

      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}|${key.commentId}`]
      );
    }
  );
