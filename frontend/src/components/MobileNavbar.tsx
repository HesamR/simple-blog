import { Avatar, Button, Collapse, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArticle,
  IconChevronDown,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import usePromise from '../hooks/usePromise';
import { logout } from '../api/api';
import { useNavigate } from 'react-router-dom';

function MobileProfileMenu() {
  const [opened, { toggle }] = useDisclosure();

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
    <>
      <Button
        leftSection={<Avatar />}
        rightSection={<IconChevronDown />}
        variant='gradient'
        radius='xs'
        size='md'
        onClick={toggle}
      >
        {auth.user?.name}
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
        <Button
          component='a'
          href='/my-articles'
          variant='subtle'
          leftSection={<IconArticle />}
          fullWidth
        >
          My Articles
        </Button>
        <Button
          color='red'
          variant='subtle'
          leftSection={<IconLogout />}
          onClick={logoutPromise.call}
          loading={logoutPromise.isLoading}
          fullWidth
        >
          Logout
        </Button>
      </Collapse>
    </>
  );
}

function MobileNavbar() {
  const auth = useContext(AuthContext);

  return (
    <>
      {auth.isLoggedIn ? (
        <MobileProfileMenu />
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
    </>
  );
}

export default MobileNavbar;
