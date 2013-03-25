#!/bin/bash

export NODE="../virt-manager/nodejs/node-v0.10.0-linux-x64/bin"
export NODE_PATH="../virt-manager/nodejs/node-v0.10.0-linux-x64/lib"
export PATH=$PATH:$NODE_PATH:$NODE
export NODE_PATH=$MY_PATH

npm install

../virt-manager/node_modules/nodemon/nodemon.js app.js
