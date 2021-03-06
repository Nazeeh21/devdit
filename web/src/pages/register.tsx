import React from 'react';
import { Formik, Form } from 'formik';
// import {
//   FormControl,
//   FormErrorMessage,
//   FormLabel,
// } from '@chakra-ui/form-control';
// import { Input } from '@chakra-ui/input';
import { InputField } from '../components/InputField';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
// import { useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Layout from '../components/Layout';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();

  const [, register] = useRegisterMutation();
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values});

          if (response.data?.register.errors) {
            // console.log('error response in register user : ', response.data);
            setErrors(toErrorMap(response.data.register.errors));
            // syntax we are getting from backend [{field: 'username', message: 'something wrong'}]
            // setErrors({
            //   username: 'usernamee already taken'
            // })
          } else if (response.data?.register.user) {
            // worked
            router.push('/');
          }
          // console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='username'
              label='Username'
            />
             <Box mt={4}>
              <InputField
                name='email'
                placeholder='email'
                label='Email'
                type='email'
              />
            </Box>
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
