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

# Create necessary directories for serverless deployment
echo -e "${YELLOW}Creating necessary directories for deployment...${NC}"
mkdir -p build/lambda

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Install Serverless plugins
echo -e "${YELLOW}Installing Serverless plugins...${NC}"
npm install --save-dev serverless-offline serverless-dotenv-plugin

# Build the TypeScript code
echo -e "${YELLOW}Building the TypeScript code...${NC}"
npm run build

# Create serverless handlers
echo -e "${YELLOW}Creating serverless handlers...${NC}"
cat > build/serverless.js << 'EOF'
const { handler } = require('./index');
module.exports.handler = handler;
EOF

cat > build/lambda/serverless.js << 'EOF'
const { handler } = require('../lambda/index');
module.exports.handler = handler;
EOF

# Deploy to AWS Lambda
echo -e "${YELLOW}Deploying to AWS Lambda...${NC}"
serverless deploy --verbose

# Get the API Gateway URL
API_URL=$(serverless info --verbose | grep -o 'https://[^[:space:]]*.amazonaws.com/prod')

if [ -n "$API_URL" ]; then
    echo -e "${GREEN}Backend deployment completed successfully!${NC}"
    echo -e "${GREEN}Your API is now available at: ${API_URL}${NC}"
    echo -e "${YELLOW}Important: Update the frontend environment.prod.ts file with these values:${NC}"
    echo -e "${YELLOW}apiUrl: '${API_URL}/api'${NC}"
    echo -e "${YELLOW}lambdaUrl: '${API_URL}/lambda'${NC}"
else
    echo -e "${RED}Deployment may have succeeded, but couldn't extract the API URL.${NC}"
    echo -e "${RED}Please check the Serverless output above for your API Gateway URL.${NC}"
fi
