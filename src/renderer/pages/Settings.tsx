import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import Apprearance from './Settings/Apprearance';
import Address from './Settings/Address';
import Locale from './Settings/Locale';
import Application from './Settings/Application';
import About from './Settings/About';
import DialogAddressAdder from './Settings/DialogAddressAdder';
import DialogAddressRemover from './Settings/DialogAddressRemover';
import useWindow from '../utils/useWindow';

const Settings: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { zoomWindowForDarwin } = useWindow();

  return (
    <Box>
      <Box sx={{ height: theme.spacing(5), appRegion: 'drag' }} onDoubleClick={() => zoomWindowForDarwin()} />
      <Stack sx={{ pl: theme.spacing(2) }}>
        <Typography variant="h4" fontWeight={600} color={theme.palette.text.primary} sx={{ mb: theme.spacing(2) }}>
          {t('settings.settings')}
        </Typography>
        <Apprearance />
        <Address />
        <Locale />
        <Application />
        <About />
      </Stack>

      <DialogAddressAdder />
      <DialogAddressRemover />
    </Box>
  );
};

export default Settings;
