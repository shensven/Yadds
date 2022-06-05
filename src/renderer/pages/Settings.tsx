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
import { find } from 'lodash';
import IonPersonCircle from '../components/icons/IonPersonCircle';
import IonEyeOffOutline from '../components/icons/IonEyeOffOutline';
import IonEyeOutline from '../components/icons/IonEyeOutline';
import IonTrashOutline from '../components/icons/IonTrashOutline';
import EosIconsThreeDotsLoading from '../components/icons/EosIconsThreeDotsLoading';
import darwin_appearance_light from './assets/Settings/darwin_appearance_light.png';
import darwin_appearance_dark from './assets/Settings/darwin_appearance_dark.png';
import darwin_appearance_follow_system from './assets/Settings/darwin_appearance_follow_system.png';
import win32_appearance_light from './assets/Settings/win32_appearance_light.png';
import win32_appearance_dark from './assets/Settings/win32_appearance_dark.png';
import win32_appearance_follow_system from './assets/Settings/win32_appearance_follow_system.png';
import linux_appearance_light from './assets/Settings/linux_appearance_light.png';
import linux_appearance_dark from './assets/Settings/linux_appearance_dark.png';
import linux_appearance_follow_system from './assets/Settings/linux_appearance_follow_system.png';
import gnome_appearance_light from './assets/Settings/gnome_appearance_light.png';
import gnome_appearance_dark from './assets/Settings/gnome_appearance_dark.png';
import gnome_appearance_follow_system from './assets/Settings/gnome_appearance_follow_system.png';
import IonLogoTwitter from '../components/icons/IonLogoTwitter';
import IonLogoGithub from '../components/icons/IonLogoGithub';
import createMenuItemLabelsForApp from '../utils/createMenuItemLabelsForApp';
import createMenuItemLabelsForTray from '../utils/createMenuItemLabelsForTray';
import {
  Appearance,
  atomHasSidebarMarginTop,
  atomPersistenceAppearance,
  atomPersistenceIsAutoLaunch,
  atomPersistenceHasSidebar,
  atomPersistenceLocaleName,
  LocaleName,
  atomPersistenceIsAutoUpdate,
} from '../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetSid } from '../atoms/atomConnectedUsers';
import { atomTasksStatus } from '../atoms/atomTask';

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

  const [hasSidebar] = useAtom(atomPersistenceHasSidebar);
  const [hasSidebarMarginTop] = useAtom(atomHasSidebarMarginTop);
  const [appearance, setAppearance] = useAtom(atomPersistenceAppearance);
  const [localeName, setLocaleName] = useAtom(atomPersistenceLocaleName);
  const [isAutoLaunch, setIsAutoLaunch] = useAtom(atomPersistenceIsAutoLaunch);
  const [isAutoUpdate, setIsAutoUpdate] = useAtom(atomPersistenceIsAutoUpdate);
  const [connectedUsers, setConnectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetSid, setTargetSid] = useAtom(atomPersistenceTargetSid);
  const [, setTasksStatus] = useAtom(atomTasksStatus);

  const [isSelectQcOpen, setIsSelectQcOpen] = useState<boolean>(false);
  const [isSelectI18nOpen, setIsSelectI18nOpen] = useState<boolean>(false);
  const [hasDialogAdd, setHasDialogAdd] = useState<boolean>(false);
  const [loadingInDialogAdd, setLoadingInDialogAdd] = useState<boolean>(false);
  const [hasDialogDelete, setHasDialogDelete] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({ show: false, errorInfo: '' });
  const [formErr, setFormErr] = useState({ address: false, username: false, password: false });

  const [newConnect, setNewConnect] = useState({
    isQuickConnectID: true,
    connectAddress: '',
    isHttps: false,
    username: '',
    password: '',
    showPassword: false,
  });

  const [whoWillRemove, setWhoWillRemove] = useState<number>(-1);

  interface YaddsAppearanceObj {
    yaddsAppearance: Appearance;
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

  interface SettingsLocale {
    localeName: LocaleName;
    label: string;
  }
  const localeNameList: SettingsLocale[] = [
    { localeName: 'en', label: 'English' },
    { localeName: 'zh_CN', label: '简体中文' },
    { localeName: 'zh_TW', label: '繁體中文' },
    { localeName: 'ja_JP', label: '日本語' },
  ];

  const handleSelectQcOnChange = (sid: string, menuItemIndex: number, isDelete: boolean) => {
    if (isDelete) {
      setWhoWillRemove(menuItemIndex);
      setIsSelectQcOpen(false);
      setHasDialogDelete(true);
      return;
    }
    setTargetSid(sid);
    setIsSelectQcOpen(false);
  };

  const handleSelectI18nOnChange = (targetLocaleName: LocaleName) => {
    setLocaleName(targetLocaleName);
    i18n.changeLanguage(targetLocaleName);
    const topMenuItemLabels = createMenuItemLabelsForApp(t, hasSidebar, hasSidebarMarginTop);
    window.electron.topMenuForApp.create(topMenuItemLabels);
    const ctxMenuItemLabels = createMenuItemLabelsForTray(t);
    window.electron.contextMenuForTray.create(ctxMenuItemLabels);
    setIsSelectI18nOpen(false);
  };

  const dismissDialogRemove = () => {
    setHasDialogDelete(false);
    setWhoWillRemove(-1);
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
    setFormErr({ address: false, username: false, password: false });
  };

  const dismissSnackbar = () => {
    setSnackbar({ show: false, errorInfo: '' });
    setFormErr({ address: false, username: false, password: false });
  };

  const handleRemove = () => {
    if (connectedUsers.length === 1) {
      setTargetSid('');
      setConnectedUsers([]);
    } else if (whoWillRemove === connectedUsers.length - 1) {
      const prevUser = connectedUsers[whoWillRemove - 1];
      setTargetSid(prevUser.sid);

      const arr = [...connectedUsers];
      arr.splice(whoWillRemove, 1);
      setConnectedUsers(arr);
    } else {
      const nextUser = connectedUsers[whoWillRemove + 1];
      setTargetSid(nextUser.sid);

      const arr = [...connectedUsers];
      arr.splice(whoWillRemove, 1);
      setConnectedUsers(arr);
    }

    setHasDialogDelete(false);
  };

  const handleAuth = async () => {
    if (
      newConnect.connectAddress.length === 0 ||
      !/(^[a-zA-Z])/.test(newConnect.connectAddress) ||
      /-$/.test(newConnect.connectAddress)
    ) {
      setSnackbar({
        show: true,
        errorInfo: t('settings.snackbar.invalid_quickconnect_id'),
      });
      setFormErr({ ...formErr, address: true });
      return;
    }

    if (newConnect.username.length === 0 || newConnect.password.length === 0) {
      setSnackbar({
        show: true,
        errorInfo: t('settings.snackbar.wrong_account_or_password'),
      });
      setFormErr({ ...formErr, username: true, password: true });
      return;
    }

    if (
      find(connectedUsers, {
        quickConnectID: newConnect.connectAddress,
        username: newConnect.username,
      })
    ) {
      setSnackbar({
        show: true,
        errorInfo: t('settings.snackbar.no_duplicate_logins_allowed'),
      });
      setFormErr({ ...formErr, address: true, username: true });
      return;
    }

    setLoadingInDialogAdd(true);

    try {
      const resp = await window.electron.net.auth({
        quickConnectID: newConnect.connectAddress,
        account: newConnect.username,
        passwd: newConnect.password,
      });

      if ('command' in resp) {
        if (resp.errno === 4 && resp.suberrno === 1) {
          setSnackbar({
            show: true,
            errorInfo: t('settings.snackbar.quickconnect_id_is_incorrect_or_does_not_exist'),
          });
          setLoadingInDialogAdd(false);
          setFormErr({ ...formErr, address: true });
        }

        if (resp.errno === 30) {
          setSnackbar({
            show: true,
            errorInfo: `${t('settings.snackbar.cannot_connect_to')} ${newConnect.connectAddress}`,
          });
          setLoadingInDialogAdd(false);
          setFormErr({ ...formErr, address: true });
        }
      }

      if ('success' in resp) {
        if (!resp.success && resp.error.code === 400) {
          setSnackbar({
            show: true,
            errorInfo: t('settings.snackbar.wrong_account_or_password'),
          });
          setLoadingInDialogAdd(false);
          setFormErr({ ...formErr, username: true, password: true });
        } else if (resp.success && resp.data.did.length > 0) {
          const arr = [...connectedUsers];
          arr.push({
            host: resp.hostname,
            port: resp.port,
            quickConnectID: resp.quickConnectID,
            username: newConnect.username,
            did: resp.data.did,
            sid: resp.data.sid,
          });
          setConnectedUsers(arr);
          setTargetSid(resp.data.sid);
          dismissDailogAdd();
          setTasksStatus({ isLoading: false, retry: 0 });
        }
      }
    } catch {
      setSnackbar({
        show: true,
        errorInfo: `${t('settings.snackbar.cannot_connect_to')} ${newConnect.connectAddress}`,
      });
      setLoadingInDialogAdd(false);
      setFormErr({ ...formErr, address: true });
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
                    filter: appearance === item.yaddsAppearance ? 'grayscale(0)' : 'grayscale(100%) opacity(0.75)',
                    height: 44,
                    width: 67,
                    '&:hover': {
                      filter: appearance === item.yaddsAppearance ? 'grayscale(0)' : 'grayscale(25%) opacity(1)',
                    },
                  }}
                  onClick={() => {
                    setAppearance(item.yaddsAppearance);
                    window.electron.toggleNativeTheme(item.yaddsAppearance);
                  }}
                >
                  <img src={item.src} alt="" draggable="false" width={67} height={44} />
                </Box>
                <Typography
                  variant="overline"
                  color={
                    appearance === item.yaddsAppearance ? theme.palette.text.secondary : theme.palette.text.disabled
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
                displayEmpty
                value={targetSid}
                renderValue={() => (
                  <Typography sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {find(connectedUsers, { sid: targetSid })?.username ?? 'undefined'}
                    {' @ '}
                    {find(connectedUsers, { sid: targetSid })?.quickConnectID ?? 'undefined'}
                  </Typography>
                )}
                disabled={connectedUsers.length === 0}
                MenuProps={{
                  sx: { minWidth: theme.spacing(36), maxWidth: theme.spacing(36) },
                }}
                sx={{ minWidth: theme.spacing(36), maxWidth: theme.spacing(36), fontSize: 14 }}
                open={isSelectQcOpen}
                onOpen={() => setIsSelectQcOpen(true)}
                onClose={() => setIsSelectQcOpen(false)}
              >
                {connectedUsers.map((item, index) => (
                  <MenuItem key={item.sid} dense disableRipple value={item.sid}>
                    <Stack width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                        onClick={() => handleSelectQcOnChange(item.sid, index, false)}
                      >
                        {item.username} @ {item.quickConnectID}
                      </Typography>
                      <IconButton
                        sx={{ width: 20, height: 20 }}
                        onClick={() => handleSelectQcOnChange(item.sid, index, true)}
                      >
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

        {/* locales */}
        <SettingsFormItem label={t('settings.language')}>
          <FormGroup>
            <FormControl>
              <Select
                size="small"
                sx={{ minWidth: theme.spacing(36), maxWidth: theme.spacing(36), fontSize: 14 }}
                value={localeName}
                MenuProps={{
                  sx: { minWidth: theme.spacing(36), maxWidth: theme.spacing(36) },
                }}
                open={isSelectI18nOpen}
                onOpen={() => setIsSelectI18nOpen(true)}
                onClose={() => setIsSelectI18nOpen(false)}
              >
                {localeNameList.map((item) => (
                  <MenuItem key={item.localeName} dense disableRipple value={item.localeName}>
                    <Stack width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                        onClick={() => handleSelectI18nOnChange(item.localeName)}
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
              checked={isAutoLaunch}
              label={<Typography variant="subtitle2">{t('settings.launch_yadds_at_login')}</Typography>}
              control={<Checkbox size="small" checked={isAutoLaunch} />}
              onClick={() => setIsAutoLaunch(!isAutoLaunch)}
            />
            <FormControlLabel
              checked={isAutoUpdate}
              label={<Typography variant="subtitle2">{t('settings.automaticly_check_for_updates')}</Typography>}
              control={<Checkbox size="small" checked={isAutoUpdate} />}
              onClick={() => setIsAutoUpdate(!isAutoUpdate)}
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
                onClick={() => window.electron.openViaBrowser('https://twitter.com/shensven2016')}
              />
              <IonLogoGithub
                sx={{
                  fontSize: 17,
                  color: theme.palette.text.disabled,
                  ml: theme.spacing(1),
                  '&:hover': { color: '#333333' },
                }}
                onClick={() => window.electron.openViaBrowser('https://github.com/shensven')}
              />
            </Stack>
            <FormHelperText>Made with ❤️ in Kunming</FormHelperText>
          </FormGroup>
        </SettingsFormItem>
      </Stack>

      {/* Add Connection */}
      <Dialog keepMounted open={hasDialogAdd} onClose={() => dismissDailogAdd()}>
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
              onChange={(evt) => setNewConnect({ ...newConnect, connectAddress: evt.target.value.replace(/\s/g, '') })}
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
              onChange={(evt) => setNewConnect({ ...newConnect, username: evt.target.value.replace(/\s/g, '') })}
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
      <Dialog keepMounted open={hasDialogDelete} onClose={() => dismissDialogRemove()}>
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
          <Button color="inherit" onClick={() => dismissDialogRemove()}>
            {t('settings.dialog_remove.cancel')}
          </Button>
          <Button color="error" onClick={() => handleRemove()}>
            {t('settings.dialog_remove.yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
