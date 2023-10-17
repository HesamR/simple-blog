import { Avatar, Button, Collapse, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArticle,
  IconChevronDown,
  IconLogout,
  IconPlus,
  IconSettings,
} from '@tabler/icons-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import usePromise from '../hooks/usePromise';
import { logout } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

interface Props {
  onClick: () => void;
}

function MobileProfileMenu({ onClick }: Props) {
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
          onClick={onClick}
          component={Link}
          to='/setting'
          variant='subtle'
          leftSection={<IconSettings />}
          fullWidth
        >
          Setting
        </Button>
        <Button
          onClick={onClick}
          component={Link}
          to='/my-articles'
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
      <Button
        mt='sm'
        onClick={onClick}
        variant='subtle'
        component={Link}
        to='/create-article'
        fullWidth
        leftSection={<IconPlus />}
      >
        Create Article
      </Button>
    </>
  );
}

function MobileNavbar({ onClick }: Props) {
  const auth = useContext(AuthContext);

  return (
    <>
      {auth.isLoggedIn ? (
        <MobileProfileMenu onClick={onClick} />
      ) : (
        <Stack>
          <Button
            variant='subtle'
            onClick={onClick}
            component={Link}
            to='/login'
          >
            Login
          </Button>
          <Button
            variant='subtle'
            onClick={onClick}
            component={Link}
            to='/register'
          >
            Register
          </Button>
        </Stack>
      )}
    </>
  );
}

export default MobileNavbar;
