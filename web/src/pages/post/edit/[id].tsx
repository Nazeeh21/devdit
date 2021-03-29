import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react'
import { InputField } from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { createUrqlClient } from '../../../utils/createUrqlClient';

const EditPost = ({}) => {
    return (<Layout variant='small'>
    <Formik
      initialValues={{ title: '', text: '' }}
      onSubmit={async (values) => {
          console.log(values);

          // if (!error) {
          //   // console.log('error: ', error.message);
          //   router.push('/');
          // }
        }
      } 
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField name='title' placeholder='title' label='Title' />
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
            Create Post
          </Button>
        </Form>
      )}
    </Formik>
  </Layout>);
}


export default withUrqlClient(createUrqlClient)(EditPost)