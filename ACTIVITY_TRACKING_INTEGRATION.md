# Activity Tracking Integration Documentation

## Overview

This document describes the comprehensive activity tracking system that has been integrated into the Garaad frontend application. The system provides robust user activity tracking similar to platforms like Duolingo and Brilliant.org.

## Architecture

### Components

1. **ActivityService** (`src/services/activity.ts`)
   - Singleton service for managing activity tracking
   - Handles periodic updates (every 5 minutes)
   - Manages user interaction tracking
   - Provides debounced activity updates

2. **useActivityTracking Hook** (`src/hooks/useActivityTracking.ts`)
   - React hook for activity tracking state management
   - Integrates with ActivityService
   - Provides activity data, loading states, and error handling

3. **ActivityTracker Component** (`src/components/ActivityTracker.tsx`)
   - React component for displaying activity status
   - Shows streak information, daily activity, and progress
   - Supports detailed and compact views

4. **ActivityProvider** (`src/providers/ActivityProvider.tsx`)
   - Global provider for initializing activity tracking
   - Automatically starts tracking for authenticated users

5. **API Route** (`src/app/api/activity/update/route.ts`)
   - Next.js API route that forwards requests to backend
   - Handles authentication and error responses

## Key Features

### Automatic Tracking
- Activity is automatically tracked on every authenticated request
- Periodic updates every 5 minutes while user is active
- Token refresh tracking for continuous activity monitoring

### User Interaction Tracking
- Tracks clicks, scrolls, and keyboard interactions
- Monitors page visibility changes
- Handles focus/blur events
- Debounced updates to prevent excessive API calls

### Real-time Updates
- Activity status updates in real-time
- Streak information displayed immediately
- Progress tracking for daily goals

## Integration Methods

### 1. Automatic Integration (Recommended)

The system is automatically integrated through the `ActivityProvider` in the main app providers:

```tsx
// src/app/providers.tsx
import ActivityProvider from "@/providers/ActivityProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ActivityProvider>
          {children}
        </ActivityProvider>
      </PersistGate>
    </Provider>
  );
}
```

### 2. Using the ActivityTracker Component

Add the ActivityTracker component to any page:

```tsx
import ActivityTracker from "@/components/ActivityTracker";

// Basic usage
<ActivityTracker />

// With detailed view
<ActivityTracker showDetails={true} />

// With custom styling
<ActivityTracker className="my-custom-class" />
```

### 3. Using the useActivityTracking Hook

For custom implementations:

```tsx
import { useActivityTracking } from "@/hooks/useActivityTracking";

function MyComponent() {
  const { activityData, isLoading, error, updateActivity, isTracking } = useActivityTracking();

  if (isLoading) return <div>Loading activity...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Current Streak: {activityData?.streak.current_streak}</h2>
      <p>Today's Activity: {activityData?.activity.status}</p>
      <button onClick={updateActivity}>Update Activity</button>
    </div>
  );
}
```

### 4. Manual Activity Updates

For specific user actions:

```tsx
import ActivityService from "@/services/activity";

// Update activity on specific user action
const handleUserAction = async () => {
  try {
    const activityService = ActivityService.getInstance();
    await activityService.updateActivity();
    console.log("Activity updated successfully");
  } catch (error) {
    console.error("Activity update failed:", error);
  }
};
```

## API Response Format

The activity update endpoint returns:

```json
{
  "success": true,
  "message": "Activity updated successfully",
  "user": {
    "last_active": "2025-01-29T10:30:00Z",
    "last_login": "2025-01-29T09:00:00Z"
  },
  "streak": {
    "current_streak": 5,
    "max_streak": 10,
    "last_activity_date": "2025-01-29"
  },
  "activity": {
    "date": "2025-01-29",
    "status": "partial",
    "problems_solved": 2,
    "lesson_ids": ["lesson1", "lesson2"]
  },
  "activity_date": "2025-01-29"
}
```

## Activity Status Types

- **complete**: User has completed their daily goal
- **partial**: User has made progress but not completed daily goal
- **none**: No activity recorded for today

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Activity Service Configuration

The ActivityService can be configured with different intervals:

```tsx
// In ActivityService
private readonly MIN_UPDATE_INTERVAL = 60000; // 1 minute
private readonly PERIODIC_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
```

## Error Handling

The system includes comprehensive error handling:

```tsx
// Authentication errors
if (response.status === 401) {
  throw new Error("Authentication failed");
}

// Network errors
catch (error) {
  console.error("Activity update error:", error);
  // Don't break the app, just log the error
}
```

## Performance Optimization

### Debouncing
- User interactions are debounced to prevent excessive API calls
- Minimum 1-minute interval between interaction updates

### Periodic Updates
- Updates every 5 minutes instead of continuously
- Reduces server load while maintaining accurate tracking

### Memory Management
- Proper cleanup of event listeners and timers
- Automatic cleanup on component unmount

## Testing

### Manual Testing

```tsx
// Test activity update
const testActivityUpdate = async () => {
  const activityService = ActivityService.getInstance();
  const result = await activityService.updateActivity();
  console.log("Activity update result:", result);
};
```

### Component Testing

```tsx
// Test ActivityTracker component
import { render, screen } from "@testing-library/react";
import ActivityTracker from "@/components/ActivityTracker";

test("renders activity tracker", () => {
  render(<ActivityTracker />);
  expect(screen.getByText("Activity Status")).toBeInTheDocument();
});
```

## Best Practices

### 1. Performance
- Use the ActivityTracker component for UI display
- Use the hook for custom logic
- Don't call updateActivity too frequently

### 2. User Experience
- Show loading states during activity updates
- Display meaningful error messages
- Provide visual feedback for activity status

### 3. Security
- Always validate authentication before making requests
- Handle token expiration gracefully
- Use HTTPS for all API calls

### 4. Error Handling
- Don't break the app if activity updates fail
- Log errors for debugging
- Provide fallback UI for error states

## Migration Guide

### From Old System

If you were using a different activity tracking system:

1. **Remove old activity calls**
   ```tsx
   // Remove old activity update logic
   // const oldActivityUpdate = () => { ... };
   ```

2. **Update UI components**
   ```tsx
   // Use new ActivityTracker component
   import ActivityTracker from "@/components/ActivityTracker";
   ```

3. **Test thoroughly**
   - Verify activity tracking works correctly
   - Check that streaks are updating properly
   - Ensure no performance impact

### Backward Compatibility

The new system is designed to be backward compatible:
- Existing activity data is preserved
- Old API endpoints continue to work
- Gradual migration is supported

## Troubleshooting

### Common Issues

1. **Activity not updating**
   - Check if user is authenticated
   - Verify tokens are valid
   - Check network connectivity

2. **Streak not incrementing**
   - Verify activity is being tracked on consecutive days
   - Check backend activity calculation logic

3. **Performance issues**
   - Ensure you're not calling the API too frequently
   - Check for memory leaks in event listeners

4. **CORS errors**
   - Verify frontend domain is allowed in backend CORS settings

### Debug Commands

```tsx
// Check current activity status
const debugActivity = async () => {
  const activityService = ActivityService.getInstance();
  const data = await activityService.updateActivity();
  console.log("Current activity:", data);
  return data;
};

// Check authentication status
const checkAuth = () => {
  const authService = AuthService.getInstance();
  console.log("Is authenticated:", authService.isAuthenticated());
  console.log("Token:", authService.getToken());
};
```

## Future Enhancements

### Planned Features

1. **Offline Support**
   - Cache activity data for offline use
   - Sync when connection is restored

2. **Advanced Analytics**
   - Detailed activity patterns
   - Learning session analysis
   - Performance insights

3. **Gamification**
   - Achievement badges for activity milestones
   - Social features for activity sharing
   - Leaderboards based on activity

4. **Customization**
   - User-configurable activity goals
   - Personalized activity reminders
   - Custom activity tracking rules

## Conclusion

The activity tracking system provides a robust foundation for monitoring user engagement and maintaining streaks. By following this integration guide, you can ensure your frontend properly integrates with the backend activity tracking system while maintaining good performance and user experience.

For additional support or questions, refer to the codebase examples or contact the development team. 