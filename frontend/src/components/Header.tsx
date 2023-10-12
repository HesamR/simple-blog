import { useContext } from 'react';
import {
  AppShell,
  Burger,
  Group,
  Button,
  Menu,
  UnstyledButton,
  Title,
  Collapse,
  Avatar,
} from '@mantine/core';
import { IconChevronDown, IconSettings, IconLogout } from '@tabler/icons-react';

import usePromise from '../hooks/usePromise';
import AuthContext from '../context/AuthContext';
import { logout, setAccessToken } from '../api/api';
import { useDisclosure } from '@mantine/hooks';

interface Props {
  opened: boolean;
  toggle: () => void;
}

function Header({ opened, toggle }: Props) {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(AuthContext);

  const logoutPromise = usePromise({
    promiseFn: logout,

    onSuccess() {
      setAccessToken(null);
      setIsLoggedIn(false);
    },
  });

  const DesktopMiddleBar = () => {
    return (
      <Group visibleFrom='sm'>
        <Button component='a' href='/users' variant='subtle' size='compact-lg'>
          Users
        </Button>
        <Button
          component='a'
          href='/articles'
          variant='subtle'
          size='compact-lg'
        >
          Articles
        </Button>
      </Group>
    );
  };

  const DesktopProfileMenu = () => {
    return (
      <Menu>
        <Menu.Target>
          <Button
            variant='gradient'
            rightSection={<IconChevronDown />}
            leftSection={<Avatar />}
          >
            {user.email}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            component='a'
            href='/setting'
            leftSection={<IconSettings />}
          >
            Settings
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const DesktopNavBar = () => {
    return (
      <Group ml='xl' visibleFrom='sm'>
        {isLoggedIn ? (
          <>
            <DesktopProfileMenu />
            <Button
              variant='outline'
              color='red'
              rightSection={<IconLogout />}
              onClick={logoutPromise.call}
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
  };

  const MobileMiddleBar = () => {
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
  };

  const MobileProfileMenu = () => {
    const [opened, { toggle }] = useDisclosure();
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
          {user.email}
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
  };

  const MobileNavbar = () => {
    return (
      <AppShell.Navbar>
        {isLoggedIn ? (
          <>
            <MobileProfileMenu />
            <Button
              color='red'
              variant='subtle'
              leftSection={<IconLogout />}
              onClick={logoutPromise.call}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant='subtle' component='a' href='/login'>
              Login
            </Button>
            <Button variant='subtle' component='a' href='/register'>
              Register
            </Button>
          </>
        )}
        <MobileMiddleBar />
      </AppShell.Navbar>
    );
  };

  const HeaderTitle = () => {
    return (
      <UnstyledButton component='a' href='/'>
        <image href='/vite.svg' />
        <Title order={4}>Blog</Title>
      </UnstyledButton>
    );
  };

  return (
    <AppShell.Header>
      <Group h='100%' px='md'>
        <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
        <Group justify='space-between' style={{ flex: 1 }}>
          <HeaderTitle />
          <DesktopMiddleBar />
          <DesktopNavBar />
        </Group>
      </Group>
      <MobileNavbar />
    </AppShell.Header>
  );
}

export default Header;
