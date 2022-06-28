import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import Apprearance from './Preferences/Apprearance';
import Address from './Preferences/Address';
import Locale from './Preferences/Locale';
import Application from './Preferences/Application';
import About from './Preferences/About';
import DialogAddressAdder from './Preferences/DialogAddressAdder';
import DialogAddressRemover from './Preferences/DialogAddressRemover';
import useWindow from '../utils/useWindow';

const Preferences: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { zoomWindowForDarwin } = useWindow();

  return (
    <Box>
      <Box sx={{ height: theme.spacing(5), appRegion: 'drag' }} onDoubleClick={() => zoomWindowForDarwin()} />
      <Stack sx={{ pl: theme.spacing(2) }}>
        <Typography variant="h4" fontWeight={600} color={theme.palette.text.primary} sx={{ mb: theme.spacing(2) }}>
          {t('preferences.preferences')}
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

export default Preferences;
