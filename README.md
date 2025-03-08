# The Makers Lab - Robotics Education Platform

A modern, visually appealing, and user-friendly React Vite-based single-page web application for showcasing and selling robotics courses, learning kits, and electronic components.

## Features

- **User Authentication**: Firebase-based authentication with email login and password reset functionality.
- **Modern UI**: Dark theme with glassmorphism effects and gradient pink-red borders.
- **Responsive Design**: Fully responsive layout that works on all devices.
- **Interactive Animations**: Smooth animations and transitions using Framer Motion.
- **Key Sections**:
  - **Courses**: Showcasing robotics education courses.
  - **Learning Kits**: Comprehensive kits for hands-on learning.
  - **Electronic Components**: Individual components for DIY projects.
  - **About**: Company information and mission statement.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase
- **Animations**: Framer Motion
- **Routing**: React Router
- **UI Components**: Custom components with glassmorphism effects

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/themakerslab-website.git
   cd themakerslab-website
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Copy your Firebase config and update it in `src/firebase/config.ts`

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```
npm run build
```

The build files will be located in the `dist` directory.

## Project Structure

```
src/
├── assets/          # Static assets like images
├── components/      # Reusable UI components
│   ├── layout/      # Layout components (Navbar, Footer, etc.)
│   └── ui/          # UI components (Button, Card, etc.)
├── contexts/        # React contexts (AuthContext, etc.)
├── firebase/        # Firebase configuration
├── pages/           # Page components
├── App.jsx          # Main App component with routing
├── index.css        # Global styles
└── main.jsx         # Entry point
```

## Customization

- **Theme Colors**: Edit the colors in `tailwind.config.js`
- **Firebase Config**: Update the Firebase configuration in `src/firebase/config.ts`
- **Content**: Modify the content in the respective page components

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)
