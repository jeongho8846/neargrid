import { apiMember } from '../../../services/apiService';
import DeviceInfo from "react-native-device-info";
import { AuthResponseDto } from '../types';
import { Platform, Dimensions, NativeModules } from "react-native";

const getLanguage = () => {
  try {
    if (Platform.OS === "ios") {
      const settings = NativeModules.SettingsManager?.settings || {};
      const locale =
          settings.AppleLocale ||
          (Array.isArray(settings.AppleLanguages) && settings.AppleLanguages[0]);
      return locale || "en-US";
    } else {
      const locale = NativeModules.I18nManager?.localeIdentifier;
      return locale || "en-US";
    }
  } catch (e) {
    return "en-US";
  }
};
export const signIn = async (email: string, password: string) => {

  const deviceId = await DeviceInfo.getUniqueId();
  const deviceModel = DeviceInfo.getModel();
  const deviceOsType = Platform.OS === "ios" ? "IOS" : "ANDROID";
  const deviceOsVersion = DeviceInfo.getSystemVersion();

  const { width, height } = Dimensions.get("screen");
  const screenResolution = `${width}x${height}`;

  const language = getLanguage();
  const appVersion = DeviceInfo.getVersion();
  const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";


  const res = await apiMember.post<AuthResponseDto>('/member/signIn', {
    email,
    password,
    isAutoLogin: true, // 필요하면 설정

    ipAddress: null, // RN에서는 서버에서 추출하는게 더 안정적
    userAgent: null, // RN에서는 서버에서 추출하는게 더 안정적

    deviceId,
    deviceModel,
    deviceOsType,
    deviceOsVersion,

    screenResolution,
    language,
    appVersion,
    timezone,
  });
  return res.data;
};
