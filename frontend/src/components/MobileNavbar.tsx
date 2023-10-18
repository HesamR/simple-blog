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
import { logout } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  onClick: () => void;
}

function MobileProfileMenu({ onClick }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  const [opened, { toggle }] = useDisclosure();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,

    onSuccess() {
      navigate('/');

      queryClient.invalidateQueries({ queryKey: ['current-user'] });
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
        {user?.name}
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
          onClick={() => mutate()}
          loading={isPending}
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
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      {isLoggedIn ? (
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
