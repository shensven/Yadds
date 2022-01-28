import { SvgIcon, SvgIconProps } from '@mui/material';

const ArrowDownOutlineIcon: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon {...props} viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
        d="M112 268l144 144 144-144M256 392V100"
      />
    </SvgIcon>
  );
};

export default ArrowDownOutlineIcon;
