import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
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
import IcOutlineExplore from '../components/icons/IcOutlineExplore';
import IcOutlineCable from '../components/icons/IcOutlineCable';
import IcRoundSwapHoriz from '../components/icons/IcRoundSwapHoriz';
import {
  dsmConnectIndexAtomWithPersistence,
  dsmConnectListAtomWithPersistence,
  dsmInfoAtom,
} from '../atoms/yaddsAtoms';

const OS_PLATFORM = window.electron?.getOS();

interface CardUnitProps {
  hasMarginRight: boolean;
  icon: JSX.Element;
  title: string;
  value: string;
  unit?: string;
}

const CardUnit: React.FC<CardUnitProps> = (props: CardUnitProps) => {
  const { hasMarginRight, icon, title, value, unit } = props;
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: theme.palette.card.default,
        mr: hasMarginRight ? 0 : theme.spacing(2),
        py: theme.spacing(1),
        pl: theme.spacing(1),
        pr: theme.spacing(2),
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

  const [dsmConnectList] = useAtom(dsmConnectListAtomWithPersistence);
  const [dsmConnectIndex] = useAtom(dsmConnectIndexAtomWithPersistence);
  const [dsmInfo, setDsmInfo] = useAtom(dsmInfoAtom);

  const [select, setSelect] = useState(0);

  const serverBaseInfo = [
    {
      title: t('server.synology_nas'),
      value: dsmInfo.model,
      unit: '',
      icon: <IcRoundCalendarViewWeek sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.dsm_version'),
      value: dsmInfo.version,
      unit: '',
      icon: <IcOutlineInfo sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.quota'),
      value: '0',
      unit: 'GB',
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.available_capacity'),
      value: '0',
      unit: 'GB',
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
    },
  ];
  const serverRoute = [
    {
      title: t('server.quickconnect_coordinator'),
      value: 'global.quickconnect.to',
      icon: <IcOutlineExplore sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.host_address'),
      value: 'your-nas.cn3.quickconnect.cn',
      icon: <IcOutlineCable sx={{ fontSize: 20 }} />,
    },
  ];
  const serverResponsiveness = [
    {
      title: 'DS920+',
      value: '32',
      unit: 'ms',
      icon: <IcRoundSwapHoriz sx={{ fontSize: 20 }} />,
    },
  ];

  const getDsmInfo = async () => {
    const resp = await window.electron.net.getDsmInfo({
      host: dsmConnectList[dsmConnectIndex]?.host,
      port: dsmConnectList[dsmConnectIndex]?.port,
      sid: dsmConnectList[dsmConnectIndex]?.sid,
    });

    if (!resp.success) {
      setDsmInfo({
        model: '-',
        version: '-',
      });
    }

    if (resp.success) {
      const version = resp.data?.version_string.split(' ')[1] as string;
      setDsmInfo({
        model: resp.data?.model as string,
        version,
      });
    }
  };

  useEffect(() => {
    getDsmInfo();
  }, []);

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
                {t('server.route')}
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
                {t('server.responsiveness')}
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <Stack flexDirection="row">
            {select === 0 && (
              <Button
                size="small"
                sx={{
                  backgroundColor: theme.palette.input.default,
                  '&:hover': { backgroundColor: theme.palette.input.hover },
                  ml: theme.spacing(1),
                }}
                onClick={() => getDsmInfo()}
              >
                <Typography fontSize={12} fontWeight={500} sx={{ lineHeight: 'normal', px: theme.spacing(0.5) }}>
                  {t('server.refresh')}
                </Typography>
              </Button>
            )}
            {select === 1 && (
              <Button
                size="small"
                sx={{
                  backgroundColor: theme.palette.input.default,
                  '&:hover': { backgroundColor: theme.palette.input.hover },
                  ml: theme.spacing(1),
                }}
              >
                <Typography fontSize={12} fontWeight={500} sx={{ lineHeight: 'normal', px: theme.spacing(0.5) }}>
                  {t('server.network_diagnosis')}
                </Typography>
              </Button>
            )}
            {select === 2 && (
              <Button
                size="small"
                sx={{
                  backgroundColor: theme.palette.input.default,
                  '&:hover': { backgroundColor: theme.palette.input.hover },
                  ml: theme.spacing(1),
                }}
              >
                <Typography fontSize={12} fontWeight={500} sx={{ lineHeight: 'normal', px: theme.spacing(0.5) }}>
                  {t('server.ping_test')}
                </Typography>
              </Button>
            )}
          </Stack>
        </Stack>
        {select === 0 && (
          <Stack flexDirection="row" mt={theme.spacing(4)} width="100%">
            {serverBaseInfo.map((item, index) => (
              <CardUnit
                hasMarginRight={serverBaseInfo.length - 1 === index}
                title={item.title}
                value={item.value}
                unit={item.unit}
                icon={item.icon}
                key={item.title}
              />
            ))}
          </Stack>
        )}
        {select === 1 && (
          <Stack flexDirection="row" mt={theme.spacing(4)} width="100%">
            {serverRoute.map((item, index) => (
              <CardUnit
                hasMarginRight={serverRoute.length - 1 === index}
                title={item.title}
                value={item.value}
                icon={item.icon}
                key={item.title}
              />
            ))}
          </Stack>
        )}
        {select === 2 && (
          <Stack flexDirection="row" mt={theme.spacing(4)} width="100%">
            {serverResponsiveness.map((item, index) => (
              <CardUnit
                hasMarginRight={serverResponsiveness.length - 1 === index}
                title={item.title}
                value={item.value}
                unit={item.unit}
                icon={item.icon}
                key={item.title}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Server;
