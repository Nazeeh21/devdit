import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { useCommentsQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetIntId } from '../../utils/useGetIntId';
import { CommentUpdootSection } from '../CommentUpdootSection';
import { EditDeleteCommentButtons } from '../EditDeleteCommentButtons';
// import Layout from '../Layout';
import Wrapper from '../Wrapper';

const Comments: React.FC = () => {
  const intId = useGetIntId()
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
    postId: intId
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
                <CommentUpdootSection comment={comment} postId={intId} />
                <Box>
                  <Text>{comment.text}</Text>
                  <Text mt={4}>Posted by: {comment.creator.username}</Text>
                </Box>

                <Box mt={4} ml='auto'>
                  {/* Edit delete comment Buttons */}
                  <EditDeleteCommentButtons creatorId={comment.creator.id} id={comment.id} />
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
                postId: intId,
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

export default withUrqlClient(createUrqlClient)(Comments)