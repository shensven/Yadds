import { SvgIcon, SvgIconProps } from '@mui/material';

const EllipsisHorizontalIcon: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon {...props} viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="48" />
      <circle cx="416" cy="256" r="48" />
      <circle cx="96" cy="256" r="48" />
    </SvgIcon>
  );
};

export default EllipsisHorizontalIcon;
