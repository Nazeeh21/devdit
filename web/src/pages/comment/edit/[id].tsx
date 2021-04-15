import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import Layout from '../../../components/Layout';
import {  useUpdateCommentMutation, useCommentQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';

const EditComment = ({}) => {
  const router = useRouter()

  const [, updateComment] = useUpdateCommentMutation()

  const intId = useGetIntId()

  const [{ data, error, fetching}] = useCommentQuery({
    pause: intId === -1,
    variables: {
      id: intId
    }
  })

  if(fetching) {
    return <Layout>
      <div>Loading...</div>
    </Layout>
  }

  if(error) {
    console.log('error in fetching comment', error.message)
  }

  if(!data?.comment) {
    return <Layout>
      <Box>Comment not found</Box>
    </Layout>
  }

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ text: data.comment.text }}
        onSubmit={async (values) => {
          console.log(values);

          await updateComment({ id: intId, ...values });
          router.back()
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                textarea
                name='text'
                placeholder='text...'
                label='Body'
              />
            </Box>
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Update Comment
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(EditComment)