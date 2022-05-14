import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog from '@mui/material/Dialog';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { useAtom } from 'jotai';
import IonPersonCircle from '../components/icons/IonPersonCircle';
import IonEyeOffOutline from '../components/icons/IonEyeOffOutline';
import IonEyeOutline from '../components/icons/IonEyeOutline';
import IonTrashOutline from '../components/icons/IonTrashOutline';
import EosIconsThreeDotsLoading from '../components/icons/EosIconsThreeDotsLoading';
import darwin_appearance_light from '../assets/Settings/darwin_appearance_light.png';
import darwin_appearance_dark from '../assets/Settings/darwin_appearance_dark.png';
import darwin_appearance_follow_system from '../assets/Settings/darwin_appearance_follow_system.png';
import win32_appearance_light from '../assets/Settings/win32_appearance_light.png';
import win32_appearance_dark from '../assets/Settings/win32_appearance_dark.png';
import win32_appearance_follow_system from '../assets/Settings/win32_appearance_follow_system.png';
import linux_appearance_light from '../assets/Settings/linux_appearance_light.png';
import linux_appearance_dark from '../assets/Settings/linux_appearance_dark.png';
import linux_appearance_follow_system from '../assets/Settings/linux_appearance_follow_system.png';
import gnome_appearance_light from '../assets/Settings/gnome_appearance_light.png';
import gnome_appearance_dark from '../assets/Settings/gnome_appearance_dark.png';
import gnome_appearance_follow_system from '../assets/Settings/gnome_appearance_follow_system.png';
import {
  dsmConnectIndexAtomWithPersistence,
  dsmConnectListAtomWithPersistence,
  hasYaddsSidebarAtomWithPersistence,
  hasYaddsSidebarMarginTopAtom,
  isYaddsAutoLaunchAtomWithPersistence,
  isYaddsAutoUpdateAtomWithPersistence,
  tasksStatusAtom,
  YaddsAppearance,
  yaddsAppearanceAtomWithPersistence,
  YaddsI18nCode,
  yaddsI18nCodeAtomWithPersistence,
} from '../atoms/yaddsAtoms';
import appMenuItemHandler from '../utils/appMenuItemHandler';

const OS_PLATFORM = window.electron?.getOS();
const APP_VERSION = window.electron?.getAppVersion();

const getAppearanceLight = () => {
  switch (OS_PLATFORM) {
    case 'darwin':
      return darwin_appearance_light;
    case 'win32':
      return win32_appearance_light;
    case 'linux':
      return linux_appearance_light;
    default:
      return gnome_appearance_light;
  }
};

const getAppearanceDark = () => {
  switch (OS_PLATFORM) {
    case 'darwin':
      return darwin_appearance_dark;
    case 'win32':
      return win32_appearance_dark;
    case 'linux':
      return linux_appearance_dark;
    default:
      return gnome_appearance_dark;
  }
};

const getAppearanceFollowSystem = () => {
  switch (OS_PLATFORM) {
    case 'darwin':
      return darwin_appearance_follow_system;
    case 'win32':
      return win32_appearance_follow_system;
    case 'linux':
      return linux_appearance_follow_system;
    default:
      return gnome_appearance_follow_system;
  }
};

interface SettingsFormItemProps {
  label: string;
  children: React.ReactNode;
  hasMargin?: boolean;
}
const SettingsFormItem: React.FC<SettingsFormItemProps> = (props: SettingsFormItemProps) => {
  const { label, children, hasMargin } = props;
  const theme = useTheme();
  const LABEL_WIDTH: string = theme.spacing(28);
  return (
    <Stack flex={1} flexDirection="row" px={theme.spacing(1)} py={theme.spacing(2)}>
      <FormControl margin={hasMargin ? 'dense' : 'none'} sx={{ width: LABEL_WIDTH }}>
        <Typography variant="subtitle2" fontWeight={800} color={theme.palette.text.primary}>
          {label}
        </Typography>
      </FormControl>
      {children}
    </Stack>
  );
};
SettingsFormItem.defaultProps = {
  hasMargin: true,
};

const Settings: React.FC = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const [hasYaddsSidebar] = useAtom(hasYaddsSidebarAtomWithPersistence);
  const [hasYaddsSidebarMarginTop] = useAtom(hasYaddsSidebarMarginTopAtom);
  const [yaddsAppearance, persistYaddsAppearance] = useAtom(yaddsAppearanceAtomWithPersistence);
  const [yaddsI18nCode, persistYaddsI18nCode] = useAtom(yaddsI18nCodeAtomWithPersistence);
  const [isYaddsAutoLaunch, persistIsYaddsAutoLaunch] = useAtom(isYaddsAutoLaunchAtomWithPersistence);
  const [isYaddsAutoUpdate, persistIsYaddsAutoUpdate] = useAtom(isYaddsAutoUpdateAtomWithPersistence);
  const [dsmConnectList, persistDsmConnectList] = useAtom(dsmConnectListAtomWithPersistence);
  const [dsmConnectIndex, persistDsmConnectIndex] = useAtom(dsmConnectIndexAtomWithPersistence);
  const [, setTasksStatus] = useAtom(tasksStatusAtom);

  const [isSelectQcOpen, setIsSelectQcOpen] = useState<boolean>(false);
  const [isSelectI18nOpen, setIsSelectI18nOpen] = useState<boolean>(false);
  const [hasDialogAdd, setHasDialogAdd] = useState<boolean>(false);
  const [loadingInDialogAdd, setLoadingInDialogAdd] = useState<boolean>(false);
  const [hasDialogDelete, setHasDialogDelete] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({ show: false, errorInfo: '' });
  const [formErr] = useState({
    address: false,
    username: false,
    password: false,
  });

  const [newConnect, setNewConnect] = useState({
    isQuickConnectID: true,
    connectAddress: '',
    isHttps: false,
    username: '',
    password: '',
    showPassword: false,
  });

  interface YaddsAppearanceObj {
    yaddsAppearance: YaddsAppearance;
    label: string;
    src: string;
  }
  const appearanceList: YaddsAppearanceObj[] = [
    {
      yaddsAppearance: 'light',
      label: t('settings.light'),
      src: getAppearanceLight(),
    },
    {
      yaddsAppearance: 'dark',
      label: t('settings.dark'),
      src: getAppearanceDark(),
    },
    {
      yaddsAppearance: 'system',
      label: t('settings.follow_system'),
      src: getAppearanceFollowSystem(),
    },
  ];

  interface YaddsI18n {
    languageCode: YaddsI18nCode;
    label: string;
  }
  const i18nList: YaddsI18n[] = [
    { languageCode: 'en', label: 'English' },
    { languageCode: 'zh_CN', label: '简体中文' },
    { languageCode: 'zh_TW', label: '繁體中文' },
    { languageCode: 'ja_JP', label: '日本語' },
  ];

  const handleSelectQcOnChange = (menuItemAddressIndex: number, isDelete: boolean) => {
    if (isDelete) {
      setHasDialogDelete(true);
      setIsSelectQcOpen(false);
      return;
    }
    persistDsmConnectIndex(menuItemAddressIndex);
    setIsSelectQcOpen(false);
  };

  const handleSelectI18nOnChange = (languageCode: YaddsI18nCode) => {
    persistYaddsI18nCode(languageCode);
    i18n.changeLanguage(languageCode);
    const appMenuItemLabel = appMenuItemHandler(t, hasYaddsSidebar, hasYaddsSidebarMarginTop);
    window.electron.setAppMenu(appMenuItemLabel);
    window.electron.setTray(t);
    setIsSelectI18nOpen(false);
  };

  const dismissDailogAdd = () => {
    setHasDialogAdd(false);
    setLoadingInDialogAdd(false);
    setNewConnect({
      isQuickConnectID: true,
      connectAddress: '',
      isHttps: false,
      username: '',
      password: '',
      showPassword: false,
    });
  };

  const dismissDaialogDelete = () => {
    setHasDialogDelete(false);
  };

  const dismissSnackbar = () => {
    setSnackbar({ show: false, errorInfo: '' });
  };

  // const handleAuthErrTitle = () => {
  //   if (newConnect.isQuickConnectID) {
  //     switch (snackbar.errCode) {
  //       case '01':
  //         return t('settings.snackbar.access_denied');
  //       case '02':
  //         return t('settings.snackbar.access_denied');
  //       case '024':
  //         return t('settings.snackbar.access_denied');
  //       case '03':
  //         return t('settings.snackbar.request_timeout');
  //       case '04':
  //         return t('settings.snackbar.access_denied');
  //       default:
  //         return t('settings.snackbar.access_denied');
  //     }
  //   } else {
  //     return t('settings.snackbar.access_denied');
  //   }
  // };

  // const handleAuthErrDesc = () => {
  //   if (newConnect.isQuickConnectID) {
  //     switch (snackbar.errCode) {
  //       case '01':
  //         return t('settings.snackbar.invalid_quickconnect_id');
  //       case '02':
  //         return t('settings.snackbar.unable_to_connect_to_quickconnect_coordinator');
  //       case '024':
  //         return t('settings.snackbar.invalid_quickconnect_id');
  //       case '03':
  //         return `${t('settings.snackbar.unable_to_connect_to')} ${newConnect.connectAddress}`;
  //       case '04':
  //         return t('settings.snackbar.wrong_account_or_password');
  //       default:
  //         return '';
  //     }
  //   } else {
  //     return '';
  //   }
  // };

  const handleAuth = async () => {
    if (newConnect.connectAddress.length === 0) {
      setSnackbar({
        show: true,
        errorInfo: t('settings.snackbar.invalid_quickconnect_id'),
      });
      return;
    }

    if (newConnect.username.length === 0 || newConnect.password.length === 0) {
      setSnackbar({
        show: true,
        errorInfo: t('settings.snackbar.wrong_account_or_password'),
      });
      return;
    }

    setLoadingInDialogAdd(true);

    const resp = await window.electron.net.auth({
      quickConnectID: newConnect.connectAddress,
      account: newConnect.username,
      passwd: newConnect.password,
    });

    console.log('auth', resp);

    if (!resp.success) {
      setSnackbar({
        show: true,
        errorInfo: t(`settings.snackbar.${resp.errorInfoSummary}`),
      });
      setLoadingInDialogAdd(false);
    } else {
      const arr = [...dsmConnectList];
      arr.push({
        host: resp.hostname,
        port: resp.port,
        quickConnectID: resp.quickConnectID,
        username: newConnect.username,
        did: resp.data.did,
        sid: resp.data.sid,
      });
      persistDsmConnectList(arr);
      dismissDailogAdd();
      setTasksStatus({
        isLoading: false,
        retry: 0,
      });
    }
  };

  return (
    <Box>
      <Box
        sx={{ height: theme.spacing(5), appRegion: 'drag' }}
        onDoubleClick={() => OS_PLATFORM === 'darwin' && window.electron.zoomWindow()}
      />
      <Stack sx={{ pl: theme.spacing(2) }}>
        <Typography variant="h4" fontWeight={600} color={theme.palette.text.primary} sx={{ mb: theme.spacing(2) }}>
          {t('settings.settings')}
        </Typography>

        {/* appearance */}
        <SettingsFormItem label={t('settings.appearance')}>
          <FormGroup row>
            {appearanceList.map((item) => (
              <Stack key={item.label} alignItems="center" mr={theme.spacing(2)}>
                <Box
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    filter: yaddsAppearance === item.yaddsAppearance ? 'grayscale(0)' : 'grayscale(100%) opacity(0.75)',
                    height: 44,
                    width: 67,
                    '&:hover': {
                      filter: yaddsAppearance === item.yaddsAppearance ? 'grayscale(0)' : 'grayscale(25%) opacity(1)',
                    },
                  }}
                  onClick={() => {
                    persistYaddsAppearance(item.yaddsAppearance);
                    window.electron.toggleNativeTheme(item.yaddsAppearance);
                  }}
                >
                  <img src={item.src} alt="" draggable="false" width={67} height={44} />
                </Box>
                <Typography
                  variant="overline"
                  color={
                    yaddsAppearance === item.yaddsAppearance
                      ? theme.palette.text.secondary
                      : theme.palette.text.disabled
                  }
                >
                  {item.label}
                </Typography>
              </Stack>
            ))}
          </FormGroup>
        </SettingsFormItem>

        {/* QuickConnect ID or Address */}
        <SettingsFormItem label={t('settings.quickconnect_id_or_address')}>
          <FormGroup row>
            <FormControl>
              <Select
                size="small"
                sx={{ minWidth: theme.spacing(36), maxWidth: theme.spacing(36), fontSize: 14 }}
                value={dsmConnectList[dsmConnectIndex].sid}
                renderValue={() => (
                  <Typography sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dsmConnectList[dsmConnectIndex]?.username ?? 'null'}
                    {' @ '}
                    {dsmConnectList[dsmConnectIndex]?.quickConnectID ?? 'null'}
                  </Typography>
                )}
                MenuProps={{
                  sx: { minWidth: theme.spacing(36), maxWidth: theme.spacing(36) },
                }}
                open={isSelectQcOpen}
                onOpen={() => setIsSelectQcOpen(true)}
                onClose={() => setIsSelectQcOpen(false)}
              >
                {dsmConnectList.map((item, index) => (
                  <MenuItem key={item.sid} dense disableRipple value={item.sid}>
                    <Stack width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                        onClick={() => handleSelectQcOnChange(index, false)}
                      >
                        {item.username} @ {item.quickConnectID}
                      </Typography>
                      <IconButton sx={{ width: 20, height: 20 }} onClick={() => handleSelectQcOnChange(index, true)}>
                        <IonTrashOutline sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              size="small"
              sx={{ ml: theme.spacing(1), px: theme.spacing(1) }}
              onClick={() => setHasDialogAdd(true)}
            >
              {t('settings.new_connection')}
            </Button>
          </FormGroup>
        </SettingsFormItem>

        {/* i18n */}
        <SettingsFormItem label={t('settings.language')}>
          <FormGroup>
            <FormControl>
              <Select
                size="small"
                sx={{ minWidth: theme.spacing(36), maxWidth: theme.spacing(36), fontSize: 14 }}
                value={yaddsI18nCode}
                MenuProps={{
                  sx: { minWidth: theme.spacing(36), maxWidth: theme.spacing(36) },
                }}
                open={isSelectI18nOpen}
                onOpen={() => setIsSelectI18nOpen(true)}
                onClose={() => setIsSelectI18nOpen(false)}
              >
                {i18nList.map((item) => (
                  <MenuItem key={item.languageCode} dense disableRipple value={item.languageCode}>
                    <Stack width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                        onClick={() => handleSelectI18nOnChange(item.languageCode)}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
        </SettingsFormItem>

        {/* system */}
        <SettingsFormItem label={t('settings.application')}>
          <FormGroup>
            <FormControlLabel
              checked={isYaddsAutoLaunch}
              label={<Typography variant="subtitle2">{t('settings.launch_yadds_at_login')}</Typography>}
              control={<Checkbox size="small" checked={isYaddsAutoLaunch} />}
              onClick={() => persistIsYaddsAutoLaunch(!isYaddsAutoLaunch)}
            />
            <FormControlLabel
              checked={isYaddsAutoUpdate}
              label={<Typography variant="subtitle2">{t('settings.automaticly_check_for_updates')}</Typography>}
              control={<Checkbox size="small" checked={isYaddsAutoUpdate} />}
              onClick={() => persistIsYaddsAutoUpdate(!isYaddsAutoUpdate)}
            />
            <Stack flexDirection="row" alignItems="center">
              <FormHelperText>{`${t('settings.current_version')} ${APP_VERSION}`}</FormHelperText>
              <Button
                size="small"
                sx={{
                  ml: theme.spacing(1),
                  backgroundColor: theme.palette.input.default,
                  '&:hover': { backgroundColor: theme.palette.input.hover },
                }}
                onClick={() => {}}
              >
                <Typography fontWeight={500} sx={{ fontSize: 12, lineHeight: 'normal', px: theme.spacing(0.5) }}>
                  {t('settings.check_now')}
                </Typography>
              </Button>
            </Stack>
          </FormGroup>
        </SettingsFormItem>

        {/* About */}
        <SettingsFormItem label={t('settings.about')} hasMargin={false}>
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
                onClick={() => window.electron.openViaBrowser('https://github.com/shensven/Yadds/blob/main/LICENSE')}
              >
                {t('settings.this_copy_is_licensed_under_GPL_3_0')}
              </Typography>
            </Stack>
            <Stack flexDirection="row" mt={theme.spacing(1)}>
              <Typography variant="subtitle2">{t('settings.devoloper')}</Typography>
              <Typography
                variant="subtitle2"
                color={theme.palette.primary.main}
                sx={{
                  ml: theme.spacing(1),
                  '&:hover': { opacity: 0.5 },
                }}
                onClick={() => window.electron.openViaBrowser('https://github.com/shensven')}
              >
                @SvenFE
              </Typography>
            </Stack>
            <FormHelperText>Made with ❤️ in Kunming</FormHelperText>
          </FormGroup>
        </SettingsFormItem>
      </Stack>

      {/* Add Connection */}
      <Dialog open={hasDialogAdd} onClose={() => dismissDailogAdd()}>
        <DialogTitle>
          <Stack flexDirection="row" alignItems="stretch" justifyContent="space-between">
            <Stack flexDirection="row" alignItems="center">
              <IonPersonCircle sx={{ fontSize: 32 }} />
            </Stack>
            <ToggleButtonGroup size="small">
              <ToggleButton
                value="left"
                disableRipple
                selected={newConnect.isQuickConnectID}
                sx={{ px: theme.spacing(2), py: 0 }}
                onClick={() =>
                  setNewConnect({
                    ...newConnect,
                    isQuickConnectID: true,
                    connectAddress: '',
                    isHttps: false,
                    username: '',
                    password: '',
                    showPassword: false,
                  })
                }
              >
                <Typography variant="button" fontSize={11} fontWeight={600}>
                  QuickConnect ID
                </Typography>
              </ToggleButton>
              <ToggleButton
                value="right"
                disableRipple
                selected={!newConnect.isQuickConnectID}
                sx={{ px: theme.spacing(2), py: 0 }}
                onClick={() =>
                  setNewConnect({
                    ...newConnect,
                    isQuickConnectID: false,
                    connectAddress: '',
                    isHttps: false,
                    username: '',
                    password: '',
                    showPassword: false,
                  })
                }
              >
                <Typography variant="button" fontSize={11} fontWeight={600}>
                  {t('settings.dialog_add.address')}
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack width={theme.spacing(34)} mt={theme.spacing(1)}>
            <TextField
              size="small"
              spellCheck={false}
              disabled={loadingInDialogAdd}
              autoFocus
              error={formErr.address === true}
              label={newConnect.isQuickConnectID ? 'QuickConnect ID' : t('settings.dialog_add.address')}
              value={newConnect.connectAddress}
              sx={{ mt: theme.spacing(2) }}
              InputLabelProps={{ sx: { fontSize: 14 } }}
              InputProps={{
                [(!newConnect.isQuickConnectID && 'startAdornment') as string]: (
                  <InputAdornment position="start">{newConnect.isHttps ? 'https://' : 'http://'}</InputAdornment>
                ),
              }}
              onChange={(evt) => setNewConnect({ ...newConnect, connectAddress: evt.target.value })}
              onKeyPress={(evt) => evt.key === 'Enter' && handleAuth()}
            />
            <FormControlLabel
              sx={{ alignSelf: 'flex-end', visibility: newConnect.isQuickConnectID ? 'hidden' : 'visible' }}
              labelPlacement="start"
              label={<Typography color={theme.palette.text.secondary}>HTTPS</Typography>}
              control={<Checkbox size="small" checked={newConnect.isHttps} />}
              onClick={() => setNewConnect({ ...newConnect, isHttps: !newConnect.isHttps })}
            />
            <TextField
              size="small"
              spellCheck={false}
              disabled={loadingInDialogAdd}
              error={formErr.username === true}
              label={t('settings.dialog_add.username')}
              value={newConnect.username}
              InputLabelProps={{ sx: { fontSize: 14 } }}
              onChange={(evt) => setNewConnect({ ...newConnect, username: evt.target.value })}
              onKeyPress={(evt) => evt.key === 'Enter' && handleAuth()}
            />
            <TextField
              size="small"
              spellCheck={false}
              disabled={loadingInDialogAdd}
              error={formErr.password === true}
              label={t('settings.dialog_add.password')}
              value={newConnect.password}
              type={newConnect.showPassword ? 'text' : 'password'}
              sx={{ mt: theme.spacing(2) }}
              InputLabelProps={{ sx: { fontSize: 14 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => setNewConnect({ ...newConnect, showPassword: !newConnect.showPassword })}
                    >
                      {newConnect.showPassword ? (
                        <IonEyeOutline fontSize="small" />
                      ) : (
                        <IonEyeOffOutline fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(evt) => setNewConnect({ ...newConnect, password: evt.target.value })}
              onKeyPress={(evt) => evt.key === 'Enter' && handleAuth()}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => dismissDailogAdd()}>
            {t('settings.dialog_add.cancel')}
          </Button>
          <Button
            sx={{
              transition: theme.transitions.create(['background-color'], {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.standard,
              }),
              ...(loadingInDialogAdd && {
                backgroundColor: theme.palette.action.disabledBackground,
              }),
            }}
            disabled={loadingInDialogAdd}
            onClick={() => handleAuth()}
          >
            {loadingInDialogAdd ? <EosIconsThreeDotsLoading /> : t('settings.dialog_add.ok')}
          </Button>
        </DialogActions>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbar.show}
          TransitionComponent={Slide}
          onClose={() => dismissSnackbar()}
        >
          <Alert severity="error" sx={{ width: theme.spacing(40) }} onClose={() => dismissSnackbar()}>
            {snackbar.errorInfo}
          </Alert>
        </Snackbar>
      </Dialog>

      {/* Confirm Remove */}
      <Dialog open={hasDialogDelete} onClose={() => dismissDaialogDelete()}>
        <DialogTitle>
          <Stack flexDirection="row" alignItems="center">
            <Typography>{t('settings.dialog_remove.confirm_remove')}</Typography>
            <IonTrashOutline sx={{ fontSize: 17, ml: theme.spacing(1) }} />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography color={theme.palette.text.secondary} sx={{ fontSize: 14, width: theme.spacing(28) }}>
            {t('settings.dialog_remove.are_you_sure')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => dismissDaialogDelete()}>
            {t('settings.dialog_remove.cancel')}
          </Button>
          <Button
            color="error"
            onClick={() => {
              persistDsmConnectList([]);
              persistDsmConnectIndex(0);
              dismissDaialogDelete();
            }}
          >
            {t('settings.dialog_remove.yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
