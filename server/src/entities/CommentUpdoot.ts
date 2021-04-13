// import { Field, ObjectType } from 'type-graphql';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';

@ObjectType()
@Entity()
export class CommentUpdoot extends BaseEntity {
  // @Field()
  @Column({ type: 'int' })
  value: number;

  // @Field()
  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  // @Field()
  @PrimaryColumn()
  postId: number;

  // // @Field(() => Post)
  // @ManyToOne(() => Post, (post) => post.updoots, {
  //   onDelete: 'CASCADE'
  // })
  // post: Post;

   @Field(() => Comment)
   @ManyToOne(() => Comment, (comment) => comment.commentUpdoots, {
    onDelete: 'CASCADE'
  })
  comment: Comment;
}
