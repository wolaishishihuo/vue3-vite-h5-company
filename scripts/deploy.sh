#!/bin/bash

# 设置错误时退出
set -e

# 定义颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 定义日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 定义错误处理函数
handle_error() {
    local exit_code=$?
    local line_number=$1
    log_error "脚本在第 $line_number 行执行失败，退出码: $exit_code"
    log_error "部署失败！请检查错误信息并重试。"
    exit $exit_code
}

# 设置错误陷阱
trap 'handle_error $LINENO' ERR

# 定义服务器信息（请修改为你的实际信息）
SERVER_USER="root"
SERVER_IP="172.16.20.122"
SERVER_PORT="22"
SERVER_PASSWORD="jckj2024"
# 项目路径
TARGET_PATH=""

# 检查必要的命令是否存在
check_commands() {
    log_info "检查必要的命令..."

    # 检查 pnpm
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm 未安装，请先安装 pnpm"
        exit 1
    fi

    # 检查 sshpass
    if ! command -v sshpass &> /dev/null; then
        log_warning "sshpass 未安装，正在尝试安装..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if ! command -v brew &> /dev/null; then
                log_error "Homebrew 未安装，请先安装 Homebrew"
                exit 1
            fi
            brew install sshpass || {
                log_error "安装 sshpass 失败，请手动安装: brew install sshpass"
                exit 1
            }
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            sudo apt-get update && sudo apt-get install -y sshpass || {
                log_error "安装 sshpass 失败，请手动安装: sudo apt-get install sshpass"
                exit 1
            }
        else
            log_error "不支持的操作系统，请手动安装 sshpass"
            exit 1
        fi
        log_success "sshpass 安装成功"
    fi

    log_success "所有必要的命令检查完成"
}

# 测试服务器连接
test_connection() {
    log_info "测试服务器连接..."
    if ! sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo '连接测试成功'" &> /dev/null; then
        log_error "无法连接到服务器 $SERVER_USER@$SERVER_IP:$SERVER_PORT"
        log_error "请检查："
        log_error "1. 服务器是否运行"
        log_error "2. IP地址和端口是否正确"
        log_error "3. 用户名和密码是否正确"
        log_error "4. 防火墙设置"
        exit 1
    fi
    log_success "服务器连接测试成功"
}

# 构建项目
build_project() {
    log_info "开始构建项目..."
    if ! pnpm run build; then
        log_error "项目构建失败"
        exit 1
    fi

    # 检查构建输出目录是否存在
    if [ ! -d "dist" ]; then
        log_error "构建输出目录 'dist' 不存在"
        exit 1
    fi

    # 检查构建输出是否为空
    if [ -z "$(ls -A dist)" ]; then
        log_error "构建输出目录 'dist' 为空"
        exit 1
    fi

    log_success "项目构建完成"
}

# 准备目标目录
prepare_target_directory() {
    log_info "准备目标目录..."

    # 确保目标目录存在
    if ! sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "mkdir -p $TARGET_PATH"; then
        log_error "创建目标目录失败"
        exit 1
    fi

    # 设置目录权限
    if ! sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "chmod 775 $TARGET_PATH"; then
        log_error "设置目录权限失败"
        exit 1
    fi

    log_success "目标目录准备完成"
}

# 清空目标目录
clean_target_directory() {
    log_info "清空目标目录..."
    if ! sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "rm -rf $TARGET_PATH/*"; then
        log_error "清空目标目录失败"
        exit 1
    fi
    log_success "目标目录已清空"
}

# 上传文件
upload_files() {
    log_info "开始上传文件到 $SERVER_USER@$SERVER_IP:$TARGET_PATH（端口: $SERVER_PORT）..."

    if ! sshpass -p "$SERVER_PASSWORD" scp -P $SERVER_PORT -o StrictHostKeyChecking=no -r dist/* $SERVER_USER@$SERVER_IP:$TARGET_PATH/; then
        log_error "文件上传失败"
        exit 1
    fi

    log_success "文件上传完成"
}

# 验证部署
verify_deployment() {
    log_info "验证部署结果..."

    # 检查文件是否已上传
    local file_count=$(sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "ls -1 $TARGET_PATH | wc -l")

    if [ "$file_count" -eq 0 ]; then
        log_error "目标目录为空，部署可能失败"
        exit 1
    fi

    log_info "目标目录文件列表："
    sshpass -p "$SERVER_PASSWORD" ssh -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "ls -la $TARGET_PATH"

    log_success "部署验证完成，共上传 $file_count 个文件/目录"
}

# 主函数
main() {
    log_info "🚀 开始部署流程..."

    # 记录开始时间
    local start_time=$(date +%s)

    # 执行部署步骤
    check_commands
    test_connection
    build_project
    prepare_target_directory
    clean_target_directory
    upload_files
    verify_deployment

    # 计算耗时
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_success "✅ 部署完成！总耗时: ${duration} 秒"
    log_success "🎉 应用已成功部署到 $SERVER_USER@$SERVER_IP:$TARGET_PATH"
}

# 执行主函数
main "$@"
