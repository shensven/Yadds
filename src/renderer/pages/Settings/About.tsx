import React from 'react';
import { FormGroup, FormHelperText, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RowItem from './RowItem';
import IonLogoTwitter from '../../components/icons/IonLogoTwitter';
import IonLogoGithub from '../../components/icons/IonLogoGithub';

const About: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <RowItem label={t('settings.about')} hasMargin={false}>
      <FormGroup>
        <Stack flexDirection="row">
          <Typography variant="subtitle2">{t('settings.license')}</Typography>
          <Typography
            variant="subtitle2"
            color={theme.palette.primary.main}
            sx={{
              ml: theme.spacing(1),
              '&:hover': { opacity: 0.5 },
            }}
            onClick={() => window.electron.app.openURL('https://github.com/shensven/Yadds/blob/main/LICENSE')}
          >
            {t('settings.this_copy_is_licensed_under_GPL_3_0')}
          </Typography>
        </Stack>
        <Stack flexDirection="row" alignItems="center" mt={theme.spacing(1)}>
          <Typography variant="subtitle2">{t('settings.devoloper')}</Typography>
          <Typography variant="subtitle2" color={theme.palette.text.secondary} sx={{ ml: theme.spacing(1) }}>
            @SvenFE
          </Typography>
          <IonLogoTwitter
            sx={{
              fontSize: 17,
              color: theme.palette.text.disabled,
              ml: theme.spacing(1),
              '&:hover': { color: '#1DA1F2' },
            }}
            onClick={() => window.electron.app.openURL('https://twitter.com/shensven2016')}
          />
          <IonLogoGithub
            sx={{
              fontSize: 17,
              color: theme.palette.text.disabled,
              ml: theme.spacing(1),
              '&:hover': { color: '#333333' },
            }}
            onClick={() => window.electron.app.openURL('https://github.com/shensven')}
          />
        </Stack>
        <FormHelperText>Made with ❤️ in Kunming</FormHelperText>
      </FormGroup>
    </RowItem>
  );
};

export default About;
