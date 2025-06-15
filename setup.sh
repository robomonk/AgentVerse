#!/bin/bash

# ==============================================================================
#         Nix-based Development Environment Startup Script
#
# Description:
#   This script automates the setup of a Nix development environment.
#   It handles private repositories using a GitHub Access Token, clones
#   or updates the repo, and launches a Nix shell to build the environment.
#
# Usage:
#   1. For private repos, set the GITHUB_TOKEN environment variable:
#      export GITHUB_TOKEN='your_github_personal_access_token'
#   2. Save the script as `start-dev.sh`.
#   3. Make it executable: `chmod +x start-dev.sh`
#   4. Run it: `./start-dev.sh`
# ==============================================================================

# --- Configuration ---
# !!! IMPORTANT: Update these variables if your project details change. !!!

# The full URL of the Git repository that contains your Nix file.
GIT_REPO_URL="https://github.com/robomonk/AgentVerse.git"

# The name of the directory that `git clone` will create.
REPO_DIR="AgentVerse"
GITHUB_TOKEN="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"

# The name of your Nix file within the repository.
# Common names are `shell.nix` or `default.nix`.
# If using Nix Flakes, this might be `flake.nix`, and you should change
# the command in step 5 to `nix develop`.
NIX_FILE="shell.nix"

# --- End of Configuration ---


# Exit the script immediately if any command fails.
set -e

echo "🚀 Starting development environment setup..."
echo "-------------------------------------------"

# --- 1. Prerequisite Check ---
# Verify that Git and Nix are installed on the system.
echo "[1/5] Checking for required tools (Git and Nix)..."
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed. Please install it to continue."
    exit 1
fi

if ! command -v nix-shell &> /dev/null; then
    echo "❌ Error: Nix is not installed. Please install it to continue."
    exit 1
fi
echo "✅ Tools are installed."
echo

# --- 2. Authentication for Private Repos ---
# Check for a GitHub token to use for private repository authentication.
# This prevents credentials from being hardcoded in the script.
CLONE_URL=$GIT_REPO_URL
echo "[2/5] Configuring Git repository access..."
# Check if it's a private repo and a token is provided
if [[ "$GIT_REPO_URL" == "https://github.com"* ]] && [ -n "$GITHUB_TOKEN" ]; then
    echo "   -> GITHUB_TOKEN environment variable found. Preparing for authenticated clone."
    # The 'x-access-token' user is a special value for GitHub tokens.
    CLONE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${GIT_REPO_URL#https://github.com/}"
else
    echo "   -> No GITHUB_TOKEN found. Proceeding with public access."
fi
echo "✅ Git access configured."
echo

# --- 3. Repository Management ---
# Clone the repository if it doesn't exist locally.
# If it does exist, pull the latest changes to ensure it's up to date.
echo "[3/5] Syncing Git repository..."
if [ -d "$REPO_DIR" ]; then
    echo "   -> Repository '$REPO_DIR' found. Pulling latest changes..."
    # We navigate into the directory to run git pull
    (cd "$REPO_DIR" && git pull)
else
    echo "   -> Cloning repository from '$GIT_REPO_URL'..."
    git clone "$CLONE_URL" "$REPO_DIR"
fi
echo "✅ Repository is up to date."
echo

# Change into the repository directory for the subsequent steps
cd "$REPO_DIR"

# --- 4. Verify Nix File ---
# Check if the specified Nix file exists in the repository before trying to use it.
echo "[4/5] Verifying Nix configuration file..."
if [ ! -f "$NIX_FILE" ]; then
    echo "❌ Error: Nix file '$NIX_FILE' not found in the repository."
    echo "   Please check the NIX_FILE variable in this script and your repository's contents."
    exit 1
fi
echo "✅ Found Nix file: '$NIX_FILE'."
echo

# --- 5. Launch Nix Shell ---
# This is the final step where Nix takes over. It will read the .nix file,
# download and build all specified dependencies, and drop you into a new
# shell with the complete environment ready to use.
echo "[5/5] Building and launching the Nix environment..."
echo "   -> This may take a while on the first run."
echo

# Note: If you are using Flakes, you should change this command to `nix develop`.
nix-shell "$NIX_FILE"

echo "-------------------------------------------"
echo "✅ Exited Nix Shell. Have a great day!"