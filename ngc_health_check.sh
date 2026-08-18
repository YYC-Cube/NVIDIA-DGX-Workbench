#!/bin/bash
set -e
echo "=====1.检查NGC_API_KEY环境变量===="
echo "NGC_API_KEY: [$NGC_API_KEY]"

echo -e "\n=====2.ngc-cli当前配置===="
ngc config current

echo -e "\n=====3.身份校验===="
ngc user who

echo -e "\n=====4.测试nvcr公开镜像拉取===="
docker pull nvcr.io/nvidia/cuda:12.8.0-base-ubuntu24.04
docker rmi nvcr.io/nvidia/cuda:12.8.0-base-ubuntu24.04

echo -e "\n=====5.查询yyc3团队镜像列表===="
ngc registry image list --team yyc3

echo -e "\n=====健康检查完成===="
