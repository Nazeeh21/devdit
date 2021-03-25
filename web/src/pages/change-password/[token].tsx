import { Button } from '@chakra-ui/button';
import { Box, Flex, Link } from '@chakra-ui/layout';
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
import NextLink from 'next/link';

const ChangePassword: NextPage = ({}) => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');

  // console.log(router.query)

  const [, changePassword] = useChangePasswordMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === 'string' ? router.query.token : '',
          });
          if (response.data?.changePassword.errors) {
            // console.log('error response in register user : ', response.data);

            const errorMap = toErrorMap(response.data.changePassword.errors);

            if ('token' in errorMap) {
              setTokenError(errorMap.token);
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
            {/* dffvdfd */}
            {tokenError && (
              <Flex>
                <Box color='red' mr={4}>
                  {tokenError}
                </Box>
                <NextLink href='/forgot-password'>
                  <Link>click here to get new token</Link>
                </NextLink>
              </Flex>
            )}

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

// @ts-ignore
export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
