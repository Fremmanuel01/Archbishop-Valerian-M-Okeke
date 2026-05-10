import * as migration_20260502_155358 from './20260502_155358';
import * as migration_20260502_164915 from './20260502_164915';
import * as migration_20260502_204115 from './20260502_204115';
import * as migration_20260503_132233 from './20260503_132233';
import * as migration_20260507_103203 from './20260507_103203';
import * as migration_20260508_021815 from './20260508_021815';
import * as migration_20260508_173000 from './20260508_173000';
import * as migration_20260510_180000 from './20260510_180000';

export const migrations = [
  {
    up: migration_20260502_155358.up,
    down: migration_20260502_155358.down,
    name: '20260502_155358',
  },
  {
    up: migration_20260502_164915.up,
    down: migration_20260502_164915.down,
    name: '20260502_164915',
  },
  {
    up: migration_20260502_204115.up,
    down: migration_20260502_204115.down,
    name: '20260502_204115',
  },
  {
    up: migration_20260503_132233.up,
    down: migration_20260503_132233.down,
    name: '20260503_132233',
  },
  {
    up: migration_20260507_103203.up,
    down: migration_20260507_103203.down,
    name: '20260507_103203',
  },
  {
    up: migration_20260508_021815.up,
    down: migration_20260508_021815.down,
    name: '20260508_021815'
  },
  {
    up: migration_20260508_173000.up,
    down: migration_20260508_173000.down,
    name: '20260508_173000',
  },
  {
    up: migration_20260510_180000.up,
    down: migration_20260510_180000.down,
    name: '20260510_180000',
  },
];
