# FormWise

FormWise is a computer vision project that helps users understand and improve their exercise form. It uses OpenCV and Google’s MediaPipe Pose model to track body landmarks while the user performs an exercise and uses those measurements to evaluate their technique. The results are passed to an LLM, which provides a short, personalized summary of what the user did well and what they could improve. The app also uses charts and diagrams to help users track their form and progress over time. The frontend was built with React Native using Expo Go.

## Project Demo

https://github.com/user-attachments/assets/7846c92d-d9c6-4975-9c5e-ba8c155157c5

## Get started

1. Clone Repository

   ```bash
   git clone
   ```
   
2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`

