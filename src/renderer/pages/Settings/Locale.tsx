import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, FormGroup, MenuItem, Select, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RowItem from './RowItem';
import { atomPersistenceLocaleName, LocaleName } from '../../atoms/atomUI';

interface SettingsLocale {
  localeName: LocaleName;
  label: string;
}

const Locale: React.FC = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const [localeName, setLocaleName] = useAtom(atomPersistenceLocaleName);

  const [hasSelecterForLocale, setHasSelecterForLocale] = useState<boolean>(false);

  const localeNameList: SettingsLocale[] = [
    { localeName: 'en', label: 'English' },
    { localeName: 'zh_CN', label: '简体中文' },
    { localeName: 'zh_TW', label: '繁體中文' },
    { localeName: 'ja_JP', label: '日本語' },
  ];

  const handleLocale = (targetLocaleName: LocaleName) => {
    i18n.changeLanguage(targetLocaleName);
    setLocaleName(targetLocaleName);
    setHasSelecterForLocale(false);
  };

  return (
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
  );
};

export default Locale;
