import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'
import { vi } from 'vitest'
import { beforeEach } from 'node:test'
import * as Scry from 'scryfall-sdk'

import scry from '../data/scryfallClient';

vi.mock('../data/scryfallClient', () => ({
    __esModule: true,
    default: mockDeep<typeof Scry>(),
  }))
  
  beforeEach(() => {
    mockReset(scryMock)
  })
  
  export const scryMock = scry as unknown as DeepMockProxy<typeof Scry>