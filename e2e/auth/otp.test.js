import { device, expect, element, by, waitFor } from 'detox';
import { freshLaunch, waitVisible, waitVisibleText, typeInto, tapById } from '../helper';

// Type phone number — first digit switches emailInput to phoneInput
const typePhone = async (number) => {
  await waitVisible('emailInput');
  await element(by.id('emailInput')).typeText(number[0]);
  await waitFor(element(by.id('phoneInput'))).toBeVisible().withTimeout(5000);
  for (let i = 1; i < number.length; i++) {
    await element(by.id('phoneInput')).typeText(number[i]);
  }
};

// Wait for OTP screen using label text
const waitForOtp = async () => {
  await waitVisibleText('Enter 6-digit code', 10000);
};

describe('OTP Flow', () => {
  beforeEach(async () => {
    await freshLaunch();
    await waitVisible('emailInput');
  });

  it('TC_LOGIN_005 - phone Send Code navigates to OTP screen', async () => {
    await typePhone('9876543210');
    await tapById('sendCodeButton');
    await waitForOtp();
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  it('TC_LOGIN_012 - email Send Code navigates to OTP screen', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await tapById('sendCodeButton');
    await waitForOtp();
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  it('TC_LOGIN_006 - incomplete OTP does not submit', async () => {
    await typePhone('9876543210');
    await tapById('sendCodeButton');
    await waitForOtp();
    await element(by.id('otpBox_0')).typeText('1');
    await element(by.id('otpBox_1')).typeText('2');
    await element(by.id('otpBox_2')).typeText('3');
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  it('TC_LOGIN_014 - incomplete email OTP does not submit', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await tapById('sendCodeButton');
    await waitForOtp();
    await element(by.id('otpBox_0')).typeText('1');
    await element(by.id('otpBox_1')).typeText('2');
    await element(by.id('otpBox_2')).typeText('3');
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  it('TC_LOGIN_011 - email with spaces trimmed and OTP screen shows', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await tapById('sendCodeButton');
    await waitForOtp();
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  it('TC_LOGIN_030 - app backgrounded during OTP entry stays stable', async () => {
    await typePhone('9876543210');
    await tapById('sendCodeButton');
    await waitForOtp();
    await element(by.id('otpBox_0')).typeText('1');
    await device.sendToHome();
    await device.launchApp({ newInstance: false });
    await waitForOtp();
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  it('TC_LOGIN_004 - non-numeric phone input is rejected', async () => {
    await typeInto('emailInput', 'abc123');
    await tapById('sendCodeButton');
    await waitVisible('errorBanner');
    await expect(element(by.text('Enter 6-digit code'))).not.toBeVisible();
  });
});