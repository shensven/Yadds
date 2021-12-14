import { SvgIcon, SvgIconProps } from '@mui/material';

const AddOutlineIcon: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon {...props} viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M256 112v288M400 256H112"
      />
    </SvgIcon>
  );
};

export default AddOutlineIcon;
