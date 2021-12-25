import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  MenuItem,
  Radio,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import YaddsMain from '../containers/YaddsMain';
import AppearanceLight from '../assets/Settings/AppearanceLight_67x44_@2x.png';
import AppearanceDark from '../assets/Settings/AppearanceDark_67x44_@2x.png';
import AppearanceAuto from '../assets/Settings/AppearanceAuto_67x44_@2x.png';
import AppearanceLightNoColor from '../assets/Settings/AppearanceLightNoColor_67x44_@2x.png';
import AppearanceDarkNoColor from '../assets/Settings/AppearanceDarkNoColor_67x44_@2x.png';
import AppearanceAutoNoColor from '../assets/Settings/AppearanceAutoNoColor_67x44_@2x.png';

const Settings: React.FC = () => {
  const theme = useTheme();
  const LABEL_WIDTH: string = theme.spacing(24);

  const [appearance, setAppearance] = useState<number>(0);
  const [address, setAddress] = useState<string>('0');
  const [i18n, setI18n] = useState<number>(0);
  const [isAutoLaunch, setIsAutoLaunch] = useState<boolean>(false);
  const [isAutoUpdate, setIsAutoUpdate] = useState<boolean>(true);

  interface AppearanceItem {
    id: number;
    label: string;
    appearanceSrc: string;
    appearanceNoColorSrc: string;
    onClick: () => void;
  }
  const appearanceItemArray: AppearanceItem[] = [
    {
      id: 0,
      label: '浅色',
      appearanceSrc: AppearanceLight,
      appearanceNoColorSrc: AppearanceLightNoColor,
      onClick: () => setAppearance(0),
    },
    {
      id: 1,
      label: '深色',
      appearanceSrc: AppearanceDark,
      appearanceNoColorSrc: AppearanceDarkNoColor,
      onClick: () => setAppearance(1),
    },
    {
      id: 2,
      label: '跟随系统',
      appearanceSrc: AppearanceAuto,
      appearanceNoColorSrc: AppearanceAutoNoColor,
      onClick: () => setAppearance(2),
    },
  ];

  interface I18nItem {
    label: string;
    id: number;
    onClick: () => void;
  }
  const i18nItemArray: I18nItem[] = [
    { id: 0, label: '简体中文', onClick: () => setI18n(0) },
    { id: 1, label: '正體中文', onClick: () => setI18n(1) },
    { id: 2, label: 'English', onClick: () => setI18n(2) },
  ];

  interface YaddsFormProps {
    label: string;
    children: React.ReactNode;
    hasMargin?: boolean;
  }
  const YaddsFormItem: React.FC<YaddsFormProps> = (props: YaddsFormProps) => {
    const { label, children, hasMargin } = props;
    return (
      <Stack flex={1} flexDirection="row" padding={theme.spacing(2)}>
        <FormControl margin={hasMargin ?? true ? 'dense' : 'none'} sx={{ minWidth: LABEL_WIDTH, width: '20%' }}>
          <Typography variant="subtitle2" color={theme.palette.grey[800]}>
            {label}
          </Typography>
        </FormControl>
        {children}
      </Stack>
    );
  };

  return (
    <YaddsMain hasAppbar={false}>
      <Stack sx={{ padding: theme.spacing(4) }}>
        <Typography variant="h3" color={theme.palette.grey[900]} sx={{ marginBottom: theme.spacing(2) }}>
          设置
        </Typography>
        {/* appearance */}
        <YaddsFormItem label="外观">
          <FormGroup row>
            {appearanceItemArray.map((item: AppearanceItem) => (
              <Stack key={item.label} alignItems="center" marginRight={theme.spacing(2)}>
                <Box
                  sx={{ filter: appearance === item.id ? 'brightness(100%)' : 'brightness(75%)' }}
                  onClick={() => item.onClick()}
                >
                  <img
                    src={appearance === item.id ? item.appearanceSrc : item.appearanceNoColorSrc}
                    alt=""
                    draggable="false"
                    width={67}
                    height={44}
                  />
                </Box>
                <Typography
                  variant="overline"
                  color={appearance === item.id ? theme.palette.grey[900] : theme.palette.grey[500]}
                >
                  {item.label}
                </Typography>
              </Stack>
            ))}
          </FormGroup>
        </YaddsFormItem>
        {/* IP or QuickConnect ID */}
        <YaddsFormItem label="地址 / QuickConnect ID">
          <FormGroup row>
            <FormControl>
              <Select
                size="small"
                displayEmpty
                MenuProps={{
                  elevation: 0,
                  sx: {
                    '& .MuiPaper-root': {
                      boxShadow: '0 0 24px rgba(0,0,0,0.08), 0 8px 8px rgba(0,0,0,0.04)',
                    },
                  },
                }}
                value={address}
                sx={{ fontSize: 14, minWidth: theme.spacing(40) }}
                onChange={(event) => setAddress(event.target.value as string)}
              >
                <MenuItem disableRipple value={0} sx={{ fontSize: 14, fontWeight: 500 }}>
                  192.168.100.2 - Lina
                </MenuItem>
                <MenuItem disableRipple value={1} sx={{ fontSize: 14, fontWeight: 500 }}>
                  192.168.100.2 - Luna
                </MenuItem>
                <MenuItem disableRipple value={2} sx={{ fontSize: 14, fontWeight: 500 }}>
                  192.168.101.2 - Minara
                </MenuItem>
                <MenuItem disableRipple value={3} sx={{ fontSize: 14, fontWeight: 500 }}>
                  minara-nas - Minara
                </MenuItem>
              </Select>
            </FormControl>
            <Button size="small" sx={{ marginLeft: theme.spacing(1) }} onClick={() => {}}>
              添加
            </Button>
          </FormGroup>
        </YaddsFormItem>
        {/* i18n */}
        <YaddsFormItem label="语言">
          <FormGroup>
            {i18nItemArray.map((item: I18nItem) => (
              <FormControlLabel
                key={item.id}
                label={<Typography variant="subtitle2">{item.label}</Typography>}
                control={<Radio size="small" defaultChecked={item.id === i18n} />}
                onClick={item.onClick}
              />
            ))}
          </FormGroup>
        </YaddsFormItem>
        {/* system */}
        <YaddsFormItem label="应用程序">
          <FormGroup>
            <FormControlLabel
              label={<Typography variant="subtitle2">登录时启动</Typography>}
              control={<Checkbox size="small" defaultChecked={isAutoLaunch} />}
              onClick={() => setIsAutoLaunch(!isAutoLaunch)}
            />
            <FormControlLabel
              label={<Typography variant="subtitle2">自动更新</Typography>}
              control={<Checkbox size="small" defaultChecked={isAutoUpdate} />}
              onClick={() => setIsAutoUpdate(!isAutoUpdate)}
            />
            <FormHelperText>当前版本 {window.electron.appVersion.get()}</FormHelperText>
          </FormGroup>
        </YaddsFormItem>
        {/* About */}
        <YaddsFormItem label="关于" hasMargin={false}>
          <FormGroup>
            <Stack flexDirection="row">
              <Typography variant="subtitle2">许可证</Typography>
              <Typography
                variant="subtitle2"
                color={theme.palette.primary.main}
                sx={{ marginLeft: theme.spacing(1) }}
                onClick={() =>
                  window.electron.userBrowser.openUrl('https://github.com/shensven/Yadds/blob/main/LICENSE')
                }
              >
                本拷贝通过 GPL-3.0 协议授权
              </Typography>
            </Stack>
            <Stack flexDirection="row" marginTop={theme.spacing(1)}>
              <Typography variant="subtitle2">开发者</Typography>
              <Typography
                variant="subtitle2"
                color={theme.palette.primary.main}
                sx={{ marginLeft: theme.spacing(1) }}
                onClick={() => window.electron.userBrowser.openUrl('https://github.com/shensven')}
              >
                @SvenFE
              </Typography>
            </Stack>
            <FormHelperText>Made with ❤️ in Kunming</FormHelperText>
          </FormGroup>
        </YaddsFormItem>
      </Stack>
    </YaddsMain>
  );
};

export default Settings;
