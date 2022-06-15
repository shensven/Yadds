import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import byteSize from 'byte-size';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import CardUnit from './Server/CardUnit';
import IcRoundCalendarViewWeek from '../components/icons/IcRoundCalendarViewWeek';
import IcOutlineInfo from '../components/icons/IcOutlineInfo';
import IcOutlineAlbum from '../components/icons/IcOutlineAlbum';
import IcOutlineExplore from '../components/icons/IcOutlineExplore';
import IcOutlineCable from '../components/icons/IcOutlineCable';
import IcRoundSwapHoriz from '../components/icons/IcRoundSwapHoriz';
import { atomOS } from '../atoms/atomConstant';
import {
  atomNasInfo,
  atomPersistenceServerActiveTab,
  atomPersistenceTargeMenuItemForQuota,
  atomQuotaList,
  atomTargeByteSizeForQuota,
  Share,
} from '../atoms/atomUI';
import createMenuItemConstructorOptionsForQuota from '../utils/createMenuItemConstructorOptionsForQuota';
import useNasInfo from '../utils/useNasInfo';
import useQuota from '../utils/useQuota';

const Server: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [OS_PLATFORM] = useAtom(atomOS);
  const [serverActiveTab, setServerActiveTab] = useAtom(atomPersistenceServerActiveTab);
  const [nasInfo] = useAtom(atomNasInfo);
  const [quotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota, setTargeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);
  const [targeByteSizeForQuota, setTargeByteSizeForQuota] = useAtom(atomTargeByteSizeForQuota);

  const { getNasInfo } = useNasInfo();
  const { getQuota } = useQuota();

  const basicInfomation = [
    {
      title: t('server.synology_nas'),
      value: nasInfo.model,
      unit: '',
      icon: <IcRoundCalendarViewWeek sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.dsm_version'),
      value: nasInfo.version,
      unit: '',
      icon: <IcOutlineInfo sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.quota'),
      value: targeByteSizeForQuota.max.value,
      unit: targeByteSizeForQuota.max.unit,
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
      onClick: () => {
        const template = createMenuItemConstructorOptionsForQuota(t, quotaList, targeMenuItemForQuota);
        window.electron.contextMenuForQuota.create(template);
      },
    },
    {
      title: t('server.available_capacity'),
      value: targeByteSizeForQuota.available.value,
      unit: targeByteSizeForQuota.available.unit,
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
    },
  ];
  const route = [
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
  const responsiveness = [
    {
      title: 'DS920+',
      value: '32',
      unit: 'ms',
      icon: <IcRoundSwapHoriz sx={{ fontSize: 20 }} />,
    },
  ];

  const refreshBasicInfomation = () => {
    getNasInfo();
    getQuota();
  };

  useEffect(() => {
    window.electron.contextMenuForQuota.setTargetItem(setTargeMenuItemForQuota); // send setPageServerQuotaTarge as a Closure to main process
    getNasInfo();
    getQuota();
  }, []);

  useEffect(() => {
    const targetVolume = find(quotaList, {
      name: targeMenuItemForQuota.split(',')[0].split(':')[1].toString(),
    });

    if (targetVolume !== undefined) {
      const targetQuota = find(targetVolume.children, {
        name: targeMenuItemForQuota.split(',')[1],
      }) as Share | undefined;

      console.log('targetQuota', targetQuota);

      if (targetQuota) {
        setTargeByteSizeForQuota({
          max: byteSize(targetQuota.share_quota * 1024 * 1024, { units: 'iec', precision: 2 }),
          available: byteSize((targetQuota.share_quota - targetQuota.share_used) * 1024 * 1024, {
            units: 'iec',
            precision: 2,
          }),
        });
      }
    }
  }, [targeMenuItemForQuota]);

  return (
    <Box>
      <Box
        sx={{ height: theme.spacing(5), appRegion: 'drag' }}
        onDoubleClick={() => OS_PLATFORM === 'darwin' && window.electron.app.zoomWindow()}
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
              selected={serverActiveTab === 'basicInfomation'}
              sx={{ px: theme.spacing(2), py: 0 }}
              onClick={() => setServerActiveTab('basicInfomation')}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.basic_information')}
              </Typography>
            </ToggleButton>
            <ToggleButton
              value="left"
              disableRipple
              selected={serverActiveTab === 'route'}
              sx={{ px: theme.spacing(2), py: 0 }}
              onClick={() => setServerActiveTab('route')}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.route')}
              </Typography>
            </ToggleButton>
            <ToggleButton
              value="right"
              disableRipple
              selected={serverActiveTab === 'responsiveness'}
              sx={{ px: theme.spacing(2), py: 0 }}
              onClick={() => setServerActiveTab('responsiveness')}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.responsiveness')}
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <Stack flexDirection="row">
            {serverActiveTab === 'basicInfomation' && (
              <Button
                size="small"
                sx={{
                  backgroundColor: theme.palette.input.default,
                  '&:hover': { backgroundColor: theme.palette.input.hover },
                  ml: theme.spacing(1),
                }}
                onClick={() => refreshBasicInfomation()}
              >
                <Typography fontSize={12} fontWeight={500} sx={{ lineHeight: 'normal', px: theme.spacing(0.5) }}>
                  {t('server.refresh')}
                </Typography>
              </Button>
            )}
            {serverActiveTab === 'route' && (
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
            {serverActiveTab === 'responsiveness' && (
              <Button
                size="small"
                sx={{
                  backgroundColor: theme.palette.input.default,
                  '&:hover': { backgroundColor: theme.palette.input.hover },
                  ml: theme.spacing(1),
                }}
              >
                <Typography fontSize={12} fontWeight={500} sx={{ lineHeight: 'normal', px: theme.spacing(0.5) }}>
                  {t('server.ping')}
                </Typography>
              </Button>
            )}
          </Stack>
        </Stack>
        {serverActiveTab === 'basicInfomation' && (
          <Stack flexDirection="row" mt={theme.spacing(4)} width="100%">
            {basicInfomation.map((item, index) => (
              <CardUnit
                hasIconButton={index === 2}
                hasMarginRight={basicInfomation.length - 1 !== index}
                title={item.title}
                value={item.value}
                unit={item.unit}
                icon={item.icon}
                key={item.title}
                onClick={item.onClick}
              />
            ))}
          </Stack>
        )}
        {serverActiveTab === 'route' && (
          <Stack flexDirection="column" mt={theme.spacing(4)} width="100%">
            {route.map((item) => (
              <CardUnit
                hasIconButton={false}
                hasMarginRight={false}
                title={item.title}
                value={item.value}
                icon={item.icon}
                key={item.title}
              />
            ))}
          </Stack>
        )}
        {serverActiveTab === 'responsiveness' && (
          <Stack flexDirection="row" mt={theme.spacing(4)} width="100%">
            {responsiveness.map((item, index) => (
              <CardUnit
                hasIconButton={false}
                hasMarginRight={responsiveness.length - 1 === index}
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
