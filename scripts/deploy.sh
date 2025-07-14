#!/bin/bash

# 定义服务器信息（请修改为你的实际信息）
SERVER_USER="root"
SERVER_IP="172.16.20.122"
SERVER_PORT="22"
SERVER_PASSWORD="jckj2024"
# 项目路径
TARGET_PATH="/www/instru_reserve"

# 检查是否安装了 sshpass
if ! command -v sshpass &> /dev/null; then
    echo "sshpass 未安装，正在尝试安装..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install sshpass || {
            echo "请先安装 sshpass: brew install sshpass";
            exit 1;
        }
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update && sudo apt-get install -y sshpass || {
            echo "请先安装 sshpass: sudo apt-get install sshpass";
            exit 1;
        }
    else
        echo "不支持的操作系统，请手动安装 sshpass";
        exit 1
    fi
fi

echo "开始构建项目..."
# 打包项目
npm run build

echo "确保目标目录存在..."
# 使用 SSH 确保目标目录存在
sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "mkdir -p $TARGET_PATH && chmod 775 $TARGET_PATH && echo '目标目录已就绪'"

echo "清空目标目录..."
# 清空目标目录中的所有文件和文件夹
sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "rm -rf $TARGET_PATH/* && echo '目标目录已清空'"

echo "开始上传文件到 $SERVER_USER@$SERVER_IP:$TARGET_PATH（端口: $SERVER_PORT）..."
# 使用 sshpass 和 scp 复制文件到测试服务器，自动输入密码并跳过主机密钥验证
sshpass -p "$SERVER_PASSWORD" scp -P $SERVER_PORT -o StrictHostKeyChecking=no -r dist/* $SERVER_USER@$SERVER_IP:$TARGET_PATH/

# 验证文件是否已上传
echo "验证文件是否已上传..."
sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "ls -la $TARGET_PATH"

echo "✅ 部署完成！"
