import React from 'react';
import { Formik, Form } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import Wrapper from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
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
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>
            <Button mt={4} type='submit' isLoading={isSubmitting} colorScheme='teal'>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
