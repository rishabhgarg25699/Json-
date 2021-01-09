#!/bin/bash

# Remove existing node_modules folder
rm -rf node_modules
# Remove .env file
rm .env

#create a .env file and config.json
touch .env
# Pipe output from .sample.env to .env
cat .sample.env > .env

# Install Dependencies
npm install
