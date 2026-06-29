# Module 2: Sovereign Infrastructure (Action)

If you followed Module 1, you now have a map of your network. Now it is time to build the infrastructure required to defend it. 

We are moving your operations off "The Road" (rent-seeking algorithms and leased cloud infrastructure) and onto an origin node you physically control. We call this the **Sentinel**.

## 2.1 The Origin Core (Lab)

A Sentinel node does not require a data center. It requires a machine running in your physical proximity (a Mac Mini, a Raspberry Pi, or an old laptop) that executes your automated tasks, runs your local LLMs, and hosts your personal routing scripts.

**The Deliverable:**
Initialize a local execution environment and stand up a persistent background service.

**Instructions (macOS / Debian):**

1. Create the working directory on your Sentinel hardware:
```bash
mkdir -p ~/sentinel-core && cd ~/sentinel-core
```

2. Boot a lightweight origin service. For this lab, we will use a native Python HTTP server to represent your Sovereign infrastructure. We will run it in the background using `nohup`:
```bash
nohup python3 -m http.server 8080 > origin.log 2>&1 &
```

3. Verify the node is alive by polling it locally:
```bash
curl -I http://localhost:8080
```
*You should receive a `HTTP/1.0 200 OK` response.* 

*(Note: To stop this background service when finished, run `pkill -f "http.server 8080"`)*

Your Sentinel is now online. It is time to enforce the protocol.

---

## 2.2 The Canary Protocol (Lab)

The most dangerous thing an automated system can do is lie to you about success. 

If a script fires and blindly logs "Task Complete" without confirming the result, it creates a hallucinated reality. The **Canary Protocol** is an engineering discipline known as *Verify-Before-Logging*. 

You do not write to the database, you do not send the slack ping, and you do not claim victory until a deterministic network check confirms the payload actually landed.

**The Deliverable:**
Write an executable bash script that enforces the Canary Protocol against the origin service you just booted.

**Instructions:**

1. Navigate to your working directory and create the script file:
```bash
cd ~/sentinel-core
touch canary-deploy.sh && chmod +x canary-deploy.sh
```

2. Open the file in your editor and drop in this exact logic. Notice that the script refuses to echo "Deploy Successful" unless the exact HTTP status code is a confirmed `200`.

```bash
#!/bin/bash
# canary-deploy.sh

TARGET_URL="http://localhost:8080"
LOG_FILE="canary.log"

echo "Executing deploy payload..."
# (Simulated deployment logic would run here)

echo "Initiating Canary verification on $TARGET_URL..."

# Fetch the raw HTTP status code
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL")

if [ "$STATUS_CODE" -eq 200 ]; then
    echo "$(date) - VERIFIED: Origin returned 200 OK." >> "$LOG_FILE"
    echo "Success logged. Terminating protocol."
else
    echo "$(date) - FAILED: Origin returned $STATUS_CODE. No log written."
    exit 1
fi
```

3. Execute the protocol:
```bash
./canary-deploy.sh
```

Read your `canary.log` file. 
**The entry should read: `VERIFIED: Origin returned 200 OK`. If you see `FAILED`, your origin service has stopped — re-run step 2 of Lab 2.1.**

The `exit 1` in that script is the move. In Module 3 you will write the same exit condition — but the trigger will not be a failed HTTP response. It will be a failed value-to-cost ratio.
