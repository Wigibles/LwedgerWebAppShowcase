# 📦 Lwedger APK Storage Folder

Place your Android APK build files in this `public` folder so that visitors to the Lwedger Showcase web application can download and install them directly!

---

### Supported File Names:
1. **`Lwedger-v1.0-release.apk`** *(Recommended for release builds)*
2. **`app-debug.apk`** *(Recommended for testing/debug builds)*

---

### How to Copy from Android Studio:
After building your APK in Android Studio (**Build > Build Bundle(s) / APK(s) > Build APK(s)**):
- Copy from: `c:\Users\HP\AndroidStudioProjects\Lwedger\app\build\outputs\apk\debug\app-debug.apk`
- Paste into: `c:\Users\HP\Documents\Gasty\public\app-debug.apk` (or rename to `Lwedger-v1.0-release.apk`)

---

### Vite Static Serving:
Any file placed in this `public/` folder will be served automatically at the root URL (e.g., `http://localhost:5173/Lwedger-v1.0-release.apk` or `https://your-domain.vercel.app/Lwedger-v1.0-release.apk`).
