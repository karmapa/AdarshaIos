#!/bin/bash

ROOT_DIR=$(cd $(dirname $0)/..; pwd)
cd $ROOT_DIR

npm install --verbose
wget http://ya.ksana.tw/kdb/jiangkangyur.kdb
