import { device, expect, element, by } from 'detox';
import { freshLaunch, waitVisible } from '../helper';

// Test suite for validating device-specific configurations and layout stability
describe('Device & Layout', () => {
  beforeEach(async () => {
    // Start with a clean application state and wait for the entry screen
    await freshLaunch();
    await waitVisible('emailInput');
  });

  afterEach(async () => {
    // Reset device orientation to the default portrait mode after each test case
    await device.setOrientation('portrait');
  });

  // Verify that UI components are correctly rendered in the standard portrait orientation
  it('TC_DEVICE_001 - phone portrait layout renders correctly', async () => {
    await expect(element(by.id('emailInput'))).toBeVisible();
    await expect(element(by.id('darkModeToggle'))).toBeVisible();
  });

  // Verify that the login screen remains functional and components stay visible during rotation
  it('TC_DEVICE_004 - login screen stable on orientation change', async () => {
    // Transition to landscape and verify UI persistence
    await device.setOrientation('landscape');
    await expect(element(by.id('emailInput'))).toBeVisible();

    // Revert to portrait and verify UI persistence
    await device.setOrientation('portrait');
    await expect(element(by.id('emailInput'))).toBeVisible();
  });
});
