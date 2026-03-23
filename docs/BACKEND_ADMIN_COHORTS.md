# Backend: admin cohort list (fix `GET /api/cohorts/` 404)

The Next admin **Kooxaha** page calls:

- `GET /api/{prefix}/` — list cohorts (`NEXT_PUBLIC_ADMIN_COHORTS_API_PREFIX`, default `cohorts`)
- `POST /api/{prefix}/` — create
- `PATCH /api/{prefix}/:id/` — update

The public proxy uses `GET /api/cohorts/challenge-status/` on the same API host. If **challenge-status** works but **list** returns **404**, Django almost certainly registers only the custom action, not a full **ModelViewSet** `list` route.

## What to add in Django (DRF)

1. **ViewSet** with `list`, `create`, `partial_update` (or `update`), scoped to **admin/staff** as you already do for other admin endpoints.
2. **Router** entry so both exist:

   - `GET/POST /api/cohorts/` (or your chosen prefix)
   - `GET /api/cohorts/challenge-status/` (existing `@action(detail=False, ...)`)

Example shape (adapt app names, permissions, and serializer fields to your `Cohort` model):

```python
# urls.py (api)
from rest_framework.routers import DefaultRouter
from .views import CohortViewSet

router = DefaultRouter()
router.register(r"cohorts", CohortViewSet, basename="cohort")
urlpatterns = router.urls
```

```python
# views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)

class CohortViewSet(viewsets.ModelViewSet):
    queryset = Cohort.objects.all().order_by("-start_date")
    serializer_class = CohortSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "post", "patch", "head", "options"]

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def challenge_status(self, request):
        # existing implementation → must stay registered as challenge-status in URLconf
        ...
```

Ensure **challenge_status** URL name matches what you already use (`challenge-status` in DRF default routing).

## Payload fields (frontend)

Create/update expects JSON compatible with:

- `name` (string)
- `start_date`, `end_date` (ISO date strings)
- `max_students` (number)
- optional: `is_active`, `is_waitlist_only` (booleans)

List items should include at least: `id`, `name`, and ideally `start_date`, `end_date`, `max_students`, `enrolled_count`, `is_active`, `is_waitlist_only`.

## If your routes live under `/api/lms/...`

Set in the Next env:

```bash
NEXT_PUBLIC_ADMIN_COHORTS_API_PREFIX=lms/cohorts
```

…and expose matching routes on Django (`/api/lms/cohorts/`).
