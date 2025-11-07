# nearGrid Project Rules

테스트2

## 1. Directory Structure

```
src/
  app/              # Global app setup (Navigation, Provider)
  lib/              # Shared instances (axios, query helpers)
  features/{domain}/
    api/            # API endpoints
    types.ts        # Type definitions
    keys.ts         # Query keys
    mappers.ts      # DTO ↔ Domain mappers
    hooks/          # React Query hooks
    components/     # Domain UI components
    lists/          # (optional) list + preset combos
  screens/          # Navigation entry screens (keep thin)
  common/
    components/     # Shared UI (AppText, AppButton, etc.)
    hooks/          # Reusable hooks
    styles/         # Colors, fonts, theme
  utils/            # Pure utility functions
```

## 2. Text & Translation

- Do not use `<Text>` directly → Always use `<AppText />`
- Usage:
  ```tsx
  <AppText variant="title" messageType="STR_THREAD" />
  <AppText variant="body" messageType="STR_CUSTOM" />
  ```
- `AppText` internally uses `useTranslation` → No need to import `t` in screens.

## 3. Shared Components

- Location: `src/common/components/`
- Core set: AppText, AppButton, AppInput, AppModal, AppCard, AppListItem
- Extended set: AppImage, AppBadge, AppToast, AppLoader, AppCheckbox, AppRadio, AppSwitch

## 4. API & Query

- API functions → `src/features/{domain}/api/`
- Naming: `action + target` (e.g., `getThreadList`, `postThreadLike`)
- Query keys → `src/features/{domain}/keys.ts`
- DTO ↔ Domain mapping → `src/features/{domain}/mappers.ts`

## 5. Hooks

- React Query hooks: `src/features/{domain}/hooks/`
  - Example: `useThread`, `useFeed`, `useToggleLike`
- Global hooks: `src/common/hooks/`
- Naming: Always prefix with `use`

## 6. Styles

- Colors/fonts/spacing → `src/common/styles/`
- No hardcoded colors in components → Always import
- Layout uses flex by default
- Dark mode:
  - Start with single (light) mode
  - Keep tokens ready for dark mode switch later

## 7. Screens

- Only navigation entry points
- Keep thin: just data fetch + feature composition
- Business logic must stay inside feature hooks

## 8. Utils

- Only pure functions in `src/utils/`
- No external state or side effects

## 9. Auth & Token Management

1. Token Storage:
   - Access/Refresh tokens saved in AsyncStorage
   - Stored only via `src/features/member/utils/tokenStorage.ts`
2. Login Flow:
   - On app start, if refresh token exists → auto-login attempt
   - If failed → navigate to login screen
3. Axios:
   - Global axios instance at `src/lib/http/axios.ts`
   - Attaches Authorization header
   - On 401 → calls refresh API (`member/api/refreshApi.ts`) → retries request
4. Logout:
   - `tokenStorage.clearTokens()` then navigate to login
   - Unified hook: `useLogout`
5. Naming:
   - API: `signinApi`, `signupApi`, `refreshApi`
   - Hooks: `useSignin`, `useSignup`, `useRefresh`, `useLogout`

## 10. Error Handling

- All errors are shown via Toast (AppToast)
- Display at the top of the screen

## 11. Navigation

- Standard structure: RootNavigator → TabNavigator → StackNavigator

## 12. Testing

- No automated test setup required
- Manual QA (developer testing)

## 13. i18n Key Naming

- Prefix: `STR_`
- All uppercase
- Prefer domain prefix
  - Example: `STR_THREAD_TITLE`, `STR_MEMBER_SIGNIN`, `STR_CHAT_SEND`

## 14. Icons

- All icons centralized in `AppIcon` (`src/common/components/AppIcon.tsx`)
- Use Ionicons internally
- Screens/components never import icon library directly
- Usage:
  ```tsx
  <AppIcon name="chatbubble-outline" size={24} color={COLORS.text} />
  ```
