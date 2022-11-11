import React from 'react';
import { useUpdateEffect } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme } from '@mui/material';
import FluentVirtualNetwork20Filled from '@/renderer/assets/icons/FluentVirtualNetwork20Filled';
import EosIconsThreeDotsLoading from '@/renderer/assets/icons/EosIconsThreeDotsLoading';
import IcRoundCalendarViewWeek from '@/renderer/assets/icons/IcRoundCalendarViewWeek';
import IcOutlineInfo from '@/renderer/assets/icons/IcOutlineInfo';
import IcOutlineAlbum from '@/renderer/assets/icons/IcOutlineAlbum';
import IcOutlineExplore from '@/renderer/assets/icons/IcOutlineExplore';
import IcOutlineCable from '@/renderer/assets/icons/IcOutlineCable';
import IcRoundSwapHoriz from '@/renderer/assets/icons/IcRoundSwapHoriz';
import {
  atomNasInfo,
  atomPersistenceServerActiveTab,
  atomPersistenceTargeMenuItemForQuota,
  atomQuotaList,
  atomTargeByteSizeForQuota,
} from '@/renderer/atoms/atomUI';
import { atomFetchStatus } from '@/renderer/atoms/atomTask';
import useWindow from '@/renderer/utils/useWindow';
import useByteSizeForQuota from '@/renderer/utils/useByteSizeForQuota';
import BaseInfomationCard from './Server/BaseInfomationCard';
import RouteCard from './Server/RouteCard';
import CardUnit from './Server/CardUnit';

const Server: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [fetchStatus] = useAtom(atomFetchStatus);

  const [serverActiveTab, setServerActiveTab] = useAtom(atomPersistenceServerActiveTab);
  const [nasInfo] = useAtom(atomNasInfo);
  const [quotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);
  const [targeByteSizeForQuota] = useAtom(atomTargeByteSizeForQuota);

  const { zoomWindowForDarwin } = useWindow();

  const { updateByteSize: updateByteSizeForQuota } = useByteSizeForQuota();

  const basicInfomation = [
    {
      icon: <IcRoundCalendarViewWeek sx={{ fontSize: 20 }} />,
      title: t('server.synology_nas'),
      value: nasInfo.model,
      unit: '',
      type: 'text',
    },
    {
      icon: <IcOutlineInfo sx={{ fontSize: 20 }} />,
      title: t('server.dsm_version'),
      value: nasInfo.version,
      unit: '',
      type: 'text',
    },
    {
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
      title: t('server.quota'),
      value: targeByteSizeForQuota.max.value,
      unit: targeByteSizeForQuota.max.unit,
      type: 'select',
    },
    {
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
      title: t('server.available_capacity'),
      value: targeByteSizeForQuota.available.value,
      unit: targeByteSizeForQuota.available.unit,
      type: 'text',
    },
  ];
  const route = [
    {
      icon: <IcOutlineExplore sx={{ fontSize: 20 }} />,
      title: t('server.quickconnect_coordinator'),
      value: 'global.quickconnect.to',
    },
    {
      icon: <IcOutlineCable sx={{ fontSize: 20 }} />,
      title: t('server.host_address'),
      value: 'your-nas.cn3.quickconnect.cn',
    },
    {
      icon: <IcOutlineCable sx={{ fontSize: 20 }} />,
      title: t('server.local_ip'),
      value: '222.222.222.222',
    },
  ];
  const advanced = [
    {
      icon: <IcRoundSwapHoriz sx={{ fontSize: 20 }} />,
      title: 'DS920+',
      value: '32',
      unit: 'ms',
    },
  ];

  useUpdateEffect(() => {
    updateByteSizeForQuota();
  }, [quotaList]);

  useUpdateEffect(() => {
    updateByteSizeForQuota();
  }, [targeMenuItemForQuota]);

  return (
    <Box>
      <Box sx={{ height: theme.spacing(5), appRegion: 'drag' }} onDoubleClick={() => zoomWindowForDarwin()} />
      <Stack sx={{ pl: theme.spacing(2) }}>
        <Stack flexDirection="row" alignItems="center" sx={{ mb: theme.spacing(2) }}>
          <Typography variant="h4" fontWeight={600} color={theme.palette.text.primary}>
            {t('server.server')}
          </Typography>
          {fetchStatus === 'stopped' && (
            <Tooltip title={t('server.no_dsm_instance_connected')} placement="right" arrow>
              <Stack alignItems="center" sx={{ ml: theme.spacing(1) }}>
                <FluentVirtualNetwork20Filled color="disabled" sx={{ fontSize: 40 }} />
              </Stack>
            </Tooltip>
          )}
          {['pending'].includes(fetchStatus) && (
            <Tooltip title={t('server.network_pending')} placement="right" arrow>
              <Stack alignItems="center" sx={{ ml: theme.spacing(1) }}>
                <EosIconsThreeDotsLoading color="primary" sx={{ fontSize: 40 }} />
              </Stack>
            </Tooltip>
          )}
          {fetchStatus === 'polling' && (
            <Tooltip title={t('server.connection_to_dsm_established')} placement="right" arrow>
              <Stack alignItems="center" sx={{ ml: theme.spacing(1) }}>
                <FluentVirtualNetwork20Filled color="primary" sx={{ fontSize: 40 }} />
              </Stack>
            </Tooltip>
          )}
        </Stack>
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ height: theme.spacing(4) }}>
          <ToggleButtonGroup size="small" sx={{ height: theme.spacing(3) }}>
            <ToggleButton
              value="left"
              disableRipple
              selected={serverActiveTab === 'basicInfomation'}
              sx={{ px: theme.spacing(2) }}
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
              sx={{ px: theme.spacing(2) }}
              onClick={() => setServerActiveTab('route')}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.route')}
              </Typography>
            </ToggleButton>
            <ToggleButton
              value="right"
              disableRipple
              selected={serverActiveTab === 'advanced'}
              sx={{ px: theme.spacing(2) }}
              onClick={() => setServerActiveTab('advanced')}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.advanced')}
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <Stack flexDirection="row">
            {serverActiveTab === 'route' && (
              <Stack flexDirection="row">
                <Button
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.input.default,
                    '&:hover': { backgroundColor: theme.palette.input.hover },
                    ml: theme.spacing(1),
                  }}
                >
                  <Typography fontSize={12} fontWeight={500} sx={{ px: theme.spacing(0.5) }}>
                    {t('server.latency_test')}
                  </Typography>
                </Button>
                <Button
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.input.default,
                    '&:hover': { backgroundColor: theme.palette.input.hover },
                    ml: theme.spacing(1),
                  }}
                >
                  <Typography fontSize={12} fontWeight={500} sx={{ px: theme.spacing(0.5) }}>
                    {t('server.network_diagnosis')}
                  </Typography>
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
        {serverActiveTab === 'basicInfomation' && (
          <Stack flexDirection="row" mt={theme.spacing(3)} width="100%">
            {basicInfomation.map((item, index) => (
              <BaseInfomationCard
                type={item.type as 'text' | 'select'}
                hasMarginRight={basicInfomation.length - 1 !== index}
                title={item.title}
                value={item.value}
                unit={item.unit}
                icon={item.icon}
                key={item.title}
              />
            ))}
          </Stack>
        )}
        {serverActiveTab === 'route' && (
          <Stack flexDirection="column" mt={theme.spacing(3)} width="100%">
            {route.map((item) => (
              <RouteCard title={item.title} value={item.value} icon={item.icon} key={item.title} />
            ))}
          </Stack>
        )}
        {serverActiveTab === 'advanced' && (
          <Stack flexDirection="row" mt={theme.spacing(3)} width="100%">
            {advanced.map((item, index) => (
              <CardUnit
                hasIconButton={false}
                hasMarginRight={advanced.length - 1 === index}
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
