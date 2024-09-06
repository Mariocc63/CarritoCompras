import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { Box, Container } from '@mui/material';

const Register = () => {
  return (
    <Container>
      <Box mt={5}>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default Register;