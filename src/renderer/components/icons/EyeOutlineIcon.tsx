import { SvgIcon, SvgIconProps } from '@mui/material';

const EyeOutlineIcon: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon {...props} viewBox="0 0 512 512">
      <path
        d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" />
    </SvgIcon>
  );
};

export default EyeOutlineIcon;
