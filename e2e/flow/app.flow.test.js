import { device, expect, element, by, waitFor } from 'detox';
import { freshLaunch, waitVisible, typeInto, tapById } from '../helper';

describe('Full App Flow', () => {
  // TC_FLOW_001 - complete navigation: Login → Institute → Role → Dashboard
  it('TC_FLOW_001 - Login → Institute → Role → Dashboard', async () => {
    await freshLaunch();
    await waitVisible('emailInput', 12000);
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');

    // Could go to instituteScreen or directly to dashboardScreen (1 institute + 1 role)
    try {
      await waitVisible('instituteScreen', 10000);
      await element(by.id('instituteItem_0')).tap();
    } catch {
      // Single institute auto-selected — skip
    }

    // Could go to roleSelect if multiple roles
    try {
      await waitVisible('roleSelectScreen', 5000);
      await element(by.id('roleItem_0')).tap();
    } catch {
      // Single role auto-selected — skip
    }

    await waitFor(element(by.id('dashboardScreen')))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });

  // TC_FLOW_002 - back press on Dashboard stays on Dashboard
  it('TC_FLOW_002 - back press on Dashboard does not go to Login', async () => {
    await waitFor(element(by.id('dashboardScreen')))
      .toBeVisible()
      .withTimeout(10000);
    await device.pressBack();
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });
});