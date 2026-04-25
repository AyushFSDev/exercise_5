import { device, expect, element, by } from 'detox';
import { freshLaunch, waitVisible } from '../helper';

describe('Splash Screen', () => {
  // TC_SPLASH_001
  it('TC_SPLASH_001 - splash loader visible on launch', async () => {
    await freshLaunch();
    await expect(element(by.id('splashLoader'))).toBeVisible();
  });

  // TC_SPLASH_002
  it('TC_SPLASH_002 - navigates to login after splash', async () => {
    await freshLaunch();
    await waitVisible('emailInput', 10000);
    await expect(element(by.id('emailInput'))).toBeVisible();
  });

  // TC_SPLASH_003
  it('TC_SPLASH_003 - app stable across multiple relaunches', async () => {
    for (let i = 0; i < 3; i++) {
      await freshLaunch();
      await waitVisible('emailInput', 10000);
    }
  });
});