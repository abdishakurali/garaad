# API Endpoints Documentation with Examples and Reasons


### Enroll in Course
- **Method**: POST `/api/courses/{id}/enroll/`
- **Reason**: To sign up for a specific course
- **Example Response**:
```json
{
    "id": 1,
    "user": 1,
    "course": 1,
    "enrolled_at": "2024-03-20T10:00:00Z",
    "completed_at": null
}
```

### Update Progress
- **Method**: POST `/api/courses/{id}/update_progress/`
- **Reason**: To update how far along a user is in a course
- **Example Request**:
```json
{
    "progress": 75
}
```

## Lessons (`/api/lessons/`)
### Lesson Details
- **Method**: GET `/api/lessons/{id}/`
- **Reason**: To view a specific lesson's content and details
- **Example Response**:
```json
{
    "id": 1,
    "title": "Variables and Data Types",
    "description": "Learn about Python variables",
    "course": 1,
    "order": 1,
    "next_lesson": {
        "id": 2,
        "title": "Control Structures",
        "order": 2
    }
}
```

### Complete Lesson
- **Method**: POST `/api/lessons/{id}/complete/`
- **Reason**: To mark a lesson as finished and record the score
- **Example Request**:
```json
{
    "score": 95
} 

### Get Lesson Content
- **Method**: GET `/api/lessons/{id}/content/`
- **Reason**: To get all the learning materials in a lesson
- **Example Response**:
```json
[
    {
        "type": "block",
        "id": 1,
        "order": 1,
        "block_type": "text",
        "content": "Variables are containers for storing data values..."
    }
]
```

## Lesson Content Blocks (`/api/lesson-content-blocks/`)
### Reorder Content Blocks
- **Method**: POST `/api/lesson-content-blocks/reorder/`
- **Reason**: To change the order of content within a lesson
- **Example Request**:
```json
{
    "lesson_id": 1,
    "block_order": [3, 1, 2]
}
```

## User Progress (`/api/user-progress/`)
### List User Progress
- **Method**: GET
- **Reason**: To see how far along a user is in their courses
- **Example Response**:
```json
[
    {
        "id": 1,
        "user": 1,
        "lesson": 1,
        "status": "completed",
        "score": 95,
        "last_accessed": "2024-03-20T10:00:00Z"
    }
]
```

 

## User Rewards (`/api/user-rewards/`)
### List Rewards
- **Method**: GET
- **Reason**: To see all achievements and badges earned
- **Example Response**:
```json
[
    {
        "id": 1,
        "user": 1,
        "type": "badge",
        "name": "Python Master",
        "description": "Completed all Python courses",
        "awarded_at": "2024-03-20T10:00:00Z"
    }
]
```

## Leaderboard (`/api/leaderboard/`)
### Get Leaderboard
- **Method**: GET
- **Reason**: To see top performing users
- **Example Response**:
```json
[
    {
        "id": 1,
        "user": {
            "id": 1,
            "username": "john_doe",
            "avatar": "https://example.com/avatar.jpg"
        },
        "points": 1000,
        "time_period": "all_time",
        "rank": 1
    }
]
```

### Get User Rank
- **Method**: GET `/api/leaderboard/my_rank/`
- **Reason**: To see how a user compares to others
- **Example Response**:
```json
{
    "rank": 5,
    "points": 750,
    "entries_above": [
        {
            "user__username": "user1",
            "points": 1000
        }
    ],
    "entries_below": [
        {
            "user__username": "user3",
            "points": 600
        }
    ],
    "user_info": {
        "username": "current_user",
        "avatar": "https://example.com/avatar.jpg",
        "completed_courses": 5
    }
}
```

Note: All endpoints require authentication unless specified otherwise. The responses include appropriate status codes (200 for success, 401 for unauthorized, 404 for not found, etc.). Timestamps are in ISO 8601 format (YYYY-MM-DDThh:mm:ssZ).
