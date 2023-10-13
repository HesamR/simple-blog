import {
  Avatar,
  Button,
  Group,
  Menu,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronDown, IconLogout, IconSettings } from '@tabler/icons-react';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import { logout } from '../api/api';
import usePromise from '../hooks/usePromise';
import { useNavigate } from 'react-router-dom';

function DesktopProfileMenu() {
  const auth = useContext(AuthContext);

  return (
    <Menu>
      <Menu.Target>
        <Button
          variant='gradient'
          rightSection={<IconChevronDown />}
          leftSection={<Avatar />}
        >
          {auth.user?.email}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component='a' href='/setting' leftSection={<IconSettings />}>
          Settings
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function DesktopRightBar() {
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
    <Group ml='xl' visibleFrom='sm'>
      {auth.isLoggedIn ? (
        <>
          <DesktopProfileMenu />
          <Button
            variant='outline'
            color='red'
            rightSection={<IconLogout />}
            onClick={logoutPromise.call}
            loading={logoutPromise.isLoading}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button component='a' variant='subtle' href='/login'>
            Login
          </Button>
          <Button component='a' variant='outline' href='/register'>
            Register
          </Button>
        </>
      )}
    </Group>
  );
}

function HeaderTitle() {
  return (
    <UnstyledButton component='a' href='/'>
      <Title order={4}>Blog</Title>
    </UnstyledButton>
  );
}

function DesktopMiddleBar() {
  return (
    <Group visibleFrom='sm'>
      <Button component='a' href='/users' variant='subtle' size='compact-lg'>
        Users
      </Button>
      <Button component='a' href='/articles' variant='subtle' size='compact-lg'>
        Articles
      </Button>
    </Group>
  );
}

function DesktopNavbar() {
  return (
    <Group justify='space-between' style={{ flex: 1 }}>
      <HeaderTitle />
      <DesktopMiddleBar />
      <DesktopRightBar />
    </Group>
  );
}

export default DesktopNavbar;
