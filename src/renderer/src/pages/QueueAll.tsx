import { Box, Drawer, List } from '@mui/material';
import YaddsMain from '../containers/YaddsMain';
import MainListItem from '../components/listItem/MainListItem';

const QueueAll: React.FC = () => {
  const arr: string[] = [
    'No.Time.To.Die.2021.2160p.WEBRip.x265.10bit.SDR.DDP5.1.Atmos-SWTYBLZ.mkv',
    'The.Eight.Hundred.2020.CHINESE.1080p.BluRay.x264-iKiW.mkv',
    'City.Hall.2020.1080p.WEB-DL.AAC2.0.H.264-PTP.mkv',
    'Shock.Wave.II.2021.WEB-DL.4k.H265.DD5.1-HDSWEB.mkv',
    'Chungking.Express.1994.Criterion.Collection.1080p.BluRay.x264.DTS-WiKi.mkv',
    'Assassins.2020.1080p.AMZN.WEBRip.DDP5.1.x264-NOGRP.mkv',
    'Never.Rarely.Sometimes.Always.2020.1080p.AMZN.WEB-DL.DDP5.1.H.264-NTG.mkv',
    'Inception.2010.BluRay.1080p.DTS.2Audio.x264-CHD.mkv',
    'Venom.Let.There.Be.Carnage.2021.2160p.WEB-DL.DDP5.1.Atmos.HEVC-TEPES.mkv',
  ];

  return (
    <YaddsMain hasAppbar>
      <List>
        {arr.map((item: string, index: number) => (
          <MainListItem item={item} index={index} />
        ))}
      </List>
      <Drawer anchor="right" open={false} onClose={() => {}}>
        <Box sx={{ width: 480 }}>list(anchor)</Box>
      </Drawer>
    </YaddsMain>
  );
};

export default QueueAll;
