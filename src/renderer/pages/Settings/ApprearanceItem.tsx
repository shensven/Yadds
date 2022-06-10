import React from 'react';
import darwinLight from '../assets/Settings/darwin_light.png';
import darwinDark from '../assets/Settings/darwin_dark.png';
import darwinFollowSystem from '../assets/Settings/darwin_follow_system.png';
import win32Light from '../assets/Settings/win32_light.png';
import win32Dark from '../assets/Settings/win32_dark.png';
import win32FollowSystem from '../assets/Settings/win32_follow_system.png';
import gnomeLight from '../assets/Settings/gnome_light.png';
import gnomeDark from '../assets/Settings/gnome_dark.png';
import gnomeFollowSystem from '../assets/Settings/gnome_follow_system.png';

interface IProps {
  appearance: 'light' | 'dark' | 'system';
  os: 'darwin' | 'win32' | 'linux';
}

const ApprearanceItem: React.FC<IProps> = (props) => {
  const { appearance, os } = props;

  if (os === 'darwin') {
    switch (appearance) {
      case 'light':
        return <img src={darwinLight} alt="" draggable="false" width={67} height={44} />;
      case 'dark':
        return <img src={darwinDark} alt="" draggable="false" width={67} height={44} />;
      case 'system':
        return <img src={darwinFollowSystem} alt="" draggable="false" width={67} height={44} />;
      default:
        return <img src={darwinLight} alt="" draggable="false" width={67} height={44} />;
    }
  } else if (os === 'win32') {
    switch (appearance) {
      case 'light':
        return <img src={win32Light} alt="" draggable="false" width={67} height={44} />;
      case 'dark':
        return <img src={win32Dark} alt="" draggable="false" width={67} height={44} />;
      case 'system':
        return <img src={win32FollowSystem} alt="" draggable="false" width={67} height={44} />;
      default:
        return <img src={win32Light} alt="" draggable="false" width={67} height={44} />;
    }
  } else {
    switch (appearance) {
      case 'light':
        return <img src={gnomeLight} alt="" draggable="false" width={67} height={44} />;
      case 'dark':
        return <img src={gnomeDark} alt="" draggable="false" width={67} height={44} />;
      case 'system':
        return <img src={gnomeFollowSystem} alt="" draggable="false" width={67} height={44} />;
      default:
        return <img src={gnomeLight} alt="" draggable="false" width={67} height={44} />;
    }
  }
};

export default ApprearanceItem;
