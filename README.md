# BigQuery Release Notes App

A modern, responsive web application that fetches and displays the live [Google Cloud BigQuery Release Notes](https://cloud.google.com/bigquery/docs/release-notes). 

Built with a lightweight Python backend and a beautiful, glassmorphism-inspired vanilla HTML/JS/CSS frontend.

## Features

- **Live Data**: Automatically pulls the latest release notes directly from Google's official XML Atom feed.
- **Modern UI/UX**: Premium aesthetic featuring dark mode, gradient text, smooth micro-animations, and glassmorphism styling.
- **Twitter Integration**: Includes a custom Twitter Composer modal that previews your tweet and counts characters before you share an update.
- **CORS Middleware**: Utilizes a Python Flask proxy to securely fetch cross-origin data without browser restrictions.

## Tech Stack

**Frontend:**
- HTML5
- CSS3 (Vanilla, CSS Variables, Flexbox, Animations)
- JavaScript (Vanilla, Fetch API, DOM Manipulation)

**Backend:**
- Python 3
- Flask (Web Framework)
- Requests (HTTP Library)
- xml.etree.ElementTree (XML Parsing)

## Getting Started

### Prerequisites
Make sure you have Python 3 installed on your machine.

### Installation & Running Locally

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/timothywheelspro/antigravity-event-talks-app.git
   cd antigravity-event-talks-app
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install the dependencies**:
   ```bash
   pip install flask requests
   ```

4. **Run the Flask server**:
   ```bash
   python app.py
   ```

5. **View the application**:
   Open your browser and navigate to `http://localhost:8080`.

## Project Structure

```text
bq-release-notes/
├── app.py                  # Main Flask backend server and API proxy
├── templates/
│   └── index.html          # Main HTML structure and Twitter modal
└── static/
    ├── css/
    │   └── styles.css      # Custom styling, animations, and responsive design
    └── js/
        └── script.js       # Data fetching, DOM rendering, and modal logic
```
