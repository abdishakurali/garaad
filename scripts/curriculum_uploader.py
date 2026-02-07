import requests
import json
import os

API_URL = "https://api.garaad.org/api" # Verify this in src/config/index.ts
AUTH_TOKEN = "YOUR_TOKEN_HERE" # User needs to provide this

def upload_video(file_path, title):
    url = f"{API_URL}/lms/videos/"
    files = {
        'video_file': open(file_path, 'rb'),
    }
    data = {
        'title': title,
        'description': f"Video for lesson: {title}",
        'video_source_type': 'telegram'
    }
    headers = {
        'Authorization': f'Bearer {AUTH_TOKEN}'
    }
    
    print(f"Uploading {title}...")
    response = requests.post(url, files=files, data=data, headers=headers)
    
    if response.status_code == 201:
        result = response.json()
        print(f"✅ Uploaded! Video ID: {result.get('id')}")
        return result
    else:
        print(f"❌ Upload failed: {response.status_code} - {response.text}")
        return None

def update_lesson_block(lesson_id, video_data):
    # This part depends on how you want to update the existing lesson blocks.
    # Usually, you'd fetch the lesson, find the video block, and update its content.
    url = f"{API_URL}/lms/lessons/{lesson_id}/"
    headers = {
        'Authorization': f'Bearer {AUTH_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    # Placeholder for the update logic
    # In Garaad, you might need to update a specific ContentBlock via lms/content-blocks/
    print(f"Updating lesson {lesson_id} with video {video_data.get('video_url')}...")
    # ... logic to find and update the video block ...

if __name__ == "__main__":
    # Example usage
    # with open("segments.json", "r") as f:
    #    segments = json.load(f)
    print("Script ready. Please provide AUTH_TOKEN and run manually.")
