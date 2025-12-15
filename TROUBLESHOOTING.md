# Troubleshooting Guide

## Login Error: "An error occurred. Please try again."

If you're seeing this error when trying to log in, follow these steps:

### Step 1: Restart the Server
The server needs to be restarted to load the new authentication code.

1. **Stop the current server:**
   - In the terminal where the server is running, press `Ctrl + C`

2. **Start the server again:**
   ```powershell
   npm start
   ```
   OR
   ```powershell
   node server.js
   ```

3. **Verify the server started:**
   - You should see: `Server running at http://localhost:3000`
   - You should see login attempts logged in the console

### Step 2: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try logging in again
4. Check for any error messages

### Step 3: Verify Server is Running
Open a new terminal and run:
```powershell
netstat -ano | findstr :3000
```
You should see the server listening on port 3000.

### Step 4: Test Login Credentials
Default credentials:
- **Username:** `admin`
- **Password:** `admin123`

### Step 5: Check Network Tab
1. Open Developer Tools (F12)
2. Go to the Network tab
3. Try logging in
4. Look for the `/api/login` request
5. Check the response status and body

### Common Issues:

**Issue: Server not running**
- Solution: Start the server using `npm start` or `node server.js`

**Issue: Port 3000 already in use**
- Solution: Stop other processes using port 3000, or change the PORT in server.js

**Issue: CORS error**
- Solution: Make sure `cors` is installed: `npm install cors`

**Issue: Cannot connect to server**
- Solution: Make sure you're accessing the site via `http://localhost:3000` not `file://`

### Still Having Issues?

Check the server console for error messages. The server now logs:
- Login attempts
- Successful logins
- Failed login attempts
- Any server errors

If the problem persists, check:
1. Node.js version (should be 14+)
2. All dependencies are installed: `npm install`
3. No firewall blocking port 3000

