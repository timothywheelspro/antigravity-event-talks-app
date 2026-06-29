# Module 3: Collapsing the Stack (Integration)

In Module 2, you wrote an `exit 1` condition into a bash script. You taught your machine how to drop a process if the return value did not meet your strict requirements.

Now, we collapse the stack. We are going to apply that exact same firewall logic to your own cognitive Bandwidth. 

## 3.1 The Isomorphism

An isomorphism is a structural mapping where two different systems operate under the exact same rules. 

In technical architecture, you never expose port 22 to the public internet. You configure a firewall to drop unauthorized traffic at the network edge so your origin server doesn't waste CPU cycles processing junk packets.

In **Attention Architecture**, your baseline identity and your daily focus are the origin server. If you allow algorithmic feeds, low-value emails, and endless notifications to reach you unvetted, you are exposing port 22 to the public. 

The psychological equivalent of a firewall is a hard boundary. Setting a boundary is not about being aggressive; it is about protecting the origin. If a task or demand does not meet your required value threshold, you must drop it at the edge.

## 3.2 Agentic Delegation (Concept)

You don't have to process every packet yourself. You can delegate the load using a **Model-Router**. 

If a task is low-value but necessary (e.g., formatting data, linting text), route it to a fast, local "Workhorse" LLM like **Ollama running `llama3` or `phi3`** on your Sentinel node. Save your own cognitive processing power (the "Heavy Engine") for deep architectural work that actually moves the needle.

*Never use a sledgehammer to drive a nail, and never use your own Bandwidth for a task a local script can handle.*

*(Note: Building out the full Ollama routing infrastructure is covered in a future standalone module. For now, understand the architecture.)*

---

## 3.3 The Final Move: The Edge Drop (Capstone Lab)

This is the ultimate payoff. You are going to write a webhook handler that intercepts inbound digital demands. It will parse the incoming payload, evaluate its value, and actively drop the request if it fails the filter. 

**The Deliverable:**
Write and deploy a local Python webhook on your Sentinel node that intercepts an HTTP POST request, reads the JSON payload, and returns a `403 Forbidden` if the demand is deemed "low-value", ensuring it never reaches your log.

**Instructions:**

1. Navigate to your Sentinel core directory:
```bash
cd ~/sentinel-core
```

2. Create the webhook script:
```bash
touch edge-drop.py
```

3. Open the file and drop in this exact routing logic. Notice the hard drop condition:

```python
# edge-drop.py
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            print("[ERROR] Malformed JSON payload received.")
            return

        # The Firewall Rule:
        if payload.get("value") == "low":
            self.send_response(403)
            self.end_headers()
            print("[DROPPED] Low-value demand intercepted.")
        else:
            self.send_response(200)
            self.end_headers()
            print("[ACCEPTED] High-value payload passed the filter.")

print("Starting Edge Drop Webhook on port 8081...")
HTTPServer(('', 8081), WebhookHandler).serve_forever()
```

4. Boot the webhook in a new terminal window:
```bash
python3 edge-drop.py
```

5. Open another terminal and simulate a low-value demand hitting your network:
```bash
curl -X POST http://localhost:8081 \
  -H "Content-Type: application/json" \
  -d '{"task": "random meeting request", "value": "low"}'
```

Check your webhook terminal. You will see `[DROPPED] Low-value demand intercepted.` 

You have successfully written a script that protects your time. You don't control the syntax; you control the system. You are now officially operating on Sovereign Infrastructure.
