import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import UserNotifications

import GoogleMaps

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    // 🗺️ Google Maps 초기화
    GMSServices.provideAPIKey("AIzaSyCpZzBNQmFj2xki3Dz-gjylVQqKhE5Tmg4")

    // 🔥 Firebase 초기화
    FirebaseApp.configure()

    // 🔥 UNUserNotificationCenter delegate 설정
    UNUserNotificationCenter.current().delegate = self

    // ✅ React Native 초기화
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "papayasns",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // 🔔 포그라운드 알림 수신 처리
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    // 포그라운드에서도 알림 표시
    completionHandler([.alert, .badge, .sound])
  }

  // 🔔 알림 액션 처리
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    completionHandler()
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
