# ZVHive Flutter App

## Run
```bash
cd apps/flutter_zvhive
flutter pub get
flutter run -d chrome # or a connected device
```

## Build APK (debug)
```bash
flutter build apk --debug --dart-define=API_BASE=https://zvhive-bl7rhxlu9-ven-s-projects.vercel.app
```

APK output: build/app/outputs/flutter-apk/app-debug.apk

## Configure API base
- Use `--dart-define=API_BASE=...` when running/building.