# Good First Issues

Here are 5-10 issues suitable for new contributors. You can copy-paste these to your GitHub Issues.

## Issue 1: Remove `console.log` statements from production code
**Title**: Clean up `console.log` statements in Services
**Description**: 
There are several leftover `console.log` statements in our service files that clogs the production logs.
**Task**: Remove `console.log` from:
- `src/services/auth.ts`
- `src/services/user.ts`
- `src/services/stripe.ts`
**Effect**: Cleaner logs.

## Issue 2: Fix "Any" Types in `communitySlice.ts`
**Title**: Refactor `any` types to specific interfaces in `communitySlice.ts`
**Description**: 
The `communitySlice.ts` file uses `any` for error handling and some data mapping. 
**Task**: Replace `any` with proper TypeScript interfaces (e.g., `AxiosError` or our custom `APIError` type).
**File**: `src/store/features/communitySlice.ts`
**Effect**: Better type safety.

## Issue 3: Standardize Colors in `MonitoringDashboard.tsx`
**Title**: Replace hardcoded hex colors with Tailwind utility classes
**Description**: 
`src/components/MonitoringDashboard.tsx` uses hardcoded hex codes like `#dc2626` and `#3b82f6`.
**Task**: Replace these with Tailwind equivalents (e.g., `text-red-600`, `text-blue-500`).
**File**: `src/components/MonitoringDashboard.tsx`
**Effect**: Consistent theming.

## Issue 4: Add Alt Text to Images in `HomePage.tsx` (Example)
**Title**: Accessibility: Add alt text to images
**Description**:
Search the codebase for `<img` tags missing `alt` attributes or with empty alt text where description is needed.
**Task**: Ensure all images have meaningful `alt` text for screen readers.
**Effect**: Improved accessibility.

## Issue 5: Document Diagramatics Examples
**Title**: Add examples for Diagramatics
**Description**: 
There is a TODO comment in `src/types/diagramatics.md`: `// TODO: write example for this`.
**Task**: Add a code example demonstrating how to use the described type/function.
**Effect**: Better documentation.

## Issue 6: Implement WaafiPay Signature Validation
**Title**: Feature: Implement WaafiPay Signature Validation
**Description**:
There is a TODO in `src/app/api/payment/webhook/waafi/route.ts`: `// TODO: Implement actual signature validation`.
**Task**: detailed research on WaafiPay API is needed, but implementing this check prevents spoofed requests.
**Effect**: Improved security.

## Issue 7: Fix `Any` Types in `LocationService`
**Title**: strict typing for Location Service
**Description**:
`src/services/location.ts` may have loose typing. Review and ensure strict types are used.
**Effect**: Robust location handling.
