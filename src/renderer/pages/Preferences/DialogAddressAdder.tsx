import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Slide,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import IcRoundAccountCircle from '../../assets/icons/IcRoundAccountCircle';
import IcRoundArrowBack from '../../assets/icons/IcRoundArrowBack';
import IonEyeOutline from '../../assets/icons/IonEyeOutline';
import IonEyeOffOutline from '../../assets/icons/IonEyeOffOutline';
import IcRoundPhoneAndroid from '../../assets/icons/IcRoundPhoneAndroid';
import IcRoundFingerprint from '../../assets/icons/IcRoundFingerprint';
import IcRoundPassword from '../../assets/icons/IcRoundPassword';
import EosIconsThreeDotsLoading from '../../assets/icons/EosIconsThreeDotsLoading';
import { atomHasDialogAddressAdder } from '../../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../../atoms/atomConnectedUsers';

interface NewConnect {
  connectType: '' | 'qc' | 'host';
  quickConnectID: string;
  host: string;
  port: number;
  isHttps: boolean;
  username: string;
  authType: { type: 'authenticator' | 'fido' | 'passwd' }[];
  passwd: string;
}

const DialogAddressAdder: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [connectedUsers, setConnectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [, setTargetDid] = useAtom(atomPersistenceTargetDid);
  const [hasDialogAddressAdder, setHasDialogAddressAdder] = useAtom(atomHasDialogAddressAdder);

  const [dialogSize, setDialogSize] = useState([{ height: theme.spacing(24), width: theme.spacing(32) }]);

  const [newConnect, setNewConnect] = useState<NewConnect>({
    connectType: '',
    quickConnectID: '',
    host: '',
    port: 0,
    isHttps: false,
    username: '',
    authType: [],
    passwd: '',
  });
  const [hasLoading, setHasLoading] = useState(false);
  const [textFieldError, setTextFieldError] = useState(false);
  const [targetAuthType, setTargetAuthType] = useState<'' | 'authenticator' | 'fido' | 'passwd'>('');
  const [showPasswd, setShowPasswd] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, errorInfo: '' });

  const resetDialogSize = () => {
    setDialogSize([{ height: theme.spacing(24), width: theme.spacing(32) }]);
  };

  const dismissDailogAdder = () => {
    setHasDialogAddressAdder(false);
    setTimeout(() => {
      setHasLoading(false);
      setTextFieldError(false);
      setSnackbar({ show: false, errorInfo: '' });
      setTargetAuthType('');
      setShowPasswd(false);
      setNewConnect({
        connectType: '',
        quickConnectID: '',
        host: '',
        port: 0,
        isHttps: false,
        username: '',
        authType: [],
        passwd: '',
      });
      resetDialogSize();
    }, 200);
  };

  const dismissSnackbar = () => {
    setSnackbar({ show: false, errorInfo: '' });
    setTextFieldError(false);
  };

  const handleAuth = async () => {
    try {
      const resp = await window.electron.net.signIn({
        host: newConnect.host,
        port: newConnect.port,
        username: newConnect.username,
        passwd: newConnect.passwd,
      });

      if ('success' in resp) {
        if (!resp.success && resp.error.code === 400) {
          setSnackbar({ show: true, errorInfo: t('preferences.snackbar.wrong_account_or_password') });
          setHasLoading(false);
          setTextFieldError(true);
        } else if (resp.success && resp.data.did.length > 0) {
          const arr = [...connectedUsers];
          arr.push({
            host: resp.host,
            port: resp.port,
            quickConnectID: newConnect.quickConnectID,
            username: newConnect.username,
            did: resp.data.did,
            sid: resp.data.sid,
          });
          setConnectedUsers(arr);
          setTargetDid(resp.data.did);
          dismissDailogAdder();
        }
      }
    } catch (error) {
      console.log(error);
    }
    console.log(newConnect);
  };

  const handleNext = async () => {
    if (dialogSize.length === 2) {
      if (!/(^[a-zA-Z])/.test(newConnect.quickConnectID) || /-$/.test(newConnect.quickConnectID)) {
        setSnackbar({ show: true, errorInfo: t('preferences.snackbar.invalid_quickconnect_id') });
        setTextFieldError(true);
        return;
      }

      setHasLoading(true);

      try {
        const resp = await window.electron.net.getServerAddress(newConnect.quickConnectID);

        if ('command' in resp) {
          if (resp.errno === 4 && resp.suberrno === 1) {
            setSnackbar({
              show: true,
              errorInfo: t('preferences.snackbar.quickconnect_id_is_incorrect_or_does_not_exist'),
            });
            setTextFieldError(true);
            setHasLoading(false);
            return;
          }

          if (resp.errno === 30) {
            setSnackbar({
              show: true,
              errorInfo: `${t('preferences.snackbar.cannot_connect_to')} ${newConnect.quickConnectID}`,
            });
            setHasLoading(false);
            setTextFieldError(true);
            return;
          }
        }

        if ('success' in resp && resp.success) {
          setNewConnect({ ...newConnect, host: resp.host, port: resp.port });
          setDialogSize([...dialogSize, { height: theme.spacing(32), width: theme.spacing(40) }]);
          setHasLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (dialogSize.length === 3) {
      if (find(connectedUsers, { quickConnectID: newConnect.quickConnectID, username: newConnect.username })) {
        setSnackbar({ show: true, errorInfo: t('preferences.snackbar.no_duplicate_logins_allowed') });
        setTextFieldError(true);
        return;
      }

      setHasLoading(true);

      try {
        const resp = await window.electron.net.getAuthType({
          host: newConnect.host,
          port: newConnect.port,
          username: newConnect.username,
        });

        if (resp.success) {
          if (find(resp.data, { type: 'fido' })) {
            setTargetAuthType('fido');
          } else if (find(resp.data, { type: 'authenticator' })) {
            setTargetAuthType('authenticator');
          } else {
            setTargetAuthType('passwd');
          }
          setNewConnect({ ...newConnect, authType: resp.data });
          setDialogSize([...dialogSize, { height: theme.spacing(40), width: theme.spacing(40) }]);
          setHasLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (dialogSize.length === 4) {
      setHasLoading(true);
      handleAuth();
    }
  };

  return (
    <Dialog
      keepMounted
      open={hasDialogAddressAdder}
      PaperProps={{
        sx: {
          transition: theme.transitions.create(['height', 'width']),
          height: dialogSize[dialogSize.length - 1].height,
          width: dialogSize[dialogSize.length - 1].width,
        },
      }}
      onClose={() => dismissDailogAdder()}
    >
      <DialogTitle>
        <Stack flexDirection="row" alignItems="center">
          <IcRoundAccountCircle
            sx={{
              position: 'absolute',
              color: theme.palette.text.secondary,
              transition: theme.transitions.create(['transform', 'opacity']),
              transform: dialogSize.length === 1 ? 'scale(1)' : 'scale(0)',
              opacity: dialogSize.length === 1 ? 1 : 0,
            }}
          />
          <IconButton
            disabled={dialogSize.length === 1}
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              transition: theme.transitions.create(['transform', 'opacity']),
              transform: dialogSize.length === 1 ? 'scale(0)' : 'scale(1)',
              opacity: dialogSize.length === 1 ? 0 : 1,
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
            }}
            onClick={() => {
              if (dialogSize.length !== 1) {
                setDialogSize([...dialogSize.slice(0, dialogSize.length - 1)]);
              }
            }}
          >
            <IcRoundArrowBack sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            noWrap
            variant="subtitle2"
            color={theme.palette.text.secondary}
            sx={{
              transition: theme.transitions.create('margin'),
              ml: dialogSize.length === 1 ? theme.spacing(4) : theme.spacing(5),
            }}
          >
            {[1, 2].includes(dialogSize.length) && t('preferences.dialog_adder.sign_in_with')}
            {dialogSize.length === 3 && newConnect.quickConnectID}
            {dialogSize.length === 4 && newConnect.username}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack height="100%">
          {dialogSize.length === 1 && (
            <Fade in>
              <Stack flex={1} justifyContent="center">
                <Button
                  sx={{
                    height: theme.spacing(5),
                    backgroundColor: theme.palette.input.default,
                    '&:hover': { backgroundColor: theme.palette.input.hover },
                  }}
                  onClick={() => {
                    setNewConnect({ ...newConnect, connectType: 'qc' });
                    setDialogSize([...dialogSize, { height: theme.spacing(32), width: theme.spacing(40) }]);
                  }}
                >
                  <Typography fontSize={12} fontWeight={500} sx={{ px: theme.spacing(0.5) }}>
                    QuickConnect ID
                  </Typography>
                </Button>
                <Button
                  sx={{
                    height: theme.spacing(5),
                    mt: theme.spacing(2),
                    backgroundColor: theme.palette.input.default,
                    '&:hover': { backgroundColor: theme.palette.input.hover },
                  }}
                  onClick={() => {
                    setNewConnect({ ...newConnect, connectType: 'host' });
                    setDialogSize([...dialogSize, { height: theme.spacing(32), width: theme.spacing(48) }]);
                  }}
                >
                  <Typography fontSize={12} fontWeight={500} sx={{ px: theme.spacing(0.5) }}>
                    {t('preferences.dialog_adder.host_address')}
                  </Typography>
                </Button>
              </Stack>
            </Fade>
          )}
          {[2, 3, 4].includes(dialogSize.length) && (
            <Fade in>
              <Stack flex={1} justifyContent="space-between" sx={{ overflow: 'hidden' }}>
                {dialogSize.length === 2 && (
                  <Stack>
                    {newConnect.connectType === 'qc' && (
                      <TextField
                        size="small"
                        disabled={hasLoading}
                        error={textFieldError}
                        autoFocus
                        spellCheck={false}
                        label="QuickConnect ID"
                        value={newConnect.quickConnectID}
                        sx={{ mt: theme.spacing(2) }}
                        InputLabelProps={{ sx: { fontSize: 14 } }}
                        onChange={(evt) =>
                          setNewConnect({ ...newConnect, quickConnectID: evt.target.value.replace(/\s/g, '') })
                        }
                        onKeyPress={(evt) => evt.key === 'Enter' && handleNext()}
                      />
                    )}
                    {newConnect.connectType === 'host' && (
                      <Stack>
                        <TextField
                          size="small"
                          disabled={hasLoading}
                          error={textFieldError}
                          autoFocus
                          spellCheck={false}
                          label={t('preferences.dialog_adder.host_address')}
                          value={newConnect.quickConnectID}
                          sx={{ mt: theme.spacing(2) }}
                          InputLabelProps={{ sx: { fontSize: 14 } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {newConnect.isHttps ? 'https://' : 'http://'}
                              </InputAdornment>
                            ),
                          }}
                          onChange={(evt) =>
                            setNewConnect({ ...newConnect, quickConnectID: evt.target.value.replace(/\s/g, '') })
                          }
                          onKeyPress={(evt) => evt.key === 'Enter' && handleNext()}
                        />
                        <FormControlLabel
                          labelPlacement="start"
                          label={
                            <Typography fontSize={12} fontWeight={500} color={theme.palette.text.secondary}>
                              HTTPS
                            </Typography>
                          }
                          control={<Checkbox size="small" checked={newConnect.isHttps} />}
                          onClick={() => setNewConnect({ ...newConnect, isHttps: !newConnect.isHttps })}
                        />
                      </Stack>
                    )}
                  </Stack>
                )}
                {dialogSize.length === 3 && (
                  <TextField
                    size="small"
                    autoFocus
                    spellCheck={false}
                    label={t('preferences.dialog_adder.username')}
                    value={newConnect.username}
                    sx={{ mt: theme.spacing(2) }}
                    InputLabelProps={{ sx: { fontSize: 14 } }}
                    onChange={(evt) => setNewConnect({ ...newConnect, username: evt.target.value.replace(/\s/g, '') })}
                    onKeyPress={(evt) => evt.key === 'Enter' && handleNext()}
                  />
                )}
                {dialogSize.length === 4 && (
                  <Stack>
                    {targetAuthType === 'fido' && (
                      <Stack>
                        <Stack flexDirection="row" alignItems="center">
                          <Typography fontWeight={500} variant="subtitle1">
                            {t('preferences.dialog_adder.waiting_for_verification')}
                          </Typography>
                          <EosIconsThreeDotsLoading sx={{ ml: theme.spacing(0.5) }} />
                        </Stack>
                        <Typography variant="body2" color={theme.palette.text.secondary} mt={theme.spacing(0.5)}>
                          {t('preferences.dialog_adder.complate_sign_in_with_your_hardware_security_key')}
                        </Typography>
                      </Stack>
                    )}
                    {targetAuthType === 'authenticator' && (
                      <Stack>
                        <Stack flexDirection="row" alignItems="center">
                          <Typography fontWeight={500} variant="subtitle1">
                            {t('preferences.dialog_adder.waiting_for_verification')}
                          </Typography>
                          <EosIconsThreeDotsLoading sx={{ ml: theme.spacing(0.5) }} />
                        </Stack>
                        <Typography variant="body2" color={theme.palette.text.secondary} mt={theme.spacing(0.5)}>
                          {t('preferences.dialog_adder.approve_the_request_on_your_synology_secure_signin_app')}
                        </Typography>
                      </Stack>
                    )}
                    {targetAuthType === 'passwd' && (
                      <TextField
                        size="small"
                        autoFocus
                        spellCheck={false}
                        label={t('preferences.dialog_adder.password')}
                        value={newConnect.passwd}
                        type={showPasswd ? 'text' : 'password'}
                        sx={{ mt: theme.spacing(2) }}
                        InputLabelProps={{ sx: { fontSize: 14 } }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end" size="small" onClick={() => setShowPasswd(!showPasswd)}>
                                {showPasswd ? (
                                  <IonEyeOutline fontSize="small" />
                                ) : (
                                  <IonEyeOffOutline fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        onChange={(evt) => setNewConnect({ ...newConnect, passwd: evt.target.value })}
                        onKeyPress={(evt) => evt.key === 'Enter' && handleNext()}
                      />
                    )}
                  </Stack>
                )}

                <Stack>
                  <Button
                    disabled={
                      (dialogSize.length === 2 && (newConnect.quickConnectID.length === 0 || hasLoading)) ||
                      (dialogSize.length === 3 && (newConnect.username.length === 0 || hasLoading)) ||
                      (dialogSize.length === 4 && (newConnect.passwd.length === 0 || hasLoading))
                    }
                    sx={{
                      mb: theme.spacing(1),
                      height: theme.spacing(5),
                      alignItems: 'center',
                      backgroundColor: theme.palette.input.default,
                      '&:hover': { backgroundColor: theme.palette.input.hover },
                      transition: theme.transitions.create('opacity'),
                      opacity:
                        [2, 3].includes(dialogSize.length) || (dialogSize.length === 4 && targetAuthType === 'passwd')
                          ? 1
                          : 0,
                    }}
                    onClick={() => handleNext()}
                  >
                    {hasLoading && <EosIconsThreeDotsLoading />}
                    {!hasLoading && (
                      <Typography fontSize={12} fontWeight={500}>
                        {[2, 3].includes(dialogSize.length) && t('preferences.dialog_adder.next')}
                        {dialogSize.length === 4 && targetAuthType === 'passwd' && t('preferences.dialog_adder.login')}
                      </Typography>
                    )}
                  </Button>

                  <Stack
                    sx={{
                      mt: theme.spacing(1),
                      transition: theme.transitions.create('height'),
                      height: dialogSize.length === 4 ? theme.spacing(9) : 0,
                    }}
                  >
                    <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Box flex={1} height="1px" sx={{ backgroundColor: theme.palette.divider }} />
                      <Typography
                        noWrap
                        fontSize={10}
                        color={theme.palette.text.disabled}
                        sx={{ mx: theme.spacing(1) }}
                      >
                        {t('preferences.dialog_adder.other_sign_in_methods')}
                      </Typography>
                      <Box flex={1} height="1px" sx={{ backgroundColor: theme.palette.divider }} />
                    </Stack>

                    <Stack flexDirection="row" mt={theme.spacing(1)}>
                      {find(newConnect.authType, { type: 'fido' }) && (
                        <Stack alignItems="center" mr={theme.spacing(2)}>
                          <Button
                            size="large"
                            sx={{
                              backgroundColor: theme.palette.input.default,
                              minWidth: theme.spacing(5),
                              maxWidth: theme.spacing(5),
                              '&:hover': { backgroundColor: theme.palette.input.hover },
                            }}
                            onClick={() => setTargetAuthType('fido')}
                          >
                            <IcRoundFingerprint
                              fontSize="small"
                              sx={{
                                color:
                                  targetAuthType === 'fido' ? theme.palette.primary.main : theme.palette.text.secondary,
                              }}
                            />
                          </Button>

                          <Typography
                            fontSize={8}
                            color={theme.palette.text.secondary}
                            sx={{ mt: theme.spacing(0.25) }}
                          >
                            FIDO
                          </Typography>
                        </Stack>
                      )}

                      {find(newConnect.authType, { type: 'authenticator' }) && (
                        <Stack alignItems="center" mr={theme.spacing(2)}>
                          <Button
                            size="large"
                            sx={{
                              backgroundColor: theme.palette.input.default,
                              minWidth: theme.spacing(5),
                              maxWidth: theme.spacing(5),
                              '&:hover': { backgroundColor: theme.palette.input.hover },
                            }}
                          >
                            <IcRoundPhoneAndroid
                              fontSize="small"
                              sx={{
                                color:
                                  targetAuthType === 'authenticator'
                                    ? theme.palette.primary.main
                                    : theme.palette.text.secondary,
                              }}
                              onClick={() => setTargetAuthType('authenticator')}
                            />
                          </Button>
                          <Typography
                            fontSize={8}
                            color={theme.palette.text.secondary}
                            sx={{ mt: theme.spacing(0.25) }}
                          >
                            OTP
                          </Typography>
                        </Stack>
                      )}

                      <Stack alignItems="center" mr={theme.spacing(2)}>
                        <Button
                          size="large"
                          sx={{
                            backgroundColor: theme.palette.input.default,
                            minWidth: theme.spacing(5),
                            maxWidth: theme.spacing(5),
                            '&:hover': { backgroundColor: theme.palette.input.hover },
                          }}
                          onClick={() => setTargetAuthType('passwd')}
                        >
                          <IcRoundPassword
                            fontSize="small"
                            sx={{
                              color:
                                targetAuthType === 'passwd' ? theme.palette.primary.main : theme.palette.text.secondary,
                            }}
                          />
                        </Button>
                        <Typography fontSize={8} color={theme.palette.text.secondary} sx={{ mt: theme.spacing(0.25) }}>
                          {t('preferences.dialog_adder.password')}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Fade>
          )}
        </Stack>
      </DialogContent>
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
