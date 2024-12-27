from flask import Flask, request, render_template, redirect, url_for
from PIL import Image
from collections import Counter
import os
import uuid

# Initialize Flask app
app = Flask(__name__)

# Folder configuration
UPLOAD_FOLDER = os.path.join("static", "uploads")
PROCESSED_FOLDER = os.path.join(UPLOAD_FOLDER, "processed")

# Ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def get_dominant_color(image_path):
    """
    Analyze the image and return the dominant color as an RGB string.
    """
    img = Image.open(image_path)
    img = img.resize((100, 100))  # Resize for faster processing
    pixels = list(img.getdata())
    most_common_color = Counter(pixels).most_common(1)[0][0]
    return f"rgb_{most_common_color[0]}_{most_common_color[1]}_{most_common_color[2]}"


@app.route("/", methods=["GET", "POST"])
def index():
    uploaded_image = None
    if request.method == "POST":
        # Check if a file is included in the request
        if "image" not in request.files or request.files["image"].filename == "":
            return "No file selected or uploaded", 400

        image = request.files["image"]

        # Save the uploaded file temporarily
        temp_path = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
        image.save(temp_path)

        # Analyze and rename the file
        dominant_color = get_dominant_color(temp_path)
        unique_id = uuid.uuid4().hex
        new_filename = f"{dominant_color}_{unique_id}{os.path.splitext(image.filename)[1]}"
        new_path = os.path.join(PROCESSED_FOLDER, new_filename)
        os.rename(temp_path, new_path)

        # Pass the renamed image back to the UI
        uploaded_image = new_filename

    return render_template("rm.html", uploaded_image=uploaded_image)


if __name__ == "__main__":
    app.run(debug=True)