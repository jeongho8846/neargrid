package com.papayasns

import android.os.Build
import android.os.Bundle
import android.graphics.Color
import androidx.core.view.WindowCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. 
   * This is used to schedule rendering of the component.
   */
  override fun getMainComponentName(): String = "papayasns"

  /**
   * ✅ Edge-to-Edge + 투명 시스템바 설정
   * - Android 10(API 29)+ 대응
   * - 상태바 / 네비게이션바 투명화
   * - 시스템 대비(contrast) 강제 해제
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // ✅ 시스템 인셋을 앱이 직접 처리하도록 (엣지-투-엣지)
    WindowCompat.setDecorFitsSystemWindows(window, false)

    // ✅ 상태바 / 네비게이션바 완전 투명
    window.statusBarColor = Color.TRANSPARENT
    window.navigationBarColor = Color.TRANSPARENT

    // ✅ (선택) 다크모드 대응 — API 30+에서 자동 대비 강제 방지
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.setDecorFitsSystemWindows(false)
    }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate].
   * We use [DefaultReactActivityDelegate] which allows you to enable
   * the New Architecture with a single boolean flag [fabricEnabled].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
