#!/bin/bash

# AWS S3 Deployment Script for Angular Frontend
# This script builds the Angular application and deploys it to an AWS S3 bucket

# Exit on error
set -e

# Configuration
S3_BUCKET_NAME="kevinprojectmybucket"
REGION="eu-west-1" # AWS region

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

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

# Build the Angular application
echo -e "${YELLOW}Building the Angular application...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}Build failed. 'dist' directory not found.${NC}"
    exit 1
fi

# We're using a direct dist output path in angular.json
BUILD_DIR="dist"
echo -e "${YELLOW}Using build directory: ${BUILD_DIR}${NC}"

# Deploy to S3
echo -e "${YELLOW}Deploying to S3 bucket: ${S3_BUCKET_NAME}...${NC}"

# Check if bucket exists, create if it doesn't
if ! aws s3 ls "s3://${S3_BUCKET_NAME}" &> /dev/null; then
    echo -e "${YELLOW}Bucket does not exist. Creating bucket...${NC}"
    aws s3 mb "s3://${S3_BUCKET_NAME}" --region "${REGION}"
    
    # Configure bucket for static website hosting
    aws s3 website "s3://${S3_BUCKET_NAME}" --index-document index.html --error-document index.html
    
    # Set bucket policy to allow public read access
    POLICY='{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::'${S3_BUCKET_NAME}'/*"
            }
        ]
    }'
    
    echo "${POLICY}" > /tmp/bucket-policy.json
    aws s3api put-bucket-policy --bucket "${S3_BUCKET_NAME}" --policy file:///tmp/bucket-policy.json
    rm /tmp/bucket-policy.json
fi

# Sync the build directory with the S3 bucket - simplified approach
echo -e "${YELLOW}Uploading files to S3...${NC}"

# First, clear the bucket to ensure no old files remain
aws s3 rm "s3://${S3_BUCKET_NAME}" --recursive

# Then upload all files with a single sync command
aws s3 sync "${BUILD_DIR}/" "s3://${S3_BUCKET_NAME}" --delete

# Verify the upload
echo -e "${YELLOW}Verifying upload...${NC}"
aws s3 ls "s3://${S3_BUCKET_NAME}" --recursive

# Set proper permissions for public access
echo -e "${YELLOW}Setting proper permissions for public access...${NC}"
aws s3api put-bucket-policy --bucket "${S3_BUCKET_NAME}" --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'${S3_BUCKET_NAME}'/*"
        }
    ]
}'

# Get the website URL
WEBSITE_URL="http://${S3_BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Your website is available at: ${WEBSITE_URL}${NC}"
