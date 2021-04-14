import { Button } from '@chakra-ui/button';
import { Box, Heading } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { useCreateCommentMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useGetIntId } from '../utils/useGetIntId';
import { useIsAuth } from '../utils/useIsAuth';
import { InputField } from './InputField';

const CreateComment: React.FC = () => {
  const postId = useGetIntId();
  const [, createComment] = useCreateCommentMutation();
  useIsAuth();
  return (
    <Box mt={6}>
      <Heading mb={2}>Create Comment</Heading>
      <Formik
        initialValues={{ text: '' }}
        onSubmit={async (values) => {
          const { error } = await createComment({ ...values, postId });

          if (!error) {
            console.log('comment created successfully');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='text' placeholder='text' label='Text' />
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Create Comment
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient)(CreateComment);
