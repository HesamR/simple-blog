import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Group,
  Menu,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {
  IconArticle,
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

    onError() {
      navigate(0);
    },

    onSuccess() {
      navigate('/');
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
        <Menu.Item
          component={Link}
          to='/setting'
          leftSection={<IconSettings />}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          component={Link}
          to='/my-articles'
          leftSection={<IconArticle />}
        >
          My Articles
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
            component={Link}
            to='/create-article'
            leftSection={<IconPlus />}
          >
            Create
          </Button>
          <DesktopProfileMenu />
        </>
      ) : (
        <>
          <Button component={Link} variant='subtle' to='/login'>
            Login
          </Button>
          <Button component={Link} variant='outline' to='/register'>
            Register
          </Button>
        </>
      )}
    </Group>
  );
}

function HeaderTitle() {
  return (
    <UnstyledButton component={Link} to='/'>
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
