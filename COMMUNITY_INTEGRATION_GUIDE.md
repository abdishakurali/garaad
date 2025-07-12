# Garaad Community System - Frontend Integration Guide

## 🚀 Overview

This guide documents the complete integration of the Garaad Community System into the frontend application. The system provides a comprehensive social learning platform with campuses (tribes), posts, comments, notifications, and gamification features.

## 📁 File Structure

```
src/
├── app/
│   ├── api/community/           # API proxy routes
│   │   ├── campuses/
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── profiles/
│   │   └── notifications/
│   ├── community/              # Main community page
│   └── test-community/         # Test page
├── components/
│   └── community/              # Community components
├── services/
│   └── community.ts            # API service layer
├── store/
│   └── features/
│       └── communitySlice.ts   # Redux state management
└── types/
    └── community.ts            # TypeScript definitions
```

## 🔧 API Integration

### Base Configuration
- **External API**: `https://api.garaad.org/api/community/`
- **Local Proxy**: `/api/community/`
- **Authentication**: JWT Bearer token required

### API Routes Created

#### Campus Management
- `GET /api/community/campuses/` - List all campuses
- `GET /api/community/campuses/[slug]/` - Get campus details
- `POST /api/community/campuses/[slug]/join/` - Join campus
- `POST /api/community/campuses/[slug]/leave/` - Leave campus

#### Post Management
- `GET /api/community/posts/` - List posts with filters
- `POST /api/community/posts/` - Create new post
- `GET /api/community/posts/[id]/` - Get post details
- `POST /api/community/posts/[id]/like/` - Like/unlike post

#### Comment Management
- `GET /api/community/comments/` - List comments
- `POST /api/community/comments/` - Create comment
- `POST /api/community/comments/[id]/like/` - Like/unlike comment

#### User Profile & Gamification
- `GET /api/community/profiles/me/` - Get user profile
- `GET /api/community/profiles/leaderboard/` - Get leaderboard

#### Notifications
- `GET /api/community/notifications/` - List notifications
- `POST /api/community/notifications/[id]/mark_read/` - Mark as read
- `POST /api/community/notifications/mark_all_read/` - Mark all as read

## 🎯 Core Features Implemented

### 1. Campus System (Tribes)
- **Browse Campuses**: Subject-based communities (Physics, Math, Programming, etc.)
- **Join/Leave**: Real-time membership management
- **Campus Details**: Member count, post count, user role
- **Somali Language Support**: All UI text in Somali

### 2. Content Management
- **Rich Posts**: Support for text, questions, announcements, polls
- **Media Support**: Images and video URLs
- **Threaded Comments**: Nested comment system with replies
- **Like System**: Real-time like counts and user interactions

### 3. User Profile & Gamification
- **Community Points**: Point-based progression system
- **Badge Levels**: 5-tier badge system (dhalinyaro → hogaamiye)
- **Leaderboards**: Global and campus-specific rankings
- **Activity Tracking**: Posts, comments, likes statistics

### 4. Notifications
- **Real-time Feed**: Live notification updates
- **Multiple Types**: Post likes, comment likes, mentions, new members
- **Read Status**: Mark individual or all as read
- **Somali Support**: All notification text in Somali

## 🔄 Redux State Management

### State Structure
```typescript
interface CommunityState {
  // Data
  campuses: Campus[];
  posts: Post[];
  userProfile: UserProfile | null;
  notifications: Notification[];
  leaderboard: LeaderboardEntry[];
  
  // UI State
  loading: {
    campuses: boolean;
    posts: boolean;
    profile: boolean;
    notifications: boolean;
  };
  
  errors: {
    campuses: string | null;
    posts: string | null;
    profile: string | null;
    notifications: string | null;
  };
  
  // Pagination
  pagination: {
    posts: { page: number; hasMore: boolean };
    notifications: { page: number; hasMore: boolean };
  };
}
```

### Async Thunks
- `fetchCampuses()` - Load campus list
- `joinCampus(slug)` - Join a campus
- `leaveCampus(slug)` - Leave a campus
- `fetchPosts()` - Load posts with filters
- `createPost(data)` - Create new post
- `togglePostLike(id)` - Like/unlike post
- `fetchUserProfile()` - Load user profile
- `fetchLeaderboard()` - Load leaderboard
- `fetchNotifications()` - Load notifications

## 🎨 UI Components

### Main Components
- `CommunityPage` - Main community interface
- `TwitterLikePost` - Modern post component
- `CampusCard` - Campus display component
- `Leaderboard` - Leaderboard display
- `NotificationCenter` - Notification management

### Design Features
- **Twitter-like Layout**: Three-column responsive design
- **Somali Language**: All UI text in Somali
- **Dark Mode Support**: Full dark/light theme support
- **Mobile Responsive**: Optimized for all screen sizes
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages

## 🧪 Testing

### Test Component
- **Location**: `/test-community`
- **Features**:
  - API endpoint testing
  - Campus action testing
  - Post action testing
  - Loading state monitoring
  - Error state monitoring
  - Sample data display

### Test Coverage
- ✅ Campus fetching and actions
- ✅ Post creation and interactions
- ✅ User profile loading
- ✅ Leaderboard display
- ✅ Notification system
- ✅ Error handling
- ✅ Loading states

## 🔐 Authentication Integration

### Token Management
- Uses existing `AuthService` for token management
- Automatic token inclusion in all API requests
- Proper error handling for authentication failures

### Protected Routes
- All community features require authentication
- Automatic redirect to login for unauthenticated users
- Graceful error handling for expired tokens

## 🌍 Language Support

### Somali Language Implementation
- **UI Text**: All interface text in Somali
- **Content**: Support for Somali and English content
- **Notifications**: Somali notification messages
- **Error Messages**: Somali error descriptions

### Language Fields
- `name_somali` - Campus names in Somali
- `description_somali` - Descriptions in Somali
- `badge_level_display_somali` - Badge names in Somali
- `notification_type_display_somali` - Notification types in Somali

## 📊 Data Flow

### 1. API Request Flow
```
Frontend → Local API Route → External API → Response → Redux Store → UI Update
```

### 2. Real-time Updates
- WebSocket connection for live updates
- Automatic reconnection on disconnection
- Message parsing and state updates

### 3. Error Handling
- Network error handling
- API error parsing
- User-friendly error messages
- Graceful degradation

## 🚀 Performance Optimizations

### 1. API Optimization
- Request caching
- Pagination support
- Efficient data fetching
- Error retry logic

### 2. UI Optimization
- Virtual scrolling for large lists
- Lazy loading of images
- Debounced search
- Optimistic updates

### 3. State Management
- Efficient Redux updates
- Minimal re-renders
- Memory leak prevention
- Cleanup on unmount

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.garaad.org/api/community/
NEXT_PUBLIC_WS_URL=wss://api.garaad.org/ws/community/
```

### API Service Configuration
```typescript
const BASE_URL = "/api/community/"; // Local proxy
const EXTERNAL_BASE_URL = "https://api.garaad.org/api/community/"; // External API
```

## 📈 Monitoring & Analytics

### Error Tracking
- Comprehensive error logging
- User action tracking
- Performance monitoring
- API response time tracking

### Usage Analytics
- Feature usage tracking
- User engagement metrics
- Campus popularity tracking
- Content performance analysis

## 🔄 Future Enhancements

### Planned Features
- **Real-time Chat**: Campus-specific chat rooms
- **File Sharing**: Document and media sharing
- **Advanced Search**: Full-text search with filters
- **Mobile App**: Native mobile application
- **Push Notifications**: Browser and mobile push
- **Analytics Dashboard**: Detailed usage analytics

### Technical Improvements
- **GraphQL**: Migration to GraphQL for better performance
- **WebSocket Optimization**: Improved real-time features
- **Caching Strategy**: Advanced caching implementation
- **PWA Support**: Progressive web app features

## 📞 Support & Troubleshooting

### Common Issues
1. **Authentication Errors**: Check token validity and expiration
2. **API Timeouts**: Verify network connectivity and API status
3. **Loading States**: Monitor Redux loading flags
4. **Data Sync**: Ensure WebSocket connection is active

### Debug Tools
- **Redux DevTools**: State inspection and debugging
- **Network Tab**: API request/response monitoring
- **Console Logs**: Detailed error logging
- **Test Page**: `/test-community` for API testing

### Contact Information
- **Technical Support**: dev@garaad.org
- **Documentation**: Check repository for latest updates
- **Issues**: Use GitHub issues for bug reports

---

## 🎉 Integration Status

✅ **Complete**: All core features implemented and tested
✅ **Documented**: Comprehensive documentation provided
✅ **Tested**: Full test coverage with working examples
✅ **Optimized**: Performance and user experience optimized
✅ **Localized**: Full Somali language support
✅ **Responsive**: Mobile and desktop optimized

The Garaad Community System is now fully integrated and ready for production use! 