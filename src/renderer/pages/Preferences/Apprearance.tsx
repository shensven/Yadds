import React from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Box, FormGroup, Stack, Typography, useTheme } from '@mui/material';
import { atomOS } from '@/renderer/atoms/atomConstant';
import darwinLight from '@/renderer/assets/images/darwin_light.png';
import darwinDark from '@/renderer/assets/images/darwin_dark.png';
import darwinFollowSystem from '@/renderer/assets/images/darwin_follow_system.png';
import win32Light from '@/renderer/assets/images/win32_light.png';
import win32Dark from '@/renderer/assets/images/win32_dark.png';
import win32FollowSystem from '@/renderer/assets/images/win32_follow_system.png';
import gnomeLight from '@/renderer/assets/images/gnome_light.png';
import gnomeDark from '@/renderer/assets/images/gnome_dark.png';
import gnomeFollowSystem from '@/renderer/assets/images/gnome_follow_system.png';
import { Appearance, atomPersistenceAppearance } from '@/renderer/atoms/atomUI';
import RowItem from './RowItem';

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
    { appearance: 'light', label: t('preferences.light') },
    { appearance: 'dark', label: t('preferences.dark') },
    { appearance: 'system', label: t('preferences.follow_system') },
  ];

  return (
    <RowItem label={t('preferences.appearance')}>
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
