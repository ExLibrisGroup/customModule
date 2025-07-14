# AWS S3 Deployment Best Practices for CircleCI

## Overview

This guide covers the best practices for uploading static files to AWS S3 in CircleCI pipelines, with multiple approaches and security considerations.

## Method 1: AWS CLI (Recommended)

### Setup

1. **Add AWS CLI Orb to your config.yml:**

```yaml
orbs:
  aws-cli: circleci/aws-cli@4.1
```

2. **Configure Environment Variables in CircleCI:**

   - Go to Project Settings → Environment Variables
   - Add these variables:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `AWS_DEFAULT_REGION` (e.g., `us-east-1`)
     - `AWS_BUCKET` (your S3 bucket name)

3. **Create a deployment job:**

```yaml
deploy-to-s3:
  <<: *settings
  steps:
    - checkout
    - restore_cache:
        <<: *package-cache
    - run:
        name: Install project dependencies
        command: |
          npm ci --loglevel verbose
    - run:
        name: Build project
        command: |
          npm run build
    - aws-cli/install
    - run:
        name: Upload to S3
        command: |
          aws s3 sync dist/THIRD-IRON-LIBKEY s3://$AWS_BUCKET/primo-nde/staging \
            --delete \
            --cache-control "max-age=31536000,public" \
            --exclude "*.html" \
            --exclude "*.json"
    - run:
        name: Upload HTML files with no-cache
        command: |
          aws s3 sync dist/THIRD-IRON-LIBKEY s3://$AWS_BUCKET/primo-nde/staging \
            --delete \
            --cache-control "no-cache,no-store,must-revalidate" \
            --include "*.html" \
            --include "*.json"
```

### Key Features:

- **`--delete`**: Removes files from S3 that don't exist locally
- **Cache Control**: Different strategies for static assets vs HTML files
- **Incremental uploads**: Only uploads changed files
- **Error handling**: Fails fast if credentials are invalid

## Method 2: Using AWS CLI with IAM Roles (More Secure)

For production environments, use IAM roles instead of access keys:

```yaml
deploy-to-s3-secure:
  <<: *settings
  steps:
    - checkout
    - restore_cache:
        <<: *package-cache
    - run:
        name: Install project dependencies
        command: |
          npm ci --loglevel verbose
    - run:
        name: Build project
        command: |
          npm run build
    - aws-cli/install
    - run:
        name: Upload to S3 using IAM role
        command: |
          aws s3 sync dist/THIRD-IRON-LIBKEY s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER \
            --delete \
            --cache-control "max-age=31536000,public"
```

## Method 3: Using S3 Deploy Orb

```yaml
orbs:
  s3-deploy: circleci/s3-deploy@1.0

jobs:
  deploy-to-s3-orb:
    <<: *settings
    steps:
      - checkout
      - restore_cache:
          <<: *package-cache
      - run:
          name: Install project dependencies
          command: |
            npm ci --loglevel verbose
      - run:
          name: Build project
          command: |
            npm run build
      - s3-deploy/deploy:
          source: dist/THIRD-IRON-LIBKEY
          destination: $S3_BUCKET_NAME/$AWS_BUCKET_FOLDER
          overwrite: true
```

## Method 4: Custom Script with AWS SDK

Create a deployment script:

```javascript
// scripts/deploy-s3.js
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

async function uploadDirectory(localPath, bucket, prefix) {
  const files = getAllFiles(localPath);

  for (const file of files) {
    const relativePath = path.relative(localPath, file);
    const key = `${prefix}/${relativePath}`;

    const fileContent = fs.readFileSync(file);
    const contentType = getContentType(file);

    await s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
        CacheControl: getCacheControl(file),
      })
      .promise();

    console.log(`Uploaded: ${key}`);
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
  };
  return contentTypes[ext] || "application/octet-stream";
}

function getCacheControl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if ([".html", ".json"].includes(ext)) {
    return "no-cache,no-store,must-revalidate";
  }
  return "max-age=31536000,public";
}

// Usage
uploadDirectory("dist/THIRD-IRON-LIBKEY", process.env.S3_BUCKET_NAME, process.env.AWS_BUCKET_FOLDER).catch(console.error);
```

## Security Best Practices

### 1. **Use IAM Roles Instead of Access Keys**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::your-bucket-name", "arn:aws:s3:::your-bucket-name/*"]
    }
  ]
}
```

### 2. **Environment-Specific Buckets**

- Use different buckets for staging/production
- Implement bucket policies for security
- Enable versioning for rollback capability

### 3. **Cache Control Strategies**

```bash
# Static assets (CSS, JS, images)
aws s3 sync dist/ s3://bucket/ --cache-control "max-age=31536000,public"

# HTML files (no cache)
aws s3 sync dist/ s3://bucket/ --cache-control "no-cache,no-store,must-revalidate" --include "*.html"
```

## Performance Optimizations

### 1. **Parallel Uploads**

```yaml
- run:
    name: Upload assets in parallel
    command: |
      aws s3 sync dist/assets s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER/assets &
      aws s3 sync dist/css s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER/css &
      aws s3 sync dist/js s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER/js &
      wait
```

### 2. **Compression**

```yaml
- run:
    name: Upload with compression
    command: |
      aws s3 sync dist/ s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER \
        --content-encoding gzip \
        --cache-control "max-age=31536000,public"
```

## Error Handling

### 1. **Add Validation Steps**

```yaml
- run:
    name: Validate build output
    command: |
      if [ ! -d "dist/THIRD-IRON-LIBKEY" ]; then
        echo "Build directory not found!"
        exit 1
      fi

      if [ ! -f "dist/THIRD-IRON-LIBKEY/index.html" ]; then
        echo "index.html not found!"
        exit 1
      fi

- run:
    name: Upload to S3
    command: |
      aws s3 sync dist/THIRD-IRON-LIBKEY s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER \
        --delete \
        --cache-control "max-age=31536000,public" || exit 1
```

### 2. **Rollback Strategy**

```yaml
- run:
    name: Create backup before deployment
    command: |
      aws s3 sync s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER s3://$S3_BUCKET_NAME/backup/$(date +%Y%m%d-%H%M%S) || true
```

## Integration with Your Current Setup

To integrate with your existing deployment scripts, you can modify your `package.json`:

```json
{
  "scripts": {
    "deploy-primo-develop": "AWS_BUCKET_FOLDER=primo-nde/staging aws s3 sync dist/THIRD-IRON-LIBKEY s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER --delete --cache-control 'max-age=31536000,public'",
    "deploy-primo-main": "AWS_BUCKET_FOLDER=primo-nde/production aws s3 sync dist/THIRD-IRON-LIBKEY s3://$S3_BUCKET_NAME/$AWS_BUCKET_FOLDER --delete --cache-control 'max-age=31536000,public'"
  }
}
```

## Recommended Approach for Your Project

Based on your current setup, I recommend:

1. **Use AWS CLI with proper environment variables**
2. **Add the AWS CLI orb to your CircleCI config**
3. **Implement proper cache control strategies**
4. **Add validation steps before deployment**
5. **Use different buckets for staging/production**

This approach provides the best balance of security, reliability, and maintainability for your Angular application.
