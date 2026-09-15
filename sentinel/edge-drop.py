# edge-drop.py - Sovereign Infrastructure Edge Drop Webhook
# Intercepts inbound digital demands, evaluates value, and enforces hard firewall drop.
#
# Inputs (POST / with JSON body):
#   1. Generic demand      {"task": "...", "value": "low|high"}
#   2. Git push event      {"event": "git-push", "repo": "...", "branch": "...",
#                           "commits": [{"sha": "...", "message": "..."}], "files": ["..."]}
# GET /health returns 200 so the Canary can verify the daemon itself.

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import re
import sys

PORT = 8081

# Deterministic drop rules for git pushes. Match => 403, push refused.
LOW_VALUE_COMMIT = re.compile(r'^\s*(wip|fixup!|squash!|tmp|temp|asdf|test commit)\b', re.IGNORECASE)
FORBIDDEN_PATHS = re.compile(r'(^|/)(\.env(\..*)?|\.vitepress/cache|node_modules|\.DS_Store)(/|$)')


def evaluate_git_push(payload):
    """Return (accepted: bool, reason: str)."""
    for commit in payload.get("commits", []):
        msg = commit.get("message", "")
        if LOW_VALUE_COMMIT.search(msg):
            return False, f"low-value commit message: '{msg[:60]}' ({commit.get('sha', '')[:7]})"
    for path in payload.get("files", []):
        if FORBIDDEN_PATHS.search(path):
            return False, f"forbidden path in push: '{path}'"
    return True, f"{len(payload.get('commits', []))} commit(s) to {payload.get('branch', '?')}"


class WebhookHandler(BaseHTTPRequestHandler):
    def _reply(self, code, body):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write((json.dumps(body) + "\n").encode())

    def do_GET(self):
        if self.path == '/health':
            self._reply(200, {"status": "ok", "service": "edge-drop", "port": PORT})
        else:
            self._reply(404, {"status": "error", "message": "not found"})

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data)
        except json.JSONDecodeError:
            self._reply(400, {"status": "error", "message": "Malformed JSON payload"})
            print("[ERROR] Malformed JSON payload received.", flush=True)
            return

        # Rule set 2: git push gate
        if payload.get("event") == "git-push":
            accepted, reason = evaluate_git_push(payload)
            repo = payload.get("repo", "?")
            if accepted:
                self._reply(200, {"status": "accepted", "reason": reason})
                print(f"[ACCEPTED] git-push {repo}: {reason}", flush=True)
            else:
                self._reply(403, {"status": "dropped", "reason": reason})
                print(f"[DROPPED] git-push {repo}: {reason}", flush=True)
            return

        # Rule set 1: generic demand (original firewall rule)
        if payload.get("value") == "low":
            self._reply(403, {"status": "dropped", "reason": "Low-value demand intercepted at edge"})
            print(f"[DROPPED] Low-value demand intercepted: '{payload.get('task', 'unspecified')}'", flush=True)
        else:
            self._reply(200, {"status": "accepted", "message": "High-value payload passed the filter"})
            print(f"[ACCEPTED] High-value payload passed the filter: '{payload.get('task', 'unspecified')}'", flush=True)

    def log_message(self, format, *args):
        sys.stderr.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), format % args))
        sys.stderr.flush()


if __name__ == '__main__':
    print(f"Starting Edge Drop Webhook on port {PORT}...", flush=True)
    HTTPServer(('', PORT), WebhookHandler).serve_forever()
