import React from 'react';
import { useAtom } from 'jotai';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { atomAppVersion } from '@/renderer/atoms/atomConstant';
import { atomPersistenceIsAutoLaunch, atomPersistenceIsAutoUpdate } from '@/renderer/atoms/atomUI';
import RowItem from './RowItem';

const Application: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [isAutoLaunch, setIsAutoLaunch] = useAtom(atomPersistenceIsAutoLaunch);
  const [isAutoUpdate, setIsAutoUpdate] = useAtom(atomPersistenceIsAutoUpdate);
  const [APP_VERSION] = useAtom(atomAppVersion);

  return (
    <RowItem label={t('preferences.application')}>
      <FormGroup>
        <FormControlLabel
          checked={isAutoLaunch}
          label={<Typography variant="subtitle2">{t('preferences.launch_yadds_at_login')}</Typography>}
          control={<Checkbox size="small" checked={isAutoLaunch} />}
          onClick={() => setIsAutoLaunch(!isAutoLaunch)}
        />
        <FormControlLabel
          checked={isAutoUpdate}
          label={<Typography variant="subtitle2">{t('preferences.automaticly_check_for_updates')}</Typography>}
          control={<Checkbox size="small" checked={isAutoUpdate} />}
          onClick={() => setIsAutoUpdate(!isAutoUpdate)}
        />
        <Stack flexDirection="row" alignItems="center">
          <FormHelperText>{`${t('preferences.current_version')} ${APP_VERSION}`}</FormHelperText>
          <Button
            size="small"
            sx={{
              ml: theme.spacing(1),
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
            }}
            onClick={() => {}}
          >
            <Typography fontSize={12} fontWeight={500} sx={{ px: theme.spacing(0.5) }}>
              {t('preferences.check_now')}
            </Typography>
          </Button>
        </Stack>
      </FormGroup>
    </RowItem>
  );
};

export default Application;
