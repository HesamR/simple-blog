import { Link } from 'react-router-dom';
import { Container, Title, Stack, Button } from '@mantine/core';
export function ErrorPage() {
  return (
    <Container>
      <Stack justify='center' align='center' gap='xl' mt='lg'>
        <Title>Page Not Found!</Title>
        <Button component={Link} to='/' variant='subtle' size='md'>
          Take me back to home page
        </Button>
      </Stack>
    </Container>
  );
}

export default ErrorPage;
