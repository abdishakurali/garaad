import subprocess
import json
import os
import sys

FFMPEG_PATH = "/Users/rooble/Documents/garaad_front/scripts/ffmpeg_tool/node_modules/ffmpeg-static/ffmpeg"

def split_video(input_file, segments):
    if not os.path.exists("segments"):
        os.makedirs("segments")

    for segment in segments:
        output_file = f"segments/lesson_{segment['lesson_id']}.mp4"
        print(f"Spliting {segment['title']}...")
        
        cmd = [
            FFMPEG_PATH, "-y",
            "-i", input_file,
            "-ss", segment['start'],
            "-to", segment['end'],
            "-c:v", "libx264",
            "-crf", "23",
            "-preset", "veryfast",
            "-c:a", "aac",
            "-b:a", "128k",
            "-vf", "scale=-2:720",
            output_file
        ]
        
        try:
            subprocess.run(cmd, check=True)
            print(f"✅ Created {output_file}")
            # Generate thumbnail
            thumb_file = f"segments/lesson_{segment['lesson_id']}.jpg"
            thumb_cmd = [
                FFMPEG_PATH, "-y",
                "-i", output_file,
                "-ss", "00:00:01",
                "-vframes", "1",
                thumb_file
            ]
            subprocess.run(thumb_cmd, check=True)
            print(f"📸 Created thumbnail {thumb_file}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to split {segment['title']}: {e}")

if __name__ == "__main__":
    # Look for segments.json in the same directory as the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    segments_path = os.path.join(script_dir, "segments.json")
    
    # Check if html&css.mp4 exists in the root or scripts dir
    video_path = "html&css.mp4"
    if not os.path.exists(video_path):
        # Try parent dir
        video_path = os.path.join(os.path.dirname(script_dir), "html&css.mp4")
    
    if not os.path.exists(video_path):
        print(f"❌ Video file not found: {video_path}")
        sys.exit(1)
        
    with open(segments_path, "r") as f:
        segments = json.load(f)
    
    # Ensure we output to scripts/segments relative to this script
    os.chdir(script_dir)
    split_video(video_path, segments)
