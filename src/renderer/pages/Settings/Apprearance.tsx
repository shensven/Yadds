import React from 'react';
import { useAtom } from 'jotai';
import { Box, FormGroup, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RowItem from './RowItem';
import { atomOS } from '../../atoms/atomConstant';
import darwinLight from '../assets/Settings/darwin_light.png';
import darwinDark from '../assets/Settings/darwin_dark.png';
import darwinFollowSystem from '../assets/Settings/darwin_follow_system.png';
import win32Light from '../assets/Settings/win32_light.png';
import win32Dark from '../assets/Settings/win32_dark.png';
import win32FollowSystem from '../assets/Settings/win32_follow_system.png';
import gnomeLight from '../assets/Settings/gnome_light.png';
import gnomeDark from '../assets/Settings/gnome_dark.png';
import gnomeFollowSystem from '../assets/Settings/gnome_follow_system.png';
import { Appearance, atomPersistenceAppearance } from '../../atoms/atomUI';

interface IProps {
  appearance: 'light' | 'dark' | 'system';
  os: 'darwin' | 'win32' | 'linux';
}

const ApprearanceItem: React.FC<IProps> = (props) => {
  const { appearance, os } = props;

  if (os === 'darwin') {
    switch (appearance) {
      case 'light':
        return <img src={darwinLight} alt="" draggable="false" width={67} height={44} />;
      case 'dark':
        return <img src={darwinDark} alt="" draggable="false" width={67} height={44} />;
      case 'system':
        return <img src={darwinFollowSystem} alt="" draggable="false" width={67} height={44} />;
      default:
        return <img src={darwinLight} alt="" draggable="false" width={67} height={44} />;
    }
  } else if (os === 'win32') {
    switch (appearance) {
      case 'light':
        return <img src={win32Light} alt="" draggable="false" width={67} height={44} />;
      case 'dark':
        return <img src={win32Dark} alt="" draggable="false" width={67} height={44} />;
      case 'system':
        return <img src={win32FollowSystem} alt="" draggable="false" width={67} height={44} />;
      default:
        return <img src={win32Light} alt="" draggable="false" width={67} height={44} />;
    }
  } else {
    switch (appearance) {
      case 'light':
        return <img src={gnomeLight} alt="" draggable="false" width={67} height={44} />;
      case 'dark':
        return <img src={gnomeDark} alt="" draggable="false" width={67} height={44} />;
      case 'system':
        return <img src={gnomeFollowSystem} alt="" draggable="false" width={67} height={44} />;
      default:
        return <img src={gnomeLight} alt="" draggable="false" width={67} height={44} />;
    }
  }
};

interface YaddsAppearance {
  appearance: Appearance;
  label: string;
}

const Apprearance: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [OS_PLATFORM] = useAtom(atomOS);
  const [appearance, setAppearance] = useAtom(atomPersistenceAppearance);

  const appearanceList: YaddsAppearance[] = [
    { appearance: 'light', label: t('settings.light') },
    { appearance: 'dark', label: t('settings.dark') },
    { appearance: 'system', label: t('settings.follow_system') },
  ];

  return (
    <RowItem label={t('settings.appearance')}>
      <FormGroup row>
        {appearanceList.map((item) => (
          <Stack key={item.label} alignItems="center" mr={theme.spacing(2)}>
            <Box
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                filter: appearance === item.appearance ? 'grayscale(0)' : 'grayscale(100%) opacity(0.75)',
                height: 44,
                width: 67,
                '&:hover': {
                  filter: appearance === item.appearance ? 'grayscale(0)' : 'grayscale(25%) opacity(1)',
                },
              }}
              onClick={() => setAppearance(item.appearance)}
            >
              <ApprearanceItem appearance={item.appearance} os={OS_PLATFORM} />
            </Box>
            <Typography
              variant="overline"
              color={appearance === item.appearance ? theme.palette.text.secondary : theme.palette.text.disabled}
            >
              {item.label}
            </Typography>
          </Stack>
        ))}
      </FormGroup>
    </RowItem>
  );
};

export default Apprearance;