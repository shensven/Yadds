import { SvgIcon, SvgIconProps } from '@mui/material';

const ShapesOutlineIcon: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon {...props} viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M336 320H32L184 48l152 272zM265.32 194.51A144 144 0 11192 320"
      />
    </SvgIcon>
  );
};

export default ShapesOutlineIcon;
