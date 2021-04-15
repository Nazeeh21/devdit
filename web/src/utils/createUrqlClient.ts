import { Cache, cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange, stringifyVariables } from 'urql';
import {
  CommentVoteMutationVariables,
  DeleteCommentMutationVariables,
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router';
import { gql } from '@urql/core';
import { isServer } from './isServer';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('not Authenticated')) {
        // console.log('error: ', error.message);
        Router.replace('/login');
      }
    })
  );
};

export type MergeMode = 'before' | 'after';

export interface PaginationParams {
  offsetArgument?: string;
  limitArgument?: string;
  mergeMode?: MergeMode;
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    // console.log(entityKey, fieldName);

    const allFields = cache.inspectFields(entityKey);
    // console.log('allFields: ', allFields);

    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    // console.log(fieldInfos);

    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // console.log('fieldArgs: ', fieldArgs);

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // console.log('Key we created: ', fieldKey);

    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      'posts'
    );
    // console.log('isItInTheCache', isItInTheCache);

    info.partial = !isItInTheCache;

    const results: string[] = [];

    let hasMore = true;

    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const _hasMore = cache.resolve(key, 'hasMore');

      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      // const data = cache.resolve(entityKey, fieldInfo.fieldKey) as string[];
      results.push(...data);
    });

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
    };
  };
};

const cursorPaginationforComments = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    // console.log(entityKey, fieldName);

    const allFields = cache.inspectFields(entityKey);
    console.log('allFields: ', allFields);

    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    console.log(fieldInfos);

    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    console.log('fieldArgs: ', fieldArgs);

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // console.log('Key we created: ', fieldKey);

    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      'comments'
    );
    // console.log('isItInTheCache', isItInTheCache);

    info.partial = !isItInTheCache;

    const results: string[] = [];

    let hasMore = true;

    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, 'comments') as string[];
      const _hasMore = cache.resolve(key, 'hasMore');

      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      // const data = cache.resolve(entityKey, fieldInfo.fieldKey) as string[];
      results.push(...data);
    });

    return {
      __typename: 'PaginatedComments',
      hasMore,
      posts: results,
    };
  };
};

const invalidateAllPosts = (cache: Cache) => {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
  fieldInfos.forEach((fieldInfo) => {
    cache.invalidate('Query', 'posts', fieldInfo.arguments || {});
  });
};

const invalidateAllComments = (cache: Cache) => {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === 'comments');
  fieldInfos.forEach((fieldInfo) => {
    cache.invalidate('Query', 'comments', fieldInfo.arguments || {});
  });
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServer()) {
    // console.log('qid from ctx: ', ctx.req.headers.cookie)
    cookie = ctx?.req?.headers?.cookie;
  }
  return {
    url: process.env.NEXT_PUBLIC_API_URL as string,
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
          PaginatedComments: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
            comments: cursorPaginationforComments()
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, _args, cache, _info) => {
              cache.invalidate({
                __typename: 'Post',
                id: (_args as DeletePostMutationVariables).id,
              });
            },
            deleteComment: (_result, _args, cache, _info) => {
              cache.invalidate({
                __typename: 'Comment',
                id: (_args as DeleteCommentMutationVariables).id,
              });
            },
            vote: (_result, _args, cache, _info) => {
              const { postId, value } = _args as VoteMutationVariables;

              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId }
              ); // Data or null

              // console.log('data: ', data);
              if (data) {
                if (data.voteStatus === value) {
                  return;
                }
                const newPoints =
                  data.points + (!data.voteStatus ? 1 : 2) * value;

                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value }
                );
              }
            },
            commentVote: (_result, _args, cache, _info) => {
              const { commentId, value } = _args as CommentVoteMutationVariables;

              const data = cache.readFragment(
                gql`
                  fragment _ on Comment {
                    id
                    points
                    commentVoteStatus
                  }
                `,
                { id: commentId }
              ); // Data or null

              // console.log('data: ', data);
              if (data) {
                if (data.commentVoteStatus === value) {
                  return;
                }
                const newPoints =
                  data.points + (!data.commentVoteStatus ? 1 : 2) * value;

                cache.writeFragment(
                  gql`
                    fragment _ on Comment {
                      points
                      commentVoteStatus
                    }
                  `,
                  { id: commentId, points: newPoints, commentVoteStatus: value }
                );
              }
            },
            createComment: (_result, _args, cache, _info) => {
              invalidateAllComments(cache);
            },
            createPost: (_result, _args, cache, _info) => {
              invalidateAllPosts(cache);
            },
            logout: (_result, _args, cache, _info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, _args, cache, _info) => {
              // ...
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
              invalidateAllPosts(cache);
            },
            register: (_result, _args, cache, _info) => {
              // ...
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
