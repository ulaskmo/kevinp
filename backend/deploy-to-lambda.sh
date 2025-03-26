#!/bin/bash

# AWS Lambda Deployment Script for Backend
# This script deploys the backend to AWS Lambda using the Serverless Framework

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting backend deployment process...${NC}"

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo -e "${RED}Serverless Framework is not installed. Installing it now...${NC}"
    npm install -g serverless
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    echo "Visit https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html for installation instructions."
    exit 1
fi

# Check if user is logged in to AWS
echo -e "${YELLOW}Checking AWS credentials...${NC}"
aws sts get-caller-identity &> /dev/null || {
    echo -e "${RED}Not logged in to AWS. Please run 'aws configure' to set up your credentials.${NC}"
    exit 1
}

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Install Serverless plugins
echo -e "${YELLOW}Installing Serverless plugins...${NC}"
npm install --save-dev serverless-offline serverless-dotenv-plugin

# Build the TypeScript code
echo -e "${YELLOW}Building the TypeScript code...${NC}"
npm run build

# Deploy to AWS Lambda
echo -e "${YELLOW}Deploying to AWS Lambda...${NC}"
serverless deploy --verbose

echo -e "${GREEN}Backend deployment completed successfully!${NC}"
echo -e "${GREEN}Your API is now available at the URL shown above.${NC}"
echo -e "${YELLOW}Important: Update the frontend environment.prod.ts file with the API Gateway URL.${NC}"
