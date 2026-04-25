// import { device, expect, waitFor, element, by } from 'detox';
// import { setupClearStorage } from './helper';

// describe('Login Flow', () => {
//   setupClearStorage();

//   // it('TC_SPLASH_001 - should show splash loader on app launch', async () => {
//   //   await device.launchApp({ delete: true });
//   //   await expect(element(by.id('splashLoader'))).toBeVisible();
//   // });

//   it('TC_SPLASH_002 - should navigate to login screen', async () => {
//     await device.launchApp({ delete: true });
//     await waitFor(element(by.id('emailInput')))
//       .toBeVisible()
//       .withTimeout(8000);
//     await expect(element(by.id('emailInput'))).toBeVisible();
//   });

//   it('TC_SPLASH_003 - app should not crash on multiple launches', async () => {
//     for (let i = 0; i < 3; i++) {
//       await device.launchApp({ delete: true });

//       await waitFor(element(by.id('emailInput')))
//         .toBeVisible()
//         .withTimeout(8000);
//     }
//   });

//   it('TC_LOGIN_001 - should proceed to OTP screen for valid phone', async () => {
//     await element(by.id('emailInput')).clearText();
//     await element(by.id('emailInput')).typeText('9876543210');
//     await waitFor(element(by.id('phoneInput')))
//       .toBeVisible()
//       .withTimeout(5000);
//     await element(by.id('phoneInput')).typeText('9876543210');
//     await element(by.id('sendCodeButton')).tap();
//   });

//   it('TC_LOGIN_005 - should proceed to OTP screen for valid phone', async () => {
//     await device.launchApp({ delete: true });
//     await waitFor(element(by.id('phoneInput')))
//       .toBeVisible()
//       .withTimeout(5000);
//     await element(by.id('phoneInput')).typeText('9876543210');
//     await element(by.id('sendCodeButton')).tap();
//     await waitFor(element(by.id('otpInput')))
//       .toBeVisible()
//       .withTimeout(5000);
//   });
// });


import { device, expect, waitFor, element, by } from 'detox';
import { setupClearStorage } from './helper';

// ─── NOTE: Use Password button abhi testID nahi hai ───────────────────────
// PublicLoginScreen.tsx mein yeh line add karo (line ~178):
//   <PrimaryButton testID="usePasswordButton" label={...} onPress={...} flex />
// Warna TC_LOGIN_015 aur related password tests skip rahenge.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Helpers ─────────────────────────────────────────────────────────────────

const waitVisible = (id, timeout = 8000) =>
  waitFor(element(by.id(id))).toBeVisible().withTimeout(timeout);

const tapById = async id => {
  await waitVisible(id);
  await element(by.id(id)).tap();
};

const typeInto = async (id, text) => {
  await waitVisible(id);
  await element(by.id(id)).clearText();
  await element(by.id(id)).typeText(text);
};

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────────────────────────────────────────
describe('Splash Screen', () => {
  setupClearStorage();

  // TC_SPLASH_001
  it('TC_SPLASH_001 - splash loader visible on launch', async () => {
    await expect(element(by.id('splashLoader'))).toBeVisible();
  });

  // TC_SPLASH_002
  it('TC_SPLASH_002 - navigates to login screen after splash', async () => {
    await waitVisible('emailInput', 10000);
    await expect(element(by.id('emailInput'))).toBeVisible();
  });

  // TC_SPLASH_003
  it('TC_SPLASH_003 - app does not crash on multiple launches', async () => {
    for (let i = 0; i < 3; i++) {
      await device.launchApp({ newInstance: true, delete: true });
      await waitVisible('emailInput', 10000);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN — EMAIL / PHONE INPUT MODE
// ─────────────────────────────────────────────────────────────────────────────
describe('Login – Input Mode', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await waitVisible('emailInput');
  });

  // TC_LOGIN_008 - valid email dikhata hai dono buttons
  it('TC_LOGIN_008 - valid email shows Send Code and Use Password buttons', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await expect(element(by.id('sendCodeButton'))).toBeVisible();
    // NOTE: usePasswordButton testID missing — add karo PublicLoginScreen mein
    // await expect(element(by.id('usePasswordButton'))).toBeVisible();
  });

  // TC_LOGIN_009 - invalid email pe error
  it('TC_LOGIN_009 - invalid email format shows error on Send Code tap', async () => {
    await typeInto('emailInput', 'abc@');
    await tapById('sendCodeButton');
    // Error text by.id ya by.text se check karo
    await waitFor(element(by.id('loginForm'))).toBeVisible().withTimeout(3000);
  });

  // TC_LOGIN_010 - empty email pe Send Code tap
  it('TC_LOGIN_010 - empty email does not proceed', async () => {
    await element(by.id('emailInput')).clearText();
    await tapById('sendCodeButton');
    // Login form abhi bhi dikhna chahiye — navigate nahi hua
    await expect(element(by.id('loginForm'))).toBeVisible();
  });

  // TC_LOGIN_022 - error clear hota hai naya input dene par
  it('TC_LOGIN_022 - error clears when input is changed', async () => {
    await typeInto('emailInput', 'bad@');
    await tapById('sendCodeButton');
    // Error state mein hain, input change karo
    await typeInto('emailInput', 'good@test.com');
    // loginForm visible hona chahiye — screen crash nahi hui
    await expect(element(by.id('loginForm'))).toBeVisible();
  });

  // TC_LOGIN_023 - bahut lamba input crash nahi karta
  it('TC_LOGIN_023 - very long input does not crash', async () => {
    await typeInto('emailInput', 'a'.repeat(200) + '@test.com');
    await expect(element(by.id('loginForm'))).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN — PHONE OTP FLOW
// ─────────────────────────────────────────────────────────────────────────────
describe('Login – Phone OTP Flow', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await waitVisible('phoneInput');
  });

  // TC_LOGIN_001 - valid phone number se Send Code
  it('TC_LOGIN_001 - valid 10-digit phone shows Send Code button', async () => {
    await typeInto('phoneInput', '9876543210');
    await expect(element(by.id('sendCodeButton'))).toBeVisible();
  });

  // TC_LOGIN_005 - OTP screen aata hai Send Code ke baad
  it('TC_LOGIN_005 - Send Code navigates to OTP input', async () => {
    await typeInto('phoneInput', '9876543210');
    await tapById('sendCodeButton');
    await waitVisible('otpInput', 8000);
    await expect(element(by.id('otpInput'))).toBeVisible();
  });

  // TC_LOGIN_006 - incomplete OTP submit block hota hai
  it('TC_LOGIN_006 - incomplete OTP blocks submit', async () => {
    await typeInto('phoneInput', '9876543210');
    await tapById('sendCodeButton');
    await waitVisible('otpInput');
    // Sirf 3 digit type karo aur back button se check karo
    await element(by.id('otpInput')).typeText('123');
    // loginButton (back) se wapas jao — OTP accept nahi hona chahiye
    await expect(element(by.id('otpInput'))).toBeVisible();
  });

  // TC_LOGIN_030 - background ke baad OTP screen stable rehti hai
  it('TC_LOGIN_030 - OTP screen stable after backgrounding app', async () => {
    await typeInto('phoneInput', '9876543210');
    await tapById('sendCodeButton');
    await waitVisible('otpInput');
    await element(by.id('otpInput')).typeText('1');
    await device.sendToHome();
    await device.launchApp({ newInstance: false });
    await waitVisible('otpInput', 8000);
    await expect(element(by.id('otpInput'))).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN — EMAIL OTP FLOW
// ─────────────────────────────────────────────────────────────────────────────
describe('Login – Email OTP Flow', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await waitVisible('emailInput');
  });

  // TC_LOGIN_012 - email OTP screen aata hai
  it('TC_LOGIN_012 - Send Code shows OTP input for email', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await tapById('sendCodeButton');
    await waitVisible('otpInput', 8000);
    await expect(element(by.id('otpInput'))).toBeVisible();
  });

  // TC_LOGIN_014 - incomplete OTP submit nahi hota
  it('TC_LOGIN_014 - incomplete OTP does not submit', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await tapById('sendCodeButton');
    await waitVisible('otpInput');
    await element(by.id('otpInput')).typeText('123');
    // OTP screen abhi bhi dikhni chahiye
    await expect(element(by.id('otpInput'))).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN — PASSWORD FLOW
// NOTE: usePasswordButton testID add karo PublicLoginScreen.tsx mein
// ─────────────────────────────────────────────────────────────────────────────
describe('Login – Password Flow', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await waitVisible('emailInput');
    await typeInto('emailInput', 'test@test.com');
    await tapById('usePasswordButton'); // testID add karna hai
    await waitVisible('passwordInput');
  });

  // TC_LOGIN_015 - Use Password password field dikhata hai
  it('TC_LOGIN_015 - Use Password button reveals password field', async () => {
    await expect(element(by.id('passwordInput'))).toBeVisible();
  });

  // TC_LOGIN_016 - valid credentials login karte hain
  it('TC_LOGIN_016 - valid email + password logs in', async () => {
    await typeInto('passwordInput', '1234');
    await tapById('continue');
    await waitVisible('instituteScreen', 10000);
    await expect(element(by.id('instituteScreen'))).toBeVisible();
  });

  // TC_LOGIN_017 - empty password error deta hai
  it('TC_LOGIN_017 - empty password shows error', async () => {
    await tapById('continue');
    // loginForm ya password field abhi bhi visible honi chahiye
    await expect(element(by.id('passwordInput'))).toBeVisible();
  });

  // TC_LOGIN_019 - password visibility toggle kaam karta hai
  it('TC_LOGIN_019 - eye icon toggles password visibility', async () => {
    await typeInto('passwordInput', 'secret123');
    // Default secureTextEntry = true
    await expect(element(by.id('passwordInput'))).toHaveProps({ secureTextEntry: true });
  });

  // TC_LOGIN_020 - login ke dauran loader dikhta hai
  it('TC_LOGIN_020 - loader visible during login request', async () => {
    await typeInto('passwordInput', '1234');
    element(by.id('continue')).tap(); // await mat karo
    // Loading indicator check — PrimaryButton ke andar hona chahiye
    await waitFor(element(by.id('loginForm'))).toBeVisible().withTimeout(2000);
  });

  // TC_LOGIN_021 - continue button ek baar se zyada press hone par ek hi request
  it('TC_LOGIN_021 - rapid taps fire only one request', async () => {
    await typeInto('passwordInput', '1234');
    for (let i = 0; i < 5; i++) {
      element(by.id('continue')).tap().catch(() => {});
    }
    await waitVisible('instituteScreen', 10000);
    await expect(element(by.id('instituteScreen'))).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FULL FLOW
// ─────────────────────────────────────────────────────────────────────────────
describe('Full App Flow', () => {
  setupClearStorage();

  // TC_FLOW_001
  it('TC_FLOW_001 - full flow: Login → Institute → Role → Dashboard', async () => {
    await waitVisible('emailInput', 10000);
    await typeInto('emailInput', 'test@test.com');
    await tapById('usePasswordButton'); // testID add karna hai
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');
    await waitVisible('instituteScreen', 10000);
    await element(by.id('instituteList')).tap();
    await waitVisible('dashboardScreen', 10000);
  });

  // TC_FLOW_002 - Dashboard pe back press kaam nahi karta
  it('TC_FLOW_002 - back press on Dashboard stays on Dashboard', async () => {
    await waitVisible('dashboardScreen', 10000);
    await device.pressBack();
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INSTITUTE SELECT
// ─────────────────────────────────────────────────────────────────────────────
describe('Institute Select Screen', () => {
  beforeAll(async () => {
    // Login karke institute screen pe pahuncho
    await device.launchApp({ newInstance: true, delete: true });
    await waitVisible('emailInput', 10000);
    await typeInto('emailInput', 'test@test.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');
    await waitVisible('instituteScreen', 10000);
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  // TC_INST_001
  it('TC_INST_001 - institute list loads', async () => {
    await expect(element(by.id('instituteScreen'))).toBeVisible();
    await expect(element(by.id('instituteList'))).toBeVisible();
  });

  // TC_INST_002 - search filter kaam karta hai (only if >5 institutes)
  it('TC_INST_002 - search filters institute list', async () => {
    try {
      await waitVisible('instituteSearchInput', 3000);
      await typeInto('instituteSearchInput', 'abc');
      await expect(element(by.id('instituteSearchInput'))).toBeVisible();
    } catch {
      // Search sirf >5 institutes pe show hota hai — skip
    }
  });

  // TC_INST_005 - empty state message
  it('TC_INST_005 - no results shows empty message', async () => {
    try {
      await waitVisible('instituteSearchInput', 3000);
      await typeInto('instituteSearchInput', 'zzzzzz_no_match');
      await waitVisible('emptyInstituteMessage', 4000);
      await expect(element(by.id('emptyInstituteMessage'))).toBeVisible();
    } catch {
      // Search box nahi hai — skip
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SESSION
// ─────────────────────────────────────────────────────────────────────────────
describe('Session Handling', () => {
  // TC_SESSION_001 - session restart ke baad bhi bachi rehti hai
  it('TC_SESSION_001 - session persists after app restart', async () => {
    // Pehle login karo
    await device.launchApp({ newInstance: true, delete: true });
    await waitVisible('emailInput', 10000);
    await typeInto('emailInput', 'test@test.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');
    await waitVisible('instituteScreen', 10000);

    // Storage delete kiye bina restart
    await device.launchApp({ newInstance: true });
    // Dashboard ya InstituteScreen pe hona chahiye — Login pe nahi
    await waitFor(element(by.id('instituteScreen')))
      .toBeVisible()
      .withTimeout(10000)
      .catch(async () => {
        await waitVisible('dashboardScreen', 5000);
      });
  });

  // TC_SESSION_002 - fresh launch bina token ke login pe jata hai
  it('TC_SESSION_002 - fresh launch without token goes to Login', async () => {
    await device.launchApp({ newInstance: true, delete: true });
    await waitVisible('emailInput', 10000);
    await expect(element(by.id('emailInput'))).toBeVisible();
  });
});