import DataLoader from 'dataloader';
import { Updoot } from '../entities/Updoot';

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, Updoot> = {};

      updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
      });

      console.log('updoots: ', updoots);
      console.log('----------------updootloader running ------------------');
      console.log('updoots: ', updoots);
      keys.map((key, index) => {
        const content = updootIdsToUpdoot[`${key.userId}|${key.postId}`];
        if (content == undefined) {
          keys.slice(index, 1);
        }
        console.log('return from createUpdootLoader: ', content);
      });
      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]
      );
    }
  );
