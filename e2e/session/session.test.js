import { device, expect, element, by } from 'detox';
import { freshLaunch, relaunch, waitVisible, typeInto, tapById } from '../helper';

describe('Session Handling', () => {
  // TC_SESSION_001 - session persists across restarts
  it('TC_SESSION_001 - session persists after app restart', async () => {
    await freshLaunch();
    await waitVisible('emailInput', 12000);
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');
    await waitVisible('instituteScreen', 10000);
    await element(by.id('instituteItem_0')).tap();
    try {
      await waitVisible('roleSelectScreen', 5000);
      await element(by.id('roleItem_0')).tap();
    } catch {}
    await waitVisible('dashboardScreen', 10000);

    // Storage delete kiye bina restart
    await relaunch();

    // Dashboard, instituteScreen, ya roleSelectScreen — login pe nahi hona chahiye
    try {
      await waitVisible('dashboardScreen', 10000);
      await expect(element(by.id('dashboardScreen'))).toBeVisible();
    } catch {
      try {
        await waitVisible('roleSelectScreen', 5000);
        await expect(element(by.id('roleSelectScreen'))).toBeVisible();
      } catch {
        await waitVisible('instituteScreen', 5000);
        await expect(element(by.id('instituteScreen'))).toBeVisible();
      }
    }
  });

  // TC_SESSION_002 - fresh launch bina token ke login pe jata hai
  it('TC_SESSION_002 - fresh launch without token redirects to Login', async () => {
    await freshLaunch();
    await waitVisible('emailInput', 12000);
    await expect(element(by.id('emailInput'))).toBeVisible();
  });
});