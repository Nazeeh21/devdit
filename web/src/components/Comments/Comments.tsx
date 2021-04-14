import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { useCommentsQuery } from '../../generated/graphql';
import { CommentUpdootSection } from '../CommentUpdootSection';
// import Layout from '../Layout';
import Wrapper from '../Wrapper';

interface CommentsProps {
  postId: number
}

export const Comments: React.FC<CommentsProps> = ({postId}) => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
    postId
  });
  const [{ data, error, fetching }] = useCommentsQuery({
    variables,
    
  });

  if (!data && !fetching) {
    return (
      <Wrapper>
        <Heading mb={4}>Comments</Heading>
        <div>You got no comments, query failed for some reason</div>
        <div>{error?.message}</div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <br />
      <Heading mb={4}>Comments</Heading>
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack mt={8}>
          {data!.comments.comments.map((comment) =>
            !comment ? null : (
              <Flex key={comment.id} p={5} shadow='md' borderWidth='1px'>
                {/* Comment updoot section */}
                <CommentUpdootSection comment={comment} postId={postId} />
                <Box>
                  <Text>{comment.text}</Text>
                  <Text mt={4}>Posted by: {comment.creator.username}</Text>
                </Box>

                <Box mt={4} ml='auto'>
                  {/* Edit delete comment Buttons */}
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.comments.hasMore && (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                postId,
                cursor:
                  data.comments.comments[data.comments.comments.length - 1]
                    .createdAt,
              });
            }}
            isLoading={fetching}
            mx='auto'
            my={8}
            colorScheme='cyan'
          >
            Load more
          </Button>
        </Flex>
      )}
    </Wrapper>
  );
};
