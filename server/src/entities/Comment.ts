import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentUpdoot } from './CommentUpdoot';
// import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  
  @Field()
  @PrimaryGeneratedColumn()
  id!: number; // string is also supported

  @Field()
  @Column()
  text!: string;
  
  @Field()
  @Column({ type: 'int', default: 0 })
  points!: number;

  @Field(() => Int, { nullable: true })
  commentVoteStatus: number | null; // 1 or -1 or null

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @Column()
  postId: number;

  // @Field(() => Post)
  // @ManyToOne(() => Post, (post) => post.comments)
  // post: Post;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  creator: User;

  @OneToMany(() => CommentUpdoot, (commentUpdoot) => commentUpdoot.comment)
  commentUpdoots: CommentUpdoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
