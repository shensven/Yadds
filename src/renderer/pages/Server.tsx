import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IcRoundCalendarViewWeek from '../components/icons/IcRoundCalendarViewWeek';
import IcOutlineInfo from '../components/icons/IcOutlineInfo';
import IcOutlineAlbum from '../components/icons/IcOutlineAlbum';

const OS_PLATFORM = window.electron?.getOS();

interface CardUnitProps {
  icon: JSX.Element;
  title: string;
  value: string;
  unit?: string;
}

const CardUnit: React.FC<CardUnitProps> = (props: CardUnitProps) => {
  const { icon, title, value, unit } = props;
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: theme.palette.card.default,
        mr: theme.spacing(2),
        p: theme.spacing(1),
        minWidth: theme.spacing(19),
      }}
    >
      <Stack flexDirection="row" alignItems="center">
        <Icon color="primary">{icon}</Icon>
        <Typography noWrap variant="subtitle2" color={theme.palette.primary.main}>
          {title}
        </Typography>
      </Stack>
      <Stack flexDirection="row" alignItems="baseline">
        <Typography noWrap fontSize={20} fontWeight={700} pl={theme.spacing(0.5)}>
          {value}
        </Typography>
        <Typography fontSize={12} fontWeight={500} pl={theme.spacing(0.5)}>
          {unit}
        </Typography>
      </Stack>
    </Card>
  );
};

CardUnit.defaultProps = {
  unit: '',
};

const Server: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [select, setSelect] = useState(0);

  const baseInfo = [
    {
      title: t('server.synology_nas'),
      value: 'DS920+',
      unit: '',
      icon: <IcRoundCalendarViewWeek sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.dsm_version'),
      value: '7.1-42661',
      unit: '',
      icon: <IcOutlineInfo sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.quota'),
      value: '256.00',
      unit: 'GB',
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.available_capacity'),
      value: '133.02',
      unit: 'GB',
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
    },
  ];

  return (
    <Box>
      <Box
        sx={{ height: theme.spacing(5), appRegion: 'drag' }}
        onDoubleClick={() => OS_PLATFORM === 'darwin' && window.electron.zoomWindow()}
      />
      <Stack sx={{ pl: theme.spacing(2) }}>
        <Typography variant="h4" fontWeight={600} color={theme.palette.text.primary} sx={{ mb: theme.spacing(2) }}>
          {t('server.server')}
        </Typography>
        <Stack flexDirection="row" justifyContent="space-between">
          <ToggleButtonGroup size="small">
            <ToggleButton
              value="left"
              disableRipple
              selected={select === 0}
              sx={{ px: theme.spacing(2), py: 0 }}
              onClick={() => setSelect(0)}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.basic_information')}
              </Typography>
            </ToggleButton>
            <ToggleButton
              value="left"
              disableRipple
              selected={select === 1}
              sx={{ px: theme.spacing(2), py: 0 }}
              onClick={() => setSelect(1)}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.responsiveness')}
              </Typography>
            </ToggleButton>
            <ToggleButton
              value="right"
              disableRipple
              selected={select === 2}
              sx={{ px: theme.spacing(2), py: 0 }}
              onClick={() => setSelect(2)}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.interface')}
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <Stack flexDirection="row">
            <Button
              size="small"
              sx={{
                backgroundColor: theme.palette.input.default,
                '&:hover': { backgroundColor: theme.palette.input.hover },
                mr: theme.spacing(1),
              }}
            >
              <Typography fontSize={12} fontWeight={500} sx={{ lineHeight: 'normal', px: theme.spacing(0.5) }}>
                {t('server.refresh')}
              </Typography>
            </Button>
            <Button
              size="small"
              sx={{
                backgroundColor: theme.palette.input.default,
                '&:hover': { backgroundColor: theme.palette.input.hover },
              }}
            >
              <Typography fontSize={12} fontWeight={500} sx={{ lineHeight: 'normal', px: theme.spacing(0.5) }}>
                {t('server.network_diagnosis')}
              </Typography>
            </Button>
          </Stack>
        </Stack>
        <Stack flexDirection="row" mt={theme.spacing(4)} width="100%">
          {baseInfo.map((item) => (
            <CardUnit title={item.title} value={item.value} unit={item.unit} icon={item.icon} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Server;
