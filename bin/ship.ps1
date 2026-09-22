# Manual deploy: commit any pending changes, push to GitHub, deploy to Fly.io.
# Nothing happens automatically on commit/push alone — this script is the only
# thing that deploys, and only when you run it yourself.
#
# Usage: bin\ship.ps1 "commit message"
#        bin\ship.ps1              (if there's nothing to commit, just deploys HEAD)

param(
    [Parameter(Position = 0)]
    [string]$Message
)

$ErrorActionPreference = "Stop"

$status = git status --porcelain
if ($status) {
    if (-not $Message) {
        Write-Error "Uncommitted changes present - pass a commit message: bin\ship.ps1 'your message'"
        exit 1
    }
    git add -A
    git commit -m $Message
} else {
    Write-Host "Nothing to commit - deploying current HEAD."
}

Write-Host "Pushing to GitHub..."
git push

Write-Host "Deploying to Fly.io..."
flyctl deploy --remote-only
