import { device, expect, element, by } from 'detox';
import { freshLaunch, waitVisible } from '../helper';

describe('Device & Layout', () => {
  beforeEach(async () => {
    await freshLaunch();
    await waitVisible('emailInput');
  });

  afterEach(async () => {
    await device.setOrientation('portrait');
  });

  // TC_DEVICE_001 - phone portrait layout
  it('TC_DEVICE_001 - phone portrait layout renders correctly', async () => {
    await expect(element(by.id('emailInput'))).toBeVisible();
    await expect(element(by.id('darkModeToggle'))).toBeVisible();
  });

  // TC_DEVICE_004 - orientation rotate pe stable rehta hai
  it('TC_DEVICE_004 - login screen stable on orientation change', async () => {
    await device.setOrientation('landscape');
    await expect(element(by.id('emailInput'))).toBeVisible();
    await device.setOrientation('portrait');
    await expect(element(by.id('emailInput'))).toBeVisible();
  });
});