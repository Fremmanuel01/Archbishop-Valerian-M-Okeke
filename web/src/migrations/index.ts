import * as migration_20260502_155358 from './20260502_155358';
import * as migration_20260502_164915 from './20260502_164915';
import * as migration_20260502_204115 from './20260502_204115';
import * as migration_20260503_132233 from './20260503_132233';
import * as migration_20260507_103203 from './20260507_103203';

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
    name: '20260507_103203'
  },
];
