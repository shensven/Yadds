import { atom } from 'jotai';

export interface Task {
  additional: {
    detail: {
      completed_time: number; // 1652972006
      connected_leechers: number; // 0
      connected_peers: number; // 0
      connected_seeders: number; // 0
      create_time: number; // 1652971223
      destination: string; // "your/path"
      unzip_password: string;
      seed_elapsed: number; // 5400
      started_time: number; // 1652971324
      total_peers: number; // 0
      total_pieces: number; // 720
      uri: string; //  "magnet:?xt=urn:btih:65042f531b707fexxxxxxxxxxxxxxxxxx"
      waiting_seconds: number; // 0
    };
    transfer: {
      downloaded_pieces: number; // 0
      size_downloaded: number; // 6015112485
      size_uploaded: number; // 1860587615
      speed_download: number; // 0
      speed_upload: number; // 0
    };
  };
  id: string; // "dbid_1220"
  size: number; // 6015112485
  status: number | string; // 5
  title: string; //  "Fantastic.Beasts.The.Secrets.of.Dumbledore.2022.1080p.KORSUB.HDRip.x264.AAC2.0-SHITBOX"
  type: string; // "bt"
  username: string; // "your-dsm-username"
}

export const atomTasks = atom<Task[]>([]);

export const atomFetchStatus = atom<'stopped' | 'pending' | 'polling' | 'switching'>('stopped');
