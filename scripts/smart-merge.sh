#!/bin/bash
# Vue3-H5项目智能合并工具
# 用途：将main分支的特定commit精确合并到small分支

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 打印彩色信息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# 显示帮助信息
show_help() {
    print_header "Vue3-H5项目智能合并工具"
    echo ""
    echo "用途：将main分支的特定功能精确合并到small精简版分支"
    echo ""
    echo "使用方法："
    echo "  ./smart-merge.sh [选项]"
    echo ""
    echo "选项："
    echo "  -h, --help        显示帮助信息"
    echo "  -l, --list        显示最近10个main分支提交"
    echo "  -i, --interactive 交互式选择模式 (默认)"
    echo "  -c <hash>         直接合并指定commit"
    echo "  -s, --status      查看两分支状态"
    echo ""
    echo "示例："
    echo "  ./smart-merge.sh                       # 交互式选择"
    echo "  ./smart-merge.sh -l                    # 查看最近提交"
    echo "  ./smart-merge.sh -c a660815            # 直接合并指定commit"
    echo "  ./smart-merge.sh -s                    # 查看分支状态"
}

# 检查环境和状态
check_environment() {
    # 检查是否在git仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "当前目录不是git仓库"
        exit 1
    fi

    # 检查main和small分支是否存在
    if ! git show-ref --verify --quiet refs/heads/main; then
        print_error "main分支不存在"
        exit 1
    fi

    if ! git show-ref --verify --quiet refs/heads/small; then
        print_error "small分支不存在"
        exit 1
    fi

    # 检查是否有未提交的更改
    if ! git diff-index --quiet HEAD --; then
        print_warning "有未提交的更改，建议先提交或暂存"
        echo "是否继续？(y/n)"
        read continue_confirm
        if [ "$continue_confirm" != "y" ]; then
            print_info "操作已取消"
            exit 0
        fi
    fi
}

# 显示分支状态
show_status() {
    print_header "分支状态信息"

    current_branch=$(git branch --show-current)
    print_info "当前分支: $current_branch"

    echo ""
    echo "📊 分支对比："
    echo "Main分支最新提交："
    git log main --oneline -1
    echo ""
    echo "Small分支最新提交："
    git log small --oneline -1

    echo ""
    echo "🔀 分支差异统计："
    commits_ahead=$(git rev-list --count small..main)
    commits_behind=$(git rev-list --count main..small)
    echo "Main领先Small: $commits_ahead 个提交"
    echo "Small领先Main: $commits_behind 个提交"
}

# 智能分析commit内容
analyze_commit() {
    local commit_hash="$1"

    # 获取涉及的文件
    files=$(git show --name-only --format="" "$commit_hash")

    print_info "文件分析："
    echo "$files" | sed 's/^/  📄 /'

    # 智能判断是否适合small分支
    if echo "$files" | grep -E "(enterprise|advanced|admin|face)" > /dev/null; then
        print_warning "检测到可能的企业版/高级功能文件，请确认是否适合small分支"
    fi

    if echo "$files" | grep -E "(core|components|composables|utils)" > /dev/null; then
        print_success "检测到核心功能文件，推荐合并到small分支"
    fi

    # 显示修改统计
    echo ""
    echo "📈 修改统计："
    git show --stat "$commit_hash" | tail -1
}

# 交互式选择commit
interactive_mode() {
    print_header "交互式选择模式"

    # 显示main分支最近10个提交，带编号
    echo ""
    echo "📋 Main分支最近提交："
    echo "编号 | Commit Hash | 提交信息"
    echo "---- | ----------- | --------"
    git log main --oneline -10 --decorate | nl -v0 -s" | " | sed 's/^/  /'

    echo ""
    echo "请选择要合并的提交："
    echo "  - 输入编号 (0-9)"
    echo "  - 输入完整commit hash"
    echo "  - 输入 'q' 退出"
    read input

    if [ "$input" = "q" ]; then
        print_info "退出脚本"
        exit 0
    fi

    # 判断输入是编号还是hash
    if [[ "$input" =~ ^[0-9]$ ]]; then
        # 是编号，获取对应的commit hash
        commit_hash=$(git log main --oneline -10 | sed -n "$((input + 1))p" | cut -d' ' -f1)
        if [ -z "$commit_hash" ]; then
            print_error "无效的编号"
            exit 1
        fi
    else
        # 直接使用输入的hash
        commit_hash="$input"
    fi

    cherry_pick_commit "$commit_hash"
}

# 执行cherry-pick操作
cherry_pick_commit() {
    local commit_hash="$1"

    # 验证commit存在
    if ! git cat-file -e "$commit_hash" 2>/dev/null; then
        print_error "commit '$commit_hash' 不存在"
        exit 1
    fi

    # 检查commit是否属于main分支
    if ! git merge-base --is-ancestor "$commit_hash" main; then
        print_error "commit '$commit_hash' 不在main分支中"
        exit 1
    fi

    echo ""
    print_header "准备合并 Commit: $commit_hash"

    # 显示commit详细信息
    echo ""
    echo "📝 提交信息："
    git show -s --format="  作者: %an <%ae>%n  时间: %ad%n  信息: %s" "$commit_hash"

    # 分析commit内容
    echo ""
    analyze_commit "$commit_hash"

    echo ""
    echo "🤔 确认要将此commit合并到small分支吗？(y/n)"
    read confirm

    if [ "$confirm" != "y" ]; then
        print_info "操作已取消"
        exit 0
    fi

    # 保存当前分支
    original_branch=$(git branch --show-current)

    # 执行合并流程
    print_info "切换到small分支..."
    git checkout small

    print_info "更新small分支..."
    git pull origin small

    print_info "执行cherry-pick..."
    if git cherry-pick "$commit_hash"; then
        print_success "合并成功！"

        # 显示合并结果
        echo ""
        echo "📊 合并结果："
        git show --stat HEAD

        echo ""
        echo "🚀 是否推送到远程small分支？(y/n)"
        read push_confirm

        if [ "$push_confirm" = "y" ]; then
            print_info "推送到远程..."
            git push origin small
            print_success "已推送到远程仓库"
        else
            print_info "已保存到本地，记得手动推送: git push origin small"
        fi

    else
        print_warning "发生冲突，需要手动解决"
        echo ""
        echo "🛠️  冲突解决步骤："
        echo "  1. 编辑冲突文件，解决冲突标记"
        echo "  2. git add ."
        echo "  3. git cherry-pick --continue"
        echo ""
        echo "或者放弃此次合并："
        echo "  git cherry-pick --abort"
    fi

    # 询问是否切回原分支
    if [ "$original_branch" != "small" ]; then
        echo ""
        echo "是否切回原分支 '$original_branch'？(y/n)"
        read switch_back
        if [ "$switch_back" = "y" ]; then
            git checkout "$original_branch"
            print_info "已切回 $original_branch 分支"
        fi
    fi
}

# 主程序
main() {
    # 检查环境
    check_environment

    case "$1" in
        -h|--help)
            show_help
            ;;
        -l|--list)
            print_header "Main分支最近提交"
            git log main --oneline -10 --decorate --graph
            ;;
        -s|--status)
            show_status
            ;;
        -i|--interactive)
            interactive_mode
            ;;
        -c)
            if [ -z "$2" ]; then
                print_error "请提供commit hash"
                echo "使用 -h 查看帮助"
                exit 1
            fi
            cherry_pick_commit "$2"
            ;;
        "")
            interactive_mode
            ;;
        *)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 运行主程序
main "$@"
