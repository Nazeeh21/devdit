import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState('')
  
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
            if (response.data?.changePassword.errors) {
              console.log('error response in register user : ', response.data);

              const errorMap = toErrorMap(response.data.changePassword.errors)

              if('token' in errorMap) {
                setTokenError(errorMap.token)
              }

              setErrors(errorMap);
              // syntax we are getting from backend [{field: 'username', message: 'something wrong'}]
              // setErrors({
              //   username: 'usernamee already taken'
              // })
            } else if (response.data?.changePassword.user) {
              // worked
              router.push('/');
            }
          // console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              placeholder='new password'
              label='New Password'
              type='password'
            />
            {tokenError && <Box olor='red'>{tokenError}</Box>}
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};
// @ts-ignore
export default withUrqlClient(createUrqlClient, {ssr: false})(ChangePassword);
