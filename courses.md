# Step 1: Lesson Overview
#### Lesson: "Dheellitir Miisaanka" (Balance the Scale)
- **Context**: A Somali farmer balancing water containers on a scale to ensure fair distribution.
- **Interaction Type**: Multiple-choice (select a step to balance the equation).
- **Visual**: An SVG of a scale showing 2s + 12 on the left and 4s on the right.
 
#### Linked Hierarchy
- **Category**: "Practical Math and Science" (`practical-math-science`)
- **Course**: "Xallinta Isla’egta" (Solving Equations) (`id: 1`)
- **Module**: "Dheellitirka Isla’egta" (Balancing Equations) (`id: "module-2"`)
- **Lesson**: "Dheellitir Miisaanka" (Balance the Scale) (`id: 1`)

---

### Step 2: Back-End (Django)
We’ll use Django with Django REST Framework (DRF) to build the API. The lesson endpoint (`/api/lessons/<id>/`) will handle both fetching the lesson (GET) and submitting the answer (POST).

#### Django Models
Define the models for `Category`, `Course`, `Module`, and `Lesson`. We’ll use a `JSONField` to store the `problem` data, which includes the question, visual, options, and solution.

```python
# models.py
from django.db import models
import json

class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.CharField(max_length=255)
    in_progress = models.BooleanField(default=False)
    course_ids = models.JSONField(default=list)

    def __str__(self):
        return self.title

class Course(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="courses")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    is_new = models.BooleanField(default=False)
    progress = models.IntegerField(default=0)
    module_ids = models.JSONField(default=list)

    def __str__(self):
        return self.title

class Module(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    description = models.TextField()
    lesson_ids = models.JSONField(default=list)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    id = models.AutoField(primary_key=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.TextField()
    progress = models.IntegerField(default=0)
    type = models.CharField(max_length=50)
    problem = models.JSONField()  # Stores question, example, options, solution, explanation
    language_options = models.JSONField(default=list)
    narration = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.title
```

#### Django Serializers
Use DRF to serialize the models into JSON for the API.

```python
# serializers.py
from rest_framework import serializers
from .models import Category, Course, Module, Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = "__all__"

class CategorySerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = "__all__"
```

#### Django Views
Create a view for the lesson endpoint that handles both GET (fetch lesson) and POST (submit answer).

```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Lesson
from .serializers import LessonSerializer

class LessonView(APIView):
    def get(self, request, id):
        try:
            lesson = Lesson.objects.get(id=id)
            serializer = LessonSerializer(lesson)
            return Response(serializer.data)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, id):
        try:
            lesson = Lesson.objects.get(id=id)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        answer = request.data.get("answer")
        if not answer:
            return Response({"error": "Answer is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the answer based on the lesson type
        problem = lesson.problem
        correct = False
        if lesson.type == "multiple-choice":
            correct = answer == problem["solution"]

        # Update progress
        if correct:
            lesson.progress = min(lesson.progress + 25, 100)  # Increment by 25, max 100
            lesson.save()

        # Add feedback to the response
        serializer = LessonSerializer(lesson)
        response_data = serializer.data
        response_data["feedback"] = {
            "correct": correct,
            "explanation": problem["explanation"],
            "progress": lesson.progress
        }

        return Response(response_data)
```

#### Django URLs
Map the view to the `/api/lessons/<id>/` endpoint.

```python
# urls.py
from django.urls import path
from .views import LessonView

urlpatterns = [
    path("api/lessons/<int:id>/", LessonView.as_view(), name="lesson-detail"),
]
```

#### Populate the Database
For testing, you can populate the database with the lesson data using a Django management command or the admin interface. Here’s an example of how to do it manually in the Django shell:

```python
# In the Django shell (python manage.py shell)
from yourapp.models import Category, Course, Module, Lesson

# Create Category
category = Category.objects.create(
    id="practical-math-science",
    title="Xisaab iyo Saynis Wax-ku-ool ah",
    description="Isku dabaqa xisaabta iyo sayniska si aad u wanaajiso noloshaada maalinlaha ah ee Soomaaliya.",
    image="/images/practical-math-science.svg",
    in_progress=False,
    course_ids=[1]
)

# Create Course
course = Course.objects.create(
    category=category,
    id=1,
    title="Xallinta Isla’egta",
    slug="solving-equations",
    is_new=False,
    progress=0,
    module_ids=["module-1", "module-2", "module-3"]
)

# Create Module
module = Module.objects.create(
    id="module-2",
    course=course,
    title="Dheellitirka Isla’egta",
    description="Baro farsamooyinka lagu xalliyo isla’egta adigoo dheellitiraya labada dhinac.",
    lesson_ids=[1, 2, 3]
)

# Create Lesson
lesson = Lesson.objects.create(
    module=module,
    title="Dheellitir Miisaanka",
    slug="balance-the-scale",
    description="Baro sida loo dheellitiro miisaanka si aad u qaybiso biyaha si siman beeralayda Soomaaliyeed.",
    progress=0,
    type="multiple-choice",
    problem={
        "question": "Waa maxay tallaabada dheellitirta miisaanka si geedaha loo wada qaybiyo dhinac keliya?",
        "example": {
            "equation": "2s + 12 = 4s",
            "visual": "/images/scale-2s-12-4s.svg",
            "visualAlt": "Miisaan leh 2s iyo 12 dhinaca bidix, 4s dhinaca midig",
            "context": "Beeralay Soomaaliyeed oo doonaya inuu u qaybiyo biyaha si siman"
        },
        "options": [
            "Ka saar 12 labada dhinac",
            "Ka saar 2s labada dhinac",
            "Ka saar 4s labada dhinac"
        ],
        "solution": "Ka saar 2s labada dhinac",
        "explanation": "Markaad ka saarto 2s labada dhinac, waxaad helaysaa 12 = 2s, taasoo ka dhigaysa geedaha dhinac keliya."
    },
    language_options=["Somali", "English", "Arabic"],
    narration="/audio/balance-the-scale-somali.mp3"
)
```

---

### Step 3: Front-End (Next.js with Tailwind CSS)
We’ll create a Next.js page to render the lesson, fetch the data using the API, and handle answer submission. Tailwind CSS will be used for styling.

#### Next.js Page (`pages/lessons/[id].js`)
This page dynamically fetches the lesson based on the `id` parameter and renders it.

```jsx
// pages/lessons/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function LessonPage() {
  const router = useRouter();
  const { id } = router.query;
  const [lesson, setLesson] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch lesson data
      fetch(`/api/lessons/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setLesson(data);
        })
        .catch((err) => console.error("Error fetching lesson:", err));
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!selectedOption) return;

    // Submit the answer to the same lesson endpoint
    const response = await fetch(`/api/lessons/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer: selectedOption }),
    });

    const updatedLesson = await response.json();
    setLesson(updatedLesson);
    setFeedback(updatedLesson.feedback);
    setSelectedOption(null); // Reset selection for the next attempt
  };

  if (!lesson) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
      <p className="text-gray-700 mb-4">{lesson.description}</p>
      <h3 className="text-xl font-semibold mb-2">{lesson.problem.question}</h3>
      <p className="text-gray-600 mb-4">{lesson.problem.example.context}</p>
      <img
        src={lesson.problem.example.visual}
        alt={lesson.problem.example.visualAlt}
        className="mx-auto mb-4 w-52 h-24"
      />
      <p className="text-center mb-4">Isla’egta: {lesson.problem.example.equation}</p>
      <div className="flex justify-center gap-4 mb-4">
        {lesson.problem.options.map((option, index) => (
          <button
            key={index}
            className={`px-4 py-2 border rounded-lg ${
              selectedOption === option
                ? "bg-blue-100 border-blue-500"
                : "bg-gray-100 border-gray-300"
            } ${feedback ? "cursor-not-allowed" : "hover:bg-blue-50"}`}
            onClick={() => setSelectedOption(option)}
            disabled={feedback}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || feedback}
          className={`px-6 py-2 rounded-lg text-white ${
            !selectedOption || feedback ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Hubi (Check)
        </button>
      </div>
      {feedback && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className={`font-semibold ${feedback.correct ? "text-green-600" : "text-red-600"}`}>
            {feedback.correct ? "✔ Waxaad saxday!" : "Isku day mar kale!"}
          </p>
          <p className="text-gray-700 mt-2">{feedback.explanation}</p>
          <p className="text-gray-700 mt-2">Horumarkaaga: {feedback.progress}%</p>
        </div>
      )}
      <div className="mt-6 flex justify-center gap-2">
        <p>Luqadda: </p>
        {lesson.language_options.map((lang, index) => (
          <button
            key={index}
            onClick={() => alert(`Switch to ${lang}`)}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {lang}
          </button>
        ))}
      </div>
      {lesson.narration && (
        <div className="text-center mt-4">
          <button
            onClick={() => alert("Playing narration...")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Dhageyso (Listen)
          </button>
        </div>
      )}
    </div>
  );
}
```

#### Tailwind CSS Setup
Ensure Tailwind CSS is set up in your Next.js project. If not, you can add it by following these steps:

1. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. Configure `tailwind.config.js`:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./pages/**/*.{js,ts,jsx,tsx}",
       "./components/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

3. Add Tailwind directives to `styles/globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

The styling in the code above uses Tailwind classes for a clean, responsive design.

---

### Step 4: Visual (SVG)
The visual is an SVG of a scale, stored at `/public/images/scale-2s-12-4s.svg`. Place this file in the `public` directory of your Next.js project:

```xml
<!-- public/images/scale-2s-12-4s.svg -->
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <!-- Scale beam -->
  <line x1="0" y1="50" x2="200" y2="50" stroke="black" stroke-width="2"/>
  <!-- Left side: 2s + 12 -->
  <rect x="20" y="30" width="20" height="20" fill="blue"/>
  <text x="25" y="45" fill="white">2s</text>
  <rect x="50" y="30" width="20" height="20" fill="gray"/>
  <text x="55" y="45" fill="white">12</text>
  <!-- Right side: 4s -->
  <rect x="150" y="30" width="20" height="20" fill="blue"/>
  <text x="155" y="45" fill="white">4s</text>
</svg>
```

---

### Step 5: How It Works
1. **Fetch the Lesson**:
   - The Next.js page sends a GET request to `/api/lessons/1` (proxied to your Django backend, e.g., `http://localhost:8000/api/lessons/1/`).
   - Django returns the lesson data as JSON.

2. **Render the Lesson**:
   - The front-end renders the lesson in Somali, displaying the title, description, question, visual (SVG), and multiple-choice options.
   - Tailwind CSS styles the UI for a clean, responsive layout.

3. **User Interaction**:
   - The user selects an option (e.g., "Ka saar 2s labada dhinac").
   - The "Hubi (Check)" button is enabled once an option is selected.

4. **Submit the Answer**:
   - On clicking "Hubi," the front-end sends a POST request to `/api/lessons/1` with the selected answer (`{ "answer": "Ka saar 2s labada dhinac" }`).
   - Django validates the answer, updates the progress, and returns the updated lesson with feedback.

5. **Display Feedback**:
   - The front-end updates the UI with the feedback, showing "Waxaad saxday!" (Correct!), the explanation, and the updated progress.

---

### Step 6: Best Practices for Visuals and Lesson Types
- **Visuals**:
  - Store SVGs in the `public` directory of Next.js for easy access.
  - In Django, store the SVG URL in the `problem.example.visual` field. For production, consider using a CDN or cloud storage (e.g., AWS S3) to serve images.
  - Optimize SVGs for low-bandwidth: Remove unnecessary metadata and minify the file.

- **Lesson Types**:
  - In Django, the `type` field determines how the `problem` data is structured and validated. For example, a `multiple-choice` lesson requires `options` and `solution`, while a `drag-and-drop` lesson might require `draggableItems` and `initialState`.
  - In Next.js, create a component mapping to handle different lesson types. For example:
    ```jsx
    const LessonComponent = ({ lesson }) => {
      switch (lesson.type) {
        case "multiple-choice":
          return <MultipleChoiceLesson lesson={lesson} />;
        case "drag-and-drop":
          return <DragAndDropLesson lesson={lesson} />;
        default:
          return <div>Unsupported lesson type</div>;
      }
    };
    ```
  - Move the lesson rendering logic to a separate component if you plan to support multiple lesson types.
 