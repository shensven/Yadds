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
import RowItem from './Settings/RowItem';
import ApprearanceItem from './Settings/ApprearanceItem';
import IonPersonCircle from '../components/icons/IonPersonCircle';
import IonEyeOffOutline from '../components/icons/IonEyeOffOutline';
import IonEyeOutline from '../components/icons/IonEyeOutline';
import IonTrashOutline from '../components/icons/IonTrashOutline';
import EosIconsThreeDotsLoading from '../components/icons/EosIconsThreeDotsLoading';
import IonLogoTwitter from '../components/icons/IonLogoTwitter';
import IonLogoGithub from '../components/icons/IonLogoGithub';
import { atomAppVersion, atomOS } from '../atoms/atomConstant';
import {
  Appearance,
  atomPersistenceAppearance,
  atomPersistenceIsAutoLaunch,
  atomPersistenceLocaleName,
  LocaleName,
  atomPersistenceIsAutoUpdate,
} from '../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomTasksStatus } from '../atoms/atomTask';

const Settings: React.FC = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const [OS_PLATFORM] = useAtom(atomOS);
  const [APP_VERSION] = useAtom(atomAppVersion);
  const [appearance, setAppearance] = useAtom(atomPersistenceAppearance);
  const [localeName, setLocaleName] = useAtom(atomPersistenceLocaleName);
  const [isAutoLaunch, setIsAutoLaunch] = useAtom(atomPersistenceIsAutoLaunch);
  const [isAutoUpdate, setIsAutoUpdate] = useAtom(atomPersistenceIsAutoUpdate);
  const [connectedUsers, setConnectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid, setTargetDid] = useAtom(atomPersistenceTargetDid);
  const [, setTasksStatus] = useAtom(atomTasksStatus);

  const [hasSelecterForAddress, setHasSelecterForAddress] = useState<boolean>(false);
  const [hasSelecterForLocale, setHasSelecterForLocale] = useState<boolean>(false);
  const [hasLoading, setHasLoading] = useState<boolean>(false);
  const [hasDialogAdd, setHasDialogAdd] = useState<boolean>(false);
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

  interface YaddsAppearance {
    appearance: Appearance;
    label: string;
  }
  const appearanceList: YaddsAppearance[] = [
    {
      appearance: 'light',
      label: t('settings.light'),
    },
    {
      appearance: 'dark',
      label: t('settings.dark'),
    },
    {
      appearance: 'system',
      label: t('settings.follow_system'),
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

  const handleAddress = (did: string, menuItemIndex: number, isDelete: boolean) => {
    if (isDelete) {
      setWhoWillRemove(menuItemIndex);
      setHasSelecterForAddress(false);
      setHasDialogDelete(true);
      return;
    }
    setTargetDid(did);
    setHasSelecterForAddress(false);
  };

  const handleLocale = (targetLocaleName: LocaleName) => {
    i18n.changeLanguage(targetLocaleName);
    setLocaleName(targetLocaleName);
    setHasSelecterForLocale(false);
  };

  const dismissDialogRemove = () => {
    setHasDialogDelete(false);
    setWhoWillRemove(-1);
  };

  const dismissDailogAdd = () => {
    setHasDialogAdd(false);
    setHasLoading(false);
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
      setTargetDid('');
      setConnectedUsers([]);
    } else if (whoWillRemove === connectedUsers.length - 1) {
      const prevUser = connectedUsers[whoWillRemove - 1];
      setTargetDid(prevUser.did);

      const arr = [...connectedUsers];
      arr.splice(whoWillRemove, 1);
      setConnectedUsers(arr);
    } else {
      const nextUser = connectedUsers[whoWillRemove + 1];
      setTargetDid(nextUser.did);

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

    setHasLoading(true);

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
          setHasLoading(false);
          setFormErr({ ...formErr, address: true });
        }

        if (resp.errno === 30) {
          setSnackbar({
            show: true,
            errorInfo: `${t('settings.snackbar.cannot_connect_to')} ${newConnect.connectAddress}`,
          });
          setHasLoading(false);
          setFormErr({ ...formErr, address: true });
        }
      }

      if ('success' in resp) {
        if (!resp.success && resp.error.code === 400) {
          setSnackbar({
            show: true,
            errorInfo: t('settings.snackbar.wrong_account_or_password'),
          });
          setHasLoading(false);
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
          setTargetDid(resp.data.did);
          dismissDailogAdd();
          setTasksStatus({ isLoading: false, retry: 0 });
        }
      }
    } catch {
      setSnackbar({
        show: true,
        errorInfo: `${t('settings.snackbar.cannot_connect_to')} ${newConnect.connectAddress}`,
      });
      setHasLoading(false);
      setFormErr({ ...formErr, address: true });
    }
  };

  return (
    <Box>
      <Box
        sx={{ height: theme.spacing(5), appRegion: 'drag' }}
        onDoubleClick={() => OS_PLATFORM === 'darwin' && window.electron.app.zoomWindow()}
      />
      <Stack sx={{ pl: theme.spacing(2) }}>
        <Typography variant="h4" fontWeight={600} color={theme.palette.text.primary} sx={{ mb: theme.spacing(2) }}>
          {t('settings.settings')}
        </Typography>

        {/* appearance */}
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

        {/* QuickConnect ID or Address */}
        <RowItem label={t('settings.quickconnect_id_or_address')}>
          <FormGroup row>
            <FormControl>
              <Select
                size="small"
                displayEmpty
                value={targetDid}
                renderValue={() => (
                  <Typography sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {find(connectedUsers, { did: targetDid })?.username ?? 'undefined'}
                    {' @ '}
                    {find(connectedUsers, { did: targetDid })?.quickConnectID ?? 'undefined'}
                  </Typography>
                )}
                disabled={connectedUsers.length === 0}
                MenuProps={{
                  sx: { minWidth: theme.spacing(36), maxWidth: theme.spacing(36) },
                }}
                sx={{ minWidth: theme.spacing(36), maxWidth: theme.spacing(36), fontSize: 14 }}
                open={hasSelecterForAddress}
                onOpen={() => setHasSelecterForAddress(true)}
                onClose={() => setHasSelecterForAddress(false)}
              >
                {connectedUsers.map((item, index) => (
                  <MenuItem key={item.did} dense disableRipple value={item.did}>
                    <Stack width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                        onClick={() => handleAddress(item.did, index, false)}
                      >
                        {item.username} @ {item.quickConnectID}
                      </Typography>
                      <IconButton sx={{ width: 20, height: 20 }} onClick={() => handleAddress(item.did, index, true)}>
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
        </RowItem>

        {/* locales */}
        <RowItem label={t('settings.language')}>
          <FormGroup>
            <FormControl>
              <Select
                size="small"
                sx={{ minWidth: theme.spacing(36), maxWidth: theme.spacing(36), fontSize: 14 }}
                value={localeName}
                MenuProps={{
                  sx: { minWidth: theme.spacing(36), maxWidth: theme.spacing(36) },
                }}
                open={hasSelecterForLocale}
                onOpen={() => setHasSelecterForLocale(true)}
                onClose={() => setHasSelecterForLocale(false)}
              >
                {localeNameList.map((item) => (
                  <MenuItem key={item.localeName} dense disableRipple value={item.localeName}>
                    <Stack width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                        onClick={() => handleLocale(item.localeName)}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
        </RowItem>

        {/* system */}
        <RowItem label={t('settings.application')}>
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
        </RowItem>

        {/* About */}
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
              disabled={hasLoading}
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
              disabled={hasLoading}
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
              disabled={hasLoading}
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
              ...(hasLoading && {
                backgroundColor: theme.palette.action.disabledBackground,
              }),
            }}
            disabled={hasLoading}
            onClick={() => handleAuth()}
          >
            {hasLoading ? <EosIconsThreeDotsLoading /> : t('settings.dialog_add.ok')}
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
