import {
  Avatar,
  Button,
  Group,
  Menu,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  IconPlus,
  IconSettings,
} from '@tabler/icons-react';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import { logout } from '../api/api';
import usePromise from '../hooks/usePromise';
import { useNavigate } from 'react-router-dom';

function DesktopProfileMenu() {
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
    <Menu>
      <Menu.Target>
        <Button
          variant='gradient'
          rightSection={<IconChevronDown />}
          leftSection={<Avatar />}
        >
          {auth.user?.name}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component='a' href='/setting' leftSection={<IconSettings />}>
          Settings
        </Menu.Item>
        <Menu.Item
          color='red'
          onClick={logoutPromise.call}
          leftSection={<IconLogout />}
          disabled={logoutPromise.isLoading}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function DesktopRightBar() {
  const auth = useContext(AuthContext);

  return (
    <Group ml='xl' visibleFrom='sm'>
      {auth.isLoggedIn ? (
        <>
          <Button
            variant='outline'
            component='a'
            href='/create-article'
            leftSection={<IconPlus />}
          >
            Create
          </Button>
          <DesktopProfileMenu />
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

function DesktopNavbar() {
  return (
    <Group justify='space-between' style={{ flex: 1 }}>
      <HeaderTitle />
      <DesktopRightBar />
    </Group>
  );
}

export default DesktopNavbar;
