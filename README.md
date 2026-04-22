# URL Shortener

A serverless URL shortener built on AWS — paste a long URL and get a short one back.

## Architecture
<img width="731" height="451" alt="url-shortner-aws drawio" src="https://github.com/user-attachments/assets/355ac197-ca6c-46c1-b80b-2829e1c47a7f" />

## Services Used
- S3 — static frontend hosting
- CloudFront — CDN and HTTPS
- API Gateway — public HTTP endpoints
- Lambda — serverless backend logic
- DynamoDB — stores short code to long URL mappings

## Live Demo
https://d2974myz1i60pw.cloudfront.net

## What I Learned
- How to build a serverless API with Lambda and API Gateway
- How dynamic path parameters work in API Gateway
- How CORS works and how to configure it
- How HTTP redirects work (301 status code)
- How to connect multiple Lambda functions to a single API

## Challenges
- CORS preflight OPTIONS request was blocking the frontend from calling the API
- API Gateway routes needed separate integrations for each Lambda function
