import { Avatar, Button, Collapse, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconLogout, IconSettings } from '@tabler/icons-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import usePromise from '../hooks/usePromise';
import { logout } from '../api/api';
import { useNavigate } from 'react-router-dom';

function MobileMiddleBar() {
  return (
    <>
      <Button component='a' href='/users' variant='subtle' size='md'>
        Users
      </Button>
      <Button component='a' href='/articles' variant='subtle' size='md'>
        Articles
      </Button>
    </>
  );
}

function MobileProfileMenu() {
  const [opened, { toggle }] = useDisclosure();

  const auth = useContext(AuthContext);

  return (
    <>
      <Button
        leftSection={<Avatar />}
        rightSection={<IconChevronDown />}
        variant='gradient'
        radius='xs'
        size='md'
        onClick={toggle}
      >
        {auth.user?.email}
      </Button>
      <Collapse in={opened}>
        <Button
          component='a'
          href='/setting'
          variant='subtle'
          leftSection={<IconSettings />}
          fullWidth
        >
          Setting
        </Button>
      </Collapse>
    </>
  );
}

function MobileNavbar() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const logoutPromise = usePromise({
    promiseFn: logout,

    onSuccess() {
      navigate('/');
      navigate(0);
    },
  });

  return (
    <Stack>
      {auth.isLoggedIn ? (
        <Stack>
          <MobileProfileMenu />
          <Button
            color='red'
            variant='subtle'
            leftSection={<IconLogout />}
            onClick={logoutPromise.call}
            loading={logoutPromise.isLoading}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <Stack>
          <Button variant='subtle' component='a' href='/login'>
            Login
          </Button>
          <Button variant='subtle' component='a' href='/register'>
            Register
          </Button>
        </Stack>
      )}
      <MobileMiddleBar />
    </Stack>
  );
}

export default MobileNavbar;
