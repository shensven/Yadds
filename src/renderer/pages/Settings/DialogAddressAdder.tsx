import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Slide,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import IonPersonCircle from '../../components/icons/IonPersonCircle';
import { atomHasDialogAddressAdder } from '../../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../../atoms/atomConnectedUsers';
import { atomTasksStatus } from '../../atoms/atomTask';
import IonEyeOutline from '../../components/icons/IonEyeOutline';
import IonEyeOffOutline from '../../components/icons/IonEyeOffOutline';
import EosIconsThreeDotsLoading from '../../components/icons/EosIconsThreeDotsLoading';

const DialogAddressAdder: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [connectedUsers, setConnectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [, setTargetDid] = useAtom(atomPersistenceTargetDid);
  const [, setTasksStatus] = useAtom(atomTasksStatus);
  const [hasDialogAddressAdder, setHasDialogAddressAdder] = useAtom(atomHasDialogAddressAdder);

  const [hasLoading, setHasLoading] = useState(false);
  const [newConnect, setNewConnect] = useState({
    isQuickConnectID: true,
    connectAddress: '',
    isHttps: false,
    username: '',
    password: '',
    showPassword: false,
  });
  const [formErr, setFormErr] = useState({ address: false, username: false, password: false });
  const [snackbar, setSnackbar] = useState({ show: false, errorInfo: '' });

  const dismissDailogAdd = () => {
    setHasDialogAddressAdder(false);
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

  const handleAuth = async () => {
    if (
      newConnect.connectAddress.length === 0 ||
      !/(^[a-zA-Z])/.test(newConnect.connectAddress) ||
      /-$/.test(newConnect.connectAddress)
    ) {
      setSnackbar({ show: true, errorInfo: t('settings.snackbar.invalid_quickconnect_id') });
      setFormErr({ ...formErr, address: true });
      return;
    }

    if (newConnect.username.length === 0 || newConnect.password.length === 0) {
      setSnackbar({ show: true, errorInfo: t('settings.snackbar.wrong_account_or_password') });
      setFormErr({ ...formErr, username: true, password: true });
      return;
    }

    if (
      find(connectedUsers, {
        quickConnectID: newConnect.connectAddress,
        username: newConnect.username,
      })
    ) {
      setSnackbar({ show: true, errorInfo: t('settings.snackbar.no_duplicate_logins_allowed') });
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
          setSnackbar({ show: true, errorInfo: t('settings.snackbar.quickconnect_id_is_incorrect_or_does_not_exist') });
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
          setSnackbar({ show: true, errorInfo: t('settings.snackbar.wrong_account_or_password') });
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
    <Dialog keepMounted open={hasDialogAddressAdder} onClose={() => dismissDailogAdd()}>
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
  );
};

export default DialogAddressAdder;
