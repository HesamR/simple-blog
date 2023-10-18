import { Box, Card, Tabs } from '@mantine/core';
import { IconKey, IconMail, IconUserCircle } from '@tabler/icons-react';

import SettingEmailPanel from '../components/SettingEmailPanel';
import SettingChangePasswordPanel from '../components/SettingChangePasswordPanel';
import SettingEditProfilePanel from '../components/SettingEditProfilePanel';

function SettingPage() {
  return (
    <Box maw={500} mx='auto'>
      <Card shadow='lg' radius='lg'>
        <Tabs defaultValue='email'>
          <Tabs.List>
            <Tabs.Tab value='email' leftSection={<IconMail size={20} />}>
              Email
            </Tabs.Tab>
            <Tabs.Tab value='password' leftSection={<IconKey size={20} />}>
              Change Password
            </Tabs.Tab>
            <Tabs.Tab
              value='profile'
              leftSection={<IconUserCircle size={20} />}
            >
              Edit Profile
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='email'>
            <SettingEmailPanel />
          </Tabs.Panel>
          <Tabs.Panel value='password'>
            <SettingChangePasswordPanel />
          </Tabs.Panel>
          <Tabs.Panel value='profile'>
            <SettingEditProfilePanel />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Box>
  );
}

export default SettingPage;
