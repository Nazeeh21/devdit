import { IconButton } from '@chakra-ui/button';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { PostSnippetFragment } from '../generated/graphql';
import { useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  // post: PostsQuery['posts']['posts'][0]
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [isLoading, setIsLoading] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [, vote] = useVoteMutation();
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        isLoading={isLoading === 'updoot-loading'}
        onClick={async () => {
          if(post.voteStatus === 1) {
            return
          }
          setIsLoading('updoot-loading');
          await vote({
            postId: post.id,
            value: 1,
          });
          setIsLoading('not-loading');
        }}
        aria-label='updoot post'
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        icon={<ChevronUpIcon w={6} h={6} />}
      />
      {post.points}
      <IconButton
        isLoading={isLoading === 'downdoot-loading'}
        onClick={async () => {
          if(post.voteStatus === -1) {
            return
          }
          setIsLoading('downdoot-loading');
          await vote({
            postId: post.id,
            value: -1,
          });
          setIsLoading('not-loading');
        }}
        aria-label='downdoot post'
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
        icon={<ChevronDownIcon w={6} h={6} />}
      />
    </Flex>
  );
};
