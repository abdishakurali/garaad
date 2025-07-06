# Activity Tracking Testing Guide

## Overview

This guide provides comprehensive testing procedures for the activity tracking system integration. The system includes automatic tracking, user interaction monitoring, and performance metrics collection.

## Testing Environment Setup

### 1. Prerequisites

- Node.js and npm/yarn installed
- Backend API running with activity endpoints
- User authentication working
- Browser developer tools available

### 2. Test Data Setup

```bash
# Start the development server
npm run dev

# Navigate to test page
http://localhost:3000/test-activity
```

## Testing Procedures

### 1. Basic Integration Testing

#### Test: Activity Service Initialization
**Steps:**
1. Open browser console
2. Navigate to `/test-activity`
3. Click "Run All Tests"
4. Verify "ActivityService Instance" test passes

**Expected Result:**
- ✅ ActivityService singleton created successfully

#### Test: Authentication Check
**Steps:**
1. Ensure user is logged in
2. Run integration tests
3. Check "Authentication Check" result

**Expected Result:**
- ✅ User is authenticated (if logged in)
- ❌ User is not authenticated (if not logged in)

#### Test: Activity Update API
**Steps:**
1. Run integration tests
2. Check "Activity Update" result
3. Verify response data structure

**Expected Result:**
- ✅ Activity updated successfully
- Response includes: `success`, `user`, `streak`, `activity`

### 2. Component Testing

#### Test: ActivityTracker Component
**Steps:**
1. Navigate to test page
2. Go to "Components" tab
3. Verify ActivityTracker renders correctly
4. Check for loading states
5. Verify error handling

**Expected Result:**
- Component displays activity data
- Loading states work properly
- Error states handled gracefully

#### Test: Example Components
**Steps:**
1. Go to "Components" tab
2. Scroll through example components
3. Test manual update buttons
4. Verify status indicators

**Expected Result:**
- All example components render
- Manual updates work
- Status indicators show correct states

### 3. Performance Testing

#### Test: API Response Time
**Steps:**
1. Open browser dev tools
2. Go to Network tab
3. Trigger activity update
4. Measure response time

**Expected Result:**
- Response time < 500ms
- No timeout errors

#### Test: Memory Usage
**Steps:**
1. Open browser dev tools
2. Go to Performance tab
3. Record session for 5 minutes
4. Check memory usage

**Expected Result:**
- Memory usage stable
- No memory leaks
- < 10MB increase over session

#### Test: Event Listeners
**Steps:**
1. Open browser dev tools
2. Go to Elements tab
3. Check event listeners
4. Verify cleanup on unmount

**Expected Result:**
- 6 event listeners active
- Cleanup works properly
- No orphaned listeners

### 4. User Interaction Testing

#### Test: Automatic Tracking
**Steps:**
1. Open test page
2. Perform various interactions:
   - Click buttons
   - Scroll page
   - Type in inputs
   - Switch tabs
3. Wait 5 minutes
4. Check activity updates

**Expected Result:**
- Interactions tracked
- Activity updates every 5 minutes
- No excessive API calls

#### Test: Debouncing
**Steps:**
1. Rapidly click buttons
2. Check network tab
3. Verify API call frequency

**Expected Result:**
- API calls debounced
- Minimum 1-minute interval
- No spam requests

### 5. Error Handling Testing

#### Test: Network Errors
**Steps:**
1. Disconnect internet
2. Trigger activity update
3. Check error handling
4. Reconnect and retry

**Expected Result:**
- Errors handled gracefully
- App doesn't crash
- Recovery works

#### Test: Authentication Errors
**Steps:**
1. Clear authentication tokens
2. Trigger activity update
3. Check error handling

**Expected Result:**
- Authentication errors handled
- User redirected to login
- Clear error messages

### 6. Monitoring Testing

#### Test: Metrics Collection
**Steps:**
1. Go to "Monitoring" tab
2. Perform various activities
3. Check metrics update
4. Export metrics data

**Expected Result:**
- Metrics collected properly
- Real-time updates
- Export functionality works

#### Test: Performance Metrics
**Steps:**
1. Monitor performance tab
2. Check memory usage
3. Verify response times
4. Test error rates

**Expected Result:**
- Performance metrics accurate
- Memory usage reasonable
- Error rates low

## Automated Testing

### Unit Tests

```bash
# Run unit tests
npm test

# Test specific files
npm test -- --testPathPattern=activity
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Test with specific environment
NODE_ENV=test npm run test:integration
```

## Manual Testing Checklist

### ✅ Basic Functionality
- [ ] ActivityService initializes
- [ ] Authentication works
- [ ] API calls succeed
- [ ] Data displays correctly

### ✅ Component Testing
- [ ] ActivityTracker renders
- [ ] Loading states work
- [ ] Error states handled
- [ ] Example components work

### ✅ Performance Testing
- [ ] Response times acceptable
- [ ] Memory usage stable
- [ ] No memory leaks
- [ ] Event listeners managed

### ✅ User Interaction Testing
- [ ] Automatic tracking works
- [ ] Debouncing functions
- [ ] Periodic updates work
- [ ] Interaction tracking accurate

### ✅ Error Handling Testing
- [ ] Network errors handled
- [ ] Auth errors handled
- [ ] App doesn't crash
- [ ] Recovery works

### ✅ Monitoring Testing
- [ ] Metrics collected
- [ ] Real-time updates
- [ ] Export works
- [ ] Performance tracking

## Performance Benchmarks

### Acceptable Ranges

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| API Response Time | < 200ms | 200-500ms | > 500ms |
| Memory Usage | < 5MB | 5-10MB | > 10MB |
| Error Rate | < 1% | 1-5% | > 5% |
| Event Listeners | 6 | 6-8 | > 8 |

### Testing Scenarios

#### High Load Testing
```bash
# Simulate high user activity
for i in {1..100}; do
  curl -X POST /api/activity/update/
done
```

#### Long Session Testing
```bash
# Test for 30 minutes
# Monitor memory usage
# Check for memory leaks
```

## Debugging

### Common Issues

#### Issue: Activity not updating
**Debug Steps:**
1. Check authentication status
2. Verify API endpoint
3. Check network connectivity
4. Review console errors

#### Issue: High memory usage
**Debug Steps:**
1. Check for memory leaks
2. Verify cleanup functions
3. Monitor event listeners
4. Test component unmounting

#### Issue: Performance degradation
**Debug Steps:**
1. Check API response times
2. Monitor memory usage
3. Verify debouncing
4. Test with different loads

### Debug Commands

```javascript
// Check activity service
const activityService = ActivityService.getInstance();
console.log('Activity service:', activityService);

// Check monitoring
const monitoringService = MonitoringService.getInstance();
console.log('Current metrics:', monitoringService.getCurrentMetrics());

// Test activity update
activityService.updateActivity().then(console.log).catch(console.error);
```

## Reporting

### Test Results Template

```markdown
## Test Results

**Date:** [Date]
**Tester:** [Name]
**Environment:** [Browser/OS]

### Basic Functionality
- [ ] ActivityService: PASS/FAIL
- [ ] Authentication: PASS/FAIL
- [ ] API Calls: PASS/FAIL
- [ ] Data Display: PASS/FAIL

### Performance
- [ ] Response Time: [Value]ms
- [ ] Memory Usage: [Value]MB
- [ ] Error Rate: [Value]%
- [ ] Event Listeners: [Count]

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
1. [Recommendation]
2. [Recommendation]
```

## Continuous Testing

### Automated Monitoring

```javascript
// Set up automated monitoring
setInterval(() => {
  const metrics = MonitoringService.getInstance().getCurrentMetrics();
  if (metrics.performance.errorRate > 5) {
    console.error('High error rate detected:', metrics.performance.errorRate);
  }
}, 60000);
```

### Performance Alerts

```javascript
// Performance alert thresholds
const ALERTS = {
  responseTime: 500,
  memoryUsage: 10,
  errorRate: 5
};
```

## Conclusion

This testing guide ensures comprehensive validation of the activity tracking system. Regular testing helps maintain system reliability and performance. Update this guide as the system evolves. 