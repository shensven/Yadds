import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import IonPersonCircle from '../components/icons/IonPersonCircle';
import IonEyeOffOutline from '../components/icons/IonEyeOffOutline';
import IonEyeOutline from '../components/icons/IonEyeOutline';
import IonTrashOutline from '../components/icons/IonTrashOutline';
import AppearanceLight from '../assets/Settings/AppearanceLight_67x44_@2x.png';
import AppearanceDark from '../assets/Settings/AppearanceDark_67x44_@2x.png';
import AppearanceAuto from '../assets/Settings/AppearanceAuto_67x44_@2x.png';
import AppearanceLightNoColor from '../assets/Settings/AppearanceLightNoColor_67x44_@2x.png';
import AppearanceDarkNoColor from '../assets/Settings/AppearanceDarkNoColor_67x44_@2x.png';
import AppearanceAutoNoColor from '../assets/Settings/AppearanceAutoNoColor_67x44_@2x.png';
import { DsmConnectListType, YaddsCtx } from '../context/YaddsContext';

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
    <Stack flex={1} flexDirection="row" padding={theme.spacing(2)}>
      <FormControl margin={hasMargin ? 'dense' : 'none'} sx={{ minWidth: LABEL_WIDTH, width: '20%' }}>
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

  const {
    yaddsAppearance,
    persistYaddsAppearance,
    yaddsI18nCode,
    persistYaddsI18nCode,
    isYaddsAutoLaunch,
    persistIsYaddsAutoLaunch,
    isYaddsAutoUpdate,
    persistIsYaddsAutoUpdate,
    dsmConnectList,
    persistDsmConnectList,
    dsmConnectIndex,
    persistDsmConnectIndex,
  } = useContext(YaddsCtx);

  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [hasDialogAdd, setHasDialogAdd] = useState<boolean>(false);
  const [hasDialogDelete, setHasDialogDelete] = useState<boolean>(false);

  const [newConnect, setNewConnect] = useState({
    isQuickConnectID: true,
    connectAddress: '',
    isHttps: false,
    username: '',
    password: '',
    showPassword: false,
  });

  interface AppearanceItem {
    themeSource: 'system' | 'light' | 'dark';
    label: string;
    appearanceSrc: string;
    appearanceNoColorSrc: string;
  }
  const appearanceItemArray: AppearanceItem[] = [
    {
      themeSource: 'light',
      label: t('settings.light'),
      appearanceSrc: AppearanceLight,
      appearanceNoColorSrc: AppearanceLightNoColor,
    },
    {
      themeSource: 'dark',
      label: t('settings.dark'),
      appearanceSrc: AppearanceDark,
      appearanceNoColorSrc: AppearanceDarkNoColor,
    },
    {
      themeSource: 'system',
      label: t('settings.follow_system'),
      appearanceSrc: AppearanceAuto,
      appearanceNoColorSrc: AppearanceAutoNoColor,
    },
  ];

  interface I18nItem {
    languageCode: string;
    label: string;
  }
  const i18nItemArray: I18nItem[] = [
    { languageCode: 'en', label: 'English' },
    { languageCode: 'zh-Hans', label: '简体中文' },
  ];

  const handleSelectOnChange = (menuItemAddressIndex: number, isDelete: boolean) => {
    if (isDelete) {
      // console.log(isDelete);
      setHasDialogDelete(true);
      setIsSelectOpen(false);
      return;
    }
    // console.log(isDelete);
    persistDsmConnectIndex(menuItemAddressIndex);
    setIsSelectOpen(false);
  };

  const dismissDailogAdd = () => {
    setHasDialogAdd(false);
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

  return (
    <Box>
      <Box
        sx={{ height: theme.spacing(5), appRegion: 'drag' }}
        onDoubleClick={() => window.electron.getOS() === 'darwin' && window.electron.zoomWindow()}
      />
      <Stack sx={{ pl: theme.spacing(2) }}>
        <Typography variant="h3" fontWeight={500} color={theme.palette.text.primary} sx={{ mb: theme.spacing(2) }}>
          {t('settings.settings')}
        </Typography>
        {/* appearance */}
        <SettingsFormItem label={t('settings.appearance')}>
          <FormGroup row>
            {appearanceItemArray.map((item: AppearanceItem) => (
              <Stack key={item.label} alignItems="center" mr={theme.spacing(2)}>
                <Box
                  sx={{ filter: yaddsAppearance === item.themeSource ? 'brightness(100%)' : 'brightness(75%)' }}
                  onClick={() => {
                    persistYaddsAppearance(item.themeSource);
                    window.electron.toggleNativeTheme(item.themeSource);
                  }}
                >
                  <img
                    src={yaddsAppearance === item.themeSource ? item.appearanceSrc : item.appearanceNoColorSrc}
                    alt=""
                    draggable="false"
                    width={67}
                    height={44}
                  />
                </Box>
                <Typography
                  variant="overline"
                  color={
                    yaddsAppearance === item.themeSource ? theme.palette.text.secondary : theme.palette.text.disabled
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
                multiple
                MenuProps={{
                  elevation: 0,
                  sx: {
                    minWidth: theme.spacing(40),
                    maxWidth: theme.spacing(40),
                    '& .MuiPaper-root': { boxShadow: '0 0 24px rgba(0,0,0,0.08), 0 8px 8px rgba(0,0,0,0.04)' },
                  },
                }}
                sx={{ minWidth: theme.spacing(40), maxWidth: theme.spacing(40), fontSize: 14 }}
                value={[dsmConnectIndex]}
                renderValue={() =>
                  `${dsmConnectList[dsmConnectIndex]?.host ?? 'null'} - ${
                    dsmConnectList[dsmConnectIndex]?.username ?? 'null'
                  }`
                }
                open={isSelectOpen}
                onOpen={() => setIsSelectOpen(true)}
                onClose={() => setIsSelectOpen(false)}
              >
                {dsmConnectList.map((item: DsmConnectListType, index: number) => (
                  <MenuItem key={item.id} dense disableRipple value={item.id}>
                    <Stack width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                        onClick={() => handleSelectOnChange(index, false)}
                      >
                        {item.host} - {item.username}
                      </Typography>
                      <IconButton sx={{ width: 20, height: 20 }} onClick={() => handleSelectOnChange(index, true)}>
                        <IonTrashOutline sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button size="small" sx={{ ml: theme.spacing(1) }} onClick={() => setHasDialogAdd(true)}>
              {t('settings.new_connection')}
            </Button>
          </FormGroup>
        </SettingsFormItem>
        {/* i18n */}
        <SettingsFormItem label={t('settings.language')}>
          <FormGroup>
            {i18nItemArray.map((item: I18nItem) => (
              <FormControlLabel
                key={item.languageCode}
                checked={yaddsI18nCode === item.languageCode}
                label={<Typography variant="subtitle2">{item.label}</Typography>}
                control={<Radio size="small" checked={yaddsI18nCode === item.languageCode} />}
                onClick={() => {
                  persistYaddsI18nCode(item.languageCode);
                  i18n.changeLanguage(item.languageCode);
                  window.electron?.setApplicationMenu(t);
                  window.electron?.setTray(t);
                }}
              />
            ))}
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
            <FormHelperText>
              {t('settings.current_version')} {window.electron.getAppVersion()}
            </FormHelperText>
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
                sx={{ ml: theme.spacing(1) }}
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
                sx={{ ml: theme.spacing(1) }}
                onClick={() => window.electron.openViaBrowser('https://github.com/shensven')}
              >
                @SvenFE
              </Typography>
            </Stack>
            <FormHelperText>Made with ❤️ in Kunming</FormHelperText>
          </FormGroup>
        </SettingsFormItem>
      </Stack>
      <Dialog open={hasDialogAdd} onClose={() => dismissDailogAdd()}>
        <DialogTitle>
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
            <Stack flexDirection="row" alignItems="center">
              <Typography>{t('settings.dialog.new_connection')}</Typography>
              <IonPersonCircle sx={{ fontSize: 22, ml: theme.spacing(0.5) }} />
            </Stack>
            <ToggleButtonGroup size="small">
              <ToggleButton
                value="left"
                disableRipple
                selected={newConnect.isQuickConnectID}
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
                <Typography sx={{ fontSize: 10, fontWeight: 500 }}>QuickConnect ID</Typography>
              </ToggleButton>
              <ToggleButton
                value="right"
                disableRipple
                selected={!newConnect.isQuickConnectID}
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
                <Typography sx={{ fontSize: 10, fontWeight: 500 }}>{t('settings.dialog.address')}</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack width={theme.spacing(34)} mt={theme.spacing(1)}>
            <TextField
              size="small"
              spellCheck={false}
              autoFocus
              label={newConnect.isQuickConnectID ? 'QuickConnect ID' : t('settings.dialog.address')}
              value={newConnect.connectAddress}
              sx={{ mt: theme.spacing(2) }}
              InputLabelProps={{ sx: { fontSize: 14 } }}
              InputProps={{
                [(!newConnect.isQuickConnectID && 'startAdornment') as string]: (
                  <InputAdornment position="start">{newConnect.isHttps ? 'https://' : 'http://'}</InputAdornment>
                ),
              }}
              onChange={(evt) => setNewConnect({ ...newConnect, connectAddress: evt.target.value })}
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
              label={t('settings.dialog.username')}
              spellCheck={false}
              value={newConnect.username}
              InputLabelProps={{ sx: { fontSize: 14 } }}
              onChange={(evt) => setNewConnect({ ...newConnect, username: evt.target.value })}
            />
            <TextField
              size="small"
              label={t('settings.dialog.password')}
              spellCheck={false}
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
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => console.log(dsmConnectList)}>
            打印
          </Button>
          <Button color="inherit" onClick={() => persistDsmConnectList([])}>
            清空
          </Button>
          <Button
            onClick={() => {
              // const arr = [...dsmConnectList];
              // arr.push({
              //   host: `10.10.10.${dsmConnectList.length + 1}`,
              //   username: `root${dsmConnectList.length + 1}`,
              //   did: '123456789',
              //   id: new Date().getTime().toString(),
              // });
              // setDsmConnectList(arr);
              window.electron.net.auth(newConnect.connectAddress, newConnect.username, newConnect.password);
            }}
          >
            {t('settings.dialog.ok')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={hasDialogDelete} onClose={() => dismissDaialogDelete()}>
        <DialogTitle>
          <Stack flexDirection="row" alignItems="center">
            <Typography>确认删除</Typography>
            <IonTrashOutline sx={{ fontSize: 17, ml: theme.spacing(1) }} />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography color={theme.palette.text.secondary} sx={{ fontSize: 12, width: theme.spacing(28) }}>
            登出并删除连接？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => dismissDaialogDelete()}>
            取消
          </Button>
          <Button color="error" onClick={() => {}}>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
