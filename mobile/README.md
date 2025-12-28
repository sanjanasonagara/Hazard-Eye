# Hazard-Eye Mobile App

Offline-first mobile application for refinery workers to detect hazards using on-device ML (ONNX Runtime).

## 📱 Features
- **Offline-First**: All data stored locally (SQLite + FileSystem) until network is available.
- **On-Device Inference**: Uses ONNX Runtime (via Custom Native Module) to detect hazards without internet.
- **Secure**: Application-level encryption and secure token storage.
- **Sync Engine**: Auto-sync incidents when back online.

## 🛠 Tech Stack
- **Framework**: Expo (React Native) + TypeScript
- **Workflow**: Prebuild (CNG) + Custom Native Code (Kotlin)
- **ML Engine**: `onnxruntime-android`
- **Database**: `expo-sqlite`
- **Security**: `expo-secure-store`, `expo-crypto`

## 🚀 Setup & Build

### Prerequisites
- Node.js & npm
- JDK 17
- Android Studio (for compiling Native Modules)

### Installation
1. Install dependencies:
   ```bash

   npm install
   ```
   *Note: A postinstall script automatically grants execution permissions to `android/gradlew`.*
2. Generate Native Projects (Prebuild):
   ```bash
   npx expo prebuild --platform android
   ```
   *Note: This generates the `android/` directory containing the Custom Kotlin ONNX Module.*

### Running the App
- **Development (Sim/Device)**:
  ```bash
  npx expo run:android
  ```
  *Use `run:android` instead of `start` because we have custom native code.*

### 🧪 Testing
- Run Unit Tests:
  ```bash
  npm test
  ```

## 📂 Project Structure
- `app/`: Expo Router screens (Pages)
- `src/services/`: Core logic (Database, Sync)
- `src/modules/`: TypeScript definitions for Native Modules
- `android/`: Native Android project (Kotlin)
  - `.../OnnxModule.kt`: The bridge to ONNX Runtime

## ⚠️ Notes
- The ONNX Model used is currently "Simulated" for the purpose of the demo. To use a real model, place the `.ort` file in assets and update `OnnxModule.kt`.
- The ONNX Model used is currently "Simulated" for the purpose of the demo. To use a real model, place the `.ort` file in assets and update `OnnxModule.kt`.
- API Base URL is dynamically determined in `src/services/api.ts` to support both Emulators (10.0.2.2) and Physical Devices (Host IP via Expo constants).

## 🔧 Troubleshooting
- **Gradle Permissions**: If `npm run android` fails with `EACCES`, verify `chmod +x android/gradlew` was executed.
- **ADB Broken Pipe**: If installation fails, restart ADB: `adb kill-server && adb start-server`.
- **Port Mapping**: Ensure your backend service is running on Port 5200.
