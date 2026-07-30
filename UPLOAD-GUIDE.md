# Upload to GitHub — step by step

A clean copy of your simulations is ready here:

`e:\0 HKDSE Biology\hkdse-biology-sims`

(~13–15 MB — cover page + cortex sims + Make a Baby)

Follow **either** Path A (easiest) or Path B (command line).

---

## Path A — GitHub Desktop (recommended)

### 1. Create a GitHub account (skip if you have one)
1. Go to https://github.com/signup  
2. Sign up and verify your email.

### 2. Install GitHub Desktop
1. Go to https://desktop.github.com/  
2. Download and install **GitHub Desktop**.  
3. Open it and sign in with your GitHub account.

### 3. Create a new repository on GitHub
1. Open https://github.com/new  
2. **Repository name:** `hkdse-biology-sims`  
3. Description (optional): `HKDSE Biology interactive classroom simulations`  
4. Choose **Public** (needed for free GitHub Pages)  
5. **Do not** tick “Add a README” (we already have files)  
6. Click **Create repository**

### 4. Add your local folder in GitHub Desktop
1. In GitHub Desktop: **File → Add local repository…**  
2. If it says the folder is not a Git repository, click **create a repository**  
   - Name: `hkdse-biology-sims`  
   - Local path: choose `e:\0 HKDSE Biology\hkdse-biology-sims`  
   - Leave Git ignore / license empty  
3. Or: **File → Add local repository** → Browse to  
   `e:\0 HKDSE Biology\hkdse-biology-sims`

If the folder is not yet a git repo, use **File → New repository** and set the local path to that folder (do not create an extra nested folder).

### 5. First commit
1. You should see many new files listed.  
2. At the bottom left, Summary: `Add HKDSE Biology interactive simulations`  
3. Click **Commit to main**

### 6. Publish to GitHub
1. Click **Publish repository**  
2. Untick “Keep this code private” if you want a public site  
3. Confirm **Publish repository**

### 7. Turn on GitHub Pages (so students can open in a browser)
1. Open your repo on github.com:  
   `https://github.com/YOUR_USERNAME/hkdse-biology-sims`  
2. Go to **Settings** → **Pages** (left sidebar)  
3. Under **Build and deployment → Source**, choose **Deploy from a branch**  
4. Branch: **main** · Folder: **/ (root)**  
5. Click **Save**  
6. Wait 1–2 minutes, then refresh the Pages settings  

Your site URL will look like:

`https://YOUR_USERNAME.github.io/hkdse-biology-sims/`

That is your cover page. Share this link with students.

### 8. Test
1. Open the Pages URL above  
2. Click each simulation card  
3. Confirm Sensory, Motor, and Make a Baby all load  

---

## Path B — Command line (Git)

### 1–2. Account + install Git
1. GitHub account: https://github.com/signup  
2. Install Git for Windows: https://git-scm.com/download/win  
3. Restart PowerShell after install  

### 3. Create empty repo on GitHub
Same as Path A step 3 (`hkdse-biology-sims`, Public, no README).

### 4–6. Push from PowerShell

```powershell
cd "e:\0 HKDSE Biology\hkdse-biology-sims"
git init
git add .
git commit -m "Add HKDSE Biology interactive simulations"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hkdse-biology-sims.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Sign in when asked.

### 7–8. GitHub Pages + test
Same as Path A steps 7–8.

---

## Later: when you add a new simulation

1. Put the new HTML (and its images) into `e:\0 HKDSE Biology\hkdse-biology-sims`  
2. Add a card link in `index.html`  
3. In GitHub Desktop: write a short summary → **Commit** → **Push origin**  
4. Pages updates in about a minute  

---

## If something goes wrong

| Problem | Fix |
|--------|-----|
| Push rejected / login failed | Use GitHub Desktop, or create a Personal Access Token when Git asks for a password |
| Pages 404 | Wait 2 minutes; check Settings → Pages shows green “Your site is live” |
| Make a Baby faces blank | Confirm `make-a-baby-app/chromosome_sim/sprites/` was uploaded |
| Wrong folder uploaded | Only use `hkdse-biology-sims`, not the whole `Grok 4.5` folder |

---

## Optional: update working copies’ Home links
Your working sims in `Grok 4.5` still use the old Make a Baby folder name. The **upload copy** uses `make-a-baby-app` (no spaces — better for the web).
