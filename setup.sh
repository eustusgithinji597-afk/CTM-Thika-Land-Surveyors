#!/bin/bash

# CTM Thika Land Surveyors - Local Development Setup Script
# This script automates the complete setup process for local development

set -e

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions for colored output
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}\n"
}

print_error() {
    echo -e "${RED}✗ $1${NC}\n"
    exit 1
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}\n"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}\n"
}

# Check if Node.js is installed
check_nodejs() {
    print_header "STEP 1: Checking Node.js Installation"
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js LTS (v20 or v22) from https://nodejs.org"
    fi
    
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    print_success "Node.js $NODE_VERSION found"
    print_success "npm $NPM_VERSION found"
}

# Check if project directory is correct
check_project_directory() {
    print_header "STEP 2: Verifying Project Directory"
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root directory."
    fi
    
    PROJECT_NAME=$(grep '"name"' package.json | head -1 | awk -F'"' '{print $4}')
    print_success "Project directory verified: $PROJECT_NAME"
}

# Clear npm cache
clear_npm_cache() {
    print_header "STEP 3: Clearing npm Cache"
    
    print_info "Clearing npm cache for clean installation..."
    npm cache clean --force
    print_success "npm cache cleared"
}

# Install dependencies
install_dependencies() {
    print_header "STEP 4: Installing Dependencies"
    
    print_info "Installing project dependencies (this may take 2-5 minutes)..."
    
    if npm install --legacy-peer-deps; then
        INSTALLED_COUNT=$(npm list --depth=0 | grep -c '@' || true)
        print_success "Dependencies installed successfully ($INSTALLED_COUNT packages)"
    else
        print_error "Failed to install dependencies. Please check your internet connection and try again."
    fi
}

# Verify database configuration
verify_database() {
    print_header "STEP 5: Verifying Database Configuration"
    
    if [ -f ".env.example" ] && [ ! -f ".env.local" ]; then
        print_warning "No .env.local file found. Creating from .env.example..."
        cp .env.example .env.local
        print_info "Created .env.local. Please configure your environment variables."
    fi
    
    if command -v npx &> /dev/null; then
        print_info "Checking database schema..."
        npx drizzle-kit check || print_warning "Database schema check skipped"
        print_success "Database verification complete"
    else
        print_warning "npx not found, skipping database check"
    fi
}

# Create VS Code workspace settings
setup_vscode() {
    print_header "STEP 6: Configuring VS Code Workspace"
    
    if [ ! -d ".vscode" ]; then
        mkdir -p .vscode
        print_info "Created .vscode directory"
    fi
    
    if [ -f ".vscode/settings.json" ]; then
        print_success "VS Code settings already configured"
    else
        print_warning ".vscode/settings.json not found"
    fi
    
    if [ -f ".vscode/extensions.json" ]; then
        print_success "VS Code extensions list configured"
    else
        print_warning ".vscode/extensions.json not found"
    fi
}

# Test build
test_build() {
    print_header "STEP 7: Testing Project Build"
    
    print_info "Running initial build... (this may take 3-5 minutes)"
    
    if npm run build; then
        print_success "Project build successful"
    else
        print_error "Project build failed. Please check for TypeScript or configuration errors."
    fi
}

# Final instructions
print_final_instructions() {
    print_header "SETUP COMPLETE"
    
    echo -e "${GREEN}Your local development environment is ready!${NC}\n"
    
    echo "To start developing:"
    echo -e "${BLUE}npm run dev${NC}"
    echo ""
    echo "The application will be available at:"
    echo -e "${BLUE}http://localhost:3000${NC}"
    echo ""
    echo "For more information, see LOCAL_SETUP.md"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║   CTM Thika Land Surveyors - Local Setup Script           ║"
    echo "║   Complete Development Environment Configuration           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_nodejs
    check_project_directory
    clear_npm_cache
    install_dependencies
    verify_database
    setup_vscode
    test_build
    print_final_instructions
}

# Run main function
main
