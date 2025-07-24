# Deployment Guide

## Heroku Deployment Setup

### Prerequisites
1. Heroku CLI installed
2. MongoDB Atlas account (for production database)
3. Git repository

### Environment Variables for Heroku

Set the following environment variables in Heroku:

```bash
# Required for production
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/movies-app?retryWrites=true&w=majority"
heroku config:set SESSION_SECRET="your-super-secret-session-key-here"
```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist Heroku's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and replace in MONGO_URI

### Deployment Commands

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables (see above)
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="your-atlas-connection-string"
heroku config:set SESSION_SECRET="your-secret-key"

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Open app
heroku open
```

### Troubleshooting

- Check logs: `heroku logs --tail`
- Restart dynos: `heroku restart`
- Check config vars: `heroku config`