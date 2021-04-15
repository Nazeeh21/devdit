import { IconButton } from '@chakra-ui/button';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/layout';
import React, { useState } from 'react'
import { CommentSnippetFragment, useCommentVoteMutation} from '../generated/graphql'

interface CommentUpdootSectionProps {
  comment: CommentSnippetFragment;
  postId: number;
}

export const CommentUpdootSection: React.FC<CommentUpdootSectionProps> = ({comment, postId}) => {
  const [isLoading, setIsLoading] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')

  const [, voteComment] = useCommentVoteMutation()

    return (
      <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
        <IconButton isLoading={isLoading === 'updoot-loading'} onClick={async () => {
          if(comment.commentVoteStatus === 1) {
            return 
          }
          setIsLoading('updoot-loading')
          await voteComment({
            commentId: comment.id,
            postId,
            value: 1
          })
          setIsLoading('not-loading')
        }}
        aria-label='updoot comment'
        colorScheme={comment.commentVoteStatus === 1 ? 'green' : undefined}
        icon={<ChevronUpIcon w={6} h={6} />}
        />
        {comment.points}
        <IconButton
        isLoading={isLoading === 'downdoot-loading'}
        onClick={async () => {
          if(comment.commentVoteStatus === -1) {
            return
          }
          setIsLoading('downdoot-loading');
          await voteComment({
            commentId: comment.id,
            postId,
            value: -1,
          });
          setIsLoading('not-loading');
        }}
        aria-label='downdoot post'
        colorScheme={comment.commentVoteStatus === -1 ? 'red' : undefined}
        icon={<ChevronDownIcon w={6} h={6} />}
      />
      </Flex>
    );
}