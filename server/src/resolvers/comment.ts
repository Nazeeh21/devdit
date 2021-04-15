import { Comment } from '../entities/Comment';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { CommentUpdoot } from '../entities/CommentUpdoot';
import { getConnection } from 'typeorm';
import { Post } from '../entities/Post';

@InputType()
class CommentInput {
  @Field()
  text: string;
}

@ObjectType()
class PaginatedComments {
  @Field(() => [Comment])
  comments: Comment[];

  @Field()
  hasMore: boolean;
}

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Comment) {
    return root.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.creatorId);
  }

  @FieldResolver(() => Int)
  async commentVoteStatus(
    @Root() comment: Comment,
    @Ctx() { commentUpdootLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    console.log('comment vote status running')
    const commentUpdoot = await commentUpdootLoader.load({
      commentId: comment.id,
      userId: req.session.userId,
    });

    console.log('commentUpdoot: ', commentUpdoot)
    // return commentUpdoot != undefined && commentUpdoot !== null ? commentUpdoot!.value : null;
    return commentUpdoot ? commentUpdoot!.value : null
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async commentVote(
    @Arg('commentId', () => Int) commentId: number,
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;

    const commentUpdoot = await CommentUpdoot.findOne({
      where: { commentId, userId },
    });

    if (commentUpdoot && commentUpdoot.value !== realValue) {
      // the user has voted on the post before and they are changing their vote

      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update comment_updoot
          set value = $1
          where "commentId" = $2 and "userId" = $3
          `,
          [realValue, commentId, userId]
        );

        await tm.query(
          `
          update comment
          set points = points + $1
          where id = $2
          `,
          [2 * realValue, commentId]
        );
      });
    } else if (!commentUpdoot) {
      // has never voted before

      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          insert into comment_updoot ("userId", "commentId", "postId", value)
          values ($1, $2, $3, $4)
          `,
          [userId, commentId, postId, realValue]
        );

        await tm.query(
          `
          update comment 
          set points = points + $1
          where id = $2
          `,
          [realValue, commentId]
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedComments)
  async comments(
    @Arg('postId', () => Int) postId: number,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedComments> {
    // 20 -> 21

    const realLimit = Math.min(50, limit);

    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if(cursor) {
      replacements.push(new Date(+cursor))
    }


    const comments = await getConnection().query(
      `
      select c.*
      from comment c
      where 
      ${cursor ? `c."createdAt" < $2 and` : ''}
      "postId" = ${postId}
      order by c."createdAt" DESC
      limit $1
    `,
      replacements
    );

    console.log('comments are : ', comments);
    return {
      comments: comments.slice(0, realLimit),
      hasMore: comments.length === realLimitPlusOne,
    };
  }

  @Query(() => Comment, { nullable: true })
  comment(@Arg('id', () => Int) id: number): Promise<Comment | undefined> {
    return Comment.findOne(id);
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg('input') input: CommentInput,
    @Arg('postId', () => Int) postId: number,
    @Ctx() { req }: MyContext
  ): Promise<Comment | null> {
    const post = await Post.find({ where: { id: postId } });
    console.log('post while commenting exists or not: ', post);

    if (post.length === 0) {
      console.log('--------------post does not exist of might got deleted-------------------');  
      return null;
    }

    console.log('--------------creating comments-------------------');

    return Comment.create({
      ...input,
      creatorId: req.session.userId,
      postId,
    }).save();
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg('id', () => Int) id: number,
    @Arg('text', { nullable: true }) text: string,
    @Ctx() { req }: MyContext
  ): Promise<Comment | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Comment)
      .set({ text })
      .where('id = :id and "creatorId" = :creatorId', {
        id: id,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();

    console.log('result: ', result);

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Comment.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
