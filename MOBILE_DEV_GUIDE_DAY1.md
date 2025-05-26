# Garaad Mobile App – Day 1 Developer Guidance

## Design Inspiration

- **Take inspiration from [brilliant.org](https://brilliant.org) and [garaad.org](https://garaad.org)** for the look and feel of the mobile app.
- Focus on a **clean, modern, and engaging UI**:
  - Use bright, friendly colors and clear typography.
  - Prioritize simplicity and ease of navigation.
  - Use card layouts, rounded corners, and subtle shadows for depth.
  - Make learning interactive and visually appealing (e.g., progress bars, badges, avatars).
  - Ensure accessibility and responsiveness for all device sizes.
- You may reference the web version of Garaad for branding, color palette, and iconography.

---

## Code Quality & Performance Expectations

- **Write clean, readable, and well-structured code.**
  - Use clear naming conventions and modular components.
  - Add comments and documentation where necessary.
  - Avoid code duplication and keep logic DRY (Don't Repeat Yourself).
- **Performance comes first:**
  - Minimize unnecessary re-renders and optimize component structure.
  - Use FlatList/SectionList for lists, avoid ScrollView for large data.
  - Lazy load images and assets where possible.
  - Use memoization (React.memo, useMemo, useCallback) for expensive computations or stable props.
  - Profile and test on real devices for smoothness and responsiveness.
- **Follow best practices for React Native and TypeScript.**
- **Prioritize accessibility and responsiveness.**

---

## 1. Project Setup

- Use **React Native** (Expo or CLI).
- Set up TypeScript for type safety.
- Install HTTP client (e.g., `axios` or `fetch`).

---

## 2. Authentication APIs

### Base API URL

- The base API URL is usually:
  `http://localhost:8000` (for local dev)
  or check with the backend for the deployed URL (e.g., `https://api.garaad.so`).

---

### **Signup Endpoint**

- **POST** `/api/auth/signup/`
- **Payload Example:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "name": "User Name",
    "age": 18,
    "onboarding_data": {
      "goal": "learn_math",
      "learning_approach": "self_paced",
      "topic": "general_math",
      "math_level": "beginner",
      "minutes_per_day": 30
    },
    "profile": {
      "bio": "Optional bio",
      "avatar": "https://example.com/avatar.jpg",
      "location": "City",
      "website": "https://website.com",
      "socialLinks": {
        "twitter": "",
        "linkedin": "",
        "github": ""
      }
    }
  }
  ```
- **Response Example:**
  ```json
  {
    "user": {
      "id": "string",
      "email": "user@example.com",
      "first_name": "User",
      "last_name": "Name",
      "username": "username",
      "date_joined": "2024-01-01T00:00:00Z",
      "is_active": true,
      "is_staff": false,
      "is_superuser": false,
      "last_login": "2024-01-01T00:00:00Z"
      // ...other fields
    },
    "tokens": {
      "refresh": "refresh_token_string",
      "access": "access_token_string"
    }
  }
  ```

---

### **Login Endpoint**

- **POST** `/api/auth/signin/`
- **Payload Example:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response Example:**
  ```json
  {
    "user": {
      "id": "string",
      "email": "user@example.com"
      // ...other fields
    },
    "tokens": {
      "refresh": "refresh_token_string",
      "access": "access_token_string"
    }
  }
  ```

---

## 3. What to Build on Day 1

- [ ] Set up the React Native project.
- [ ] Create screens for:
  - Login
  - Signup
- [ ] Integrate the above API endpoints for authentication.
- [ ] On successful login/signup, store the `access` and `refresh` tokens securely (e.g., AsyncStorage).
- [ ] Display error messages from the API.
- [ ] Show a loading indicator during API calls.

---

## 4. Useful Types

```ts
// Signup payload
type SignUpData = {
  email: string;
  password: string;
  name: string;
  age: number;
  onboarding_data: {
    goal: string;
    learning_approach: string;
    topic: string;
    math_level: string;
    minutes_per_day: number;
  };
  profile?: {
    bio?: string;
    avatar?: string;
    location?: string;
    website?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
};

// Login payload
type LoginData = {
  email: string;
  password: string;
};
```

---

## 5. Next Steps

- After login/signup, you can use the `access` token for authenticated requests to other Garaad APIs.
- See the backend/API team for more endpoints and documentation as needed.
