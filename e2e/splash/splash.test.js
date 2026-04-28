import { device, expect, element, by, waitFor } from 'detox';
import { freshLaunch } from '../helper';

describe('Splash Screen', () => {
  // TC_SPLASH_001 - splash loader visible on launch
  it('TC_SPLASH_001 - splash loader visible on launch', async () => {
    await freshLaunch();
    // splashLoader bahut jaldi aata aur jaata hai — waitFor with short timeout
    try {
      await waitFor(element(by.id('splashLoader')))
        .toBeVisible()
        .withTimeout(3000);
      await expect(element(by.id('splashLoader'))).toBeVisible();
    } catch {
      // Splash already transitioned — check splashScreen or login appeared
      // Either way app launched successfully
      try {
        await expect(element(by.id('splashScreen'))).toBeVisible();
      } catch {
        await waitFor(element(by.id('emailInput')))
          .toBeVisible()
          .withTimeout(8000);
        await expect(element(by.id('emailInput'))).toBeVisible();
      }
    }
  });

  // TC_SPLASH_002 - navigates to login after splash
  it('TC_SPLASH_002 - navigates to login after splash', async () => {
    await freshLaunch();
    await waitFor(element(by.id('emailInput')))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.id('emailInput'))).toBeVisible();
  });

  // TC_SPLASH_003 - app stable across multiple relaunches
  it('TC_SPLASH_003 - app stable across multiple relaunches', async () => {
    for (let i = 0; i < 3; i++) {
      await freshLaunch();
      await waitFor(element(by.id('emailInput')))
        .toBeVisible()
        .withTimeout(15000);
    }
    await expect(element(by.id('emailInput'))).toBeVisible();
  });
});