import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AuthContext from '../context/AuthContext';
import { logout } from '../api/api';

function DesktopProfileMenu() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,

    onSuccess() {
      navigate('/');

      queryClient.invalidateQueries({ queryKey: ['current-user'] });
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
          {user?.name}
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
          onClick={() => mutate()}
          leftSection={<IconLogout />}
          disabled={isPending}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function DesktopRightBar() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Group ml='xl' visibleFrom='sm'>
      {isLoggedIn ? (
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
