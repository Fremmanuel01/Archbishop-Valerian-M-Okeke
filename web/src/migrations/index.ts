import * as migration_20260502_155358 from './20260502_155358';
import * as migration_20260502_164915 from './20260502_164915';

export const migrations = [
  {
    up: migration_20260502_155358.up,
    down: migration_20260502_155358.down,
    name: '20260502_155358',
  },
  {
    up: migration_20260502_164915.up,
    down: migration_20260502_164915.down,
    name: '20260502_164915'
  },
];
