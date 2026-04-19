<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/fb62bde9-2ef0-474c-9461-00d00b7b560f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Troubleshooting (Windows / Automatic1111 stable-diffusion-webui)

If `launch.py` or `webui-user.bat` fails with missing `pkg_resources` / `setuptools` while installing CLIP, run the repair script in this repository.

Typical error message (matches the PowerShell screenshot in the issue report):

```text
ModuleNotFoundError: No module named 'pkg_resources'
```

### Run the repair script (PowerShell)

From your `stable-diffusion-webui` repository root, with your venv activated:

```powershell
# example path (replace with your own repository path)
cd $env:USERPROFILE\sd\stable-diffusion-webui
.\venv\Scripts\Activate.ps1
powershell -ExecutionPolicy Bypass -File .\tools\fix_venv_windows.ps1
```

The script will:
- verify the active virtual environment,
- force-reinstall `pip`, `setuptools`, `wheel`, `setuptools_scm`, and `build`,
- retry CLIP install using `--no-build-isolation`,
- and show Visual C++ Build Tools guidance if compiler tools are missing.

### If repair still fails

Recreate the venv with Python 3.10 (Automatic1111 is tested with Python 3.10.x):

```powershell
# example path (replace with your own repository path)
cd $env:USERPROFILE\sd\stable-diffusion-webui
deactivate
Remove-Item -Recurse -Force .\venv
py -3.10 -m venv .\venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
.\webui-user.bat
```

Python 3.10.6 download: https://www.python.org/downloads/release/python-3106/
