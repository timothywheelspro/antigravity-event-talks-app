import xml.etree.ElementTree as ET
import requests
from flask import Flask, render_template, jsonify

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/notes')
def get_notes():
    try:
        response = requests.get(FEED_URL)
        response.raise_for_status()
        root = ET.fromstring(response.content)
        
        namespace = {'atom': 'http://www.w3.org/2005/Atom'}
        entries = []
        for entry in root.findall('atom:entry', namespace):
            title = entry.find('atom:title', namespace).text
            updated = entry.find('atom:updated', namespace).text
            link = entry.find('atom:link', namespace).attrib['href']
            content = entry.find('atom:content', namespace).text
            
            entries.append({
                'title': title,
                'updated': updated,
                'link': link,
                'content': content
            })
            
        return jsonify({'status': 'success', 'data': entries})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)
