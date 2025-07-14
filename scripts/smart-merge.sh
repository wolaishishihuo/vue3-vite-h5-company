#!/bin/bash
# Vue3-H5项目智能合并工具
# 用途：将源分支的特定commit精确合并到目标分支

set -e

# 默认分支设置
SOURCE_BRANCH="main"
TARGET_BRANCH="small"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_tip() {
    echo -e "${CYAN}💡 $1${NC}"
}

# 显示快速帮助
show_quick_help() {
    print_header "快速帮助"
    echo ""
    echo "常用命令："
    echo "  ./smart-merge.sh            # 交互式选择"
    echo "  ./smart-merge.sh -m         # 多commit选择"
    echo "  ./smart-merge.sh -s         # 查看分支状态"
    echo "  ./smart-merge.sh -l         # 查看最近提交"
    echo ""
    echo "自定义分支："
    echo "  ./smart-merge.sh --source feature --target test"
    echo ""
    echo "快捷操作："
    echo "  h - 显示帮助    q - 退出脚本"
    echo "  d - 完成选择    p - 预览修改"
}

# 显示交互模式下的键盘提示
show_keyboard_tips() {
    echo ""
    print_tip "键盘快捷操作提示："
    echo "  数字键     - 选择对应编号的commit"
    echo "  d          - 完成选择并开始合并"
    echo "  p          - 预览选中commit的详细变更"
    echo "  q          - 退出当前操作"
    echo "  h          - 显示帮助信息"
    echo ""
}

# 显示帮助信息
show_help() {
    print_header "Vue3-H5项目智能合并工具"
    echo ""
    echo "用途：将源分支的特定功能精确合并到目标分支"
    echo ""
    echo "使用方法："
    echo "  ./smart-merge.sh [选项]"
    echo ""
    echo "选项："
    echo "  -h, --help        显示帮助信息"
    echo "  -l, --list        显示最近10个源分支提交"
    echo "  -i, --interactive 交互式选择模式 (默认)"
    echo "  -c <hash>         直接合并指定commit"
    echo "  -s, --status      查看两分支状态"
    echo "  -m, --multi       允许选择多个commit合并"
    echo "  -t, --tips        显示快速操作提示"
    echo "  --source <branch> 指定源分支 (默认: $SOURCE_BRANCH)"
    echo "  --target <branch> 指定目标分支 (默认: $TARGET_BRANCH)"
    echo ""
    echo "示例："
    echo "  ./smart-merge.sh                              # 交互式选择"
    echo "  ./smart-merge.sh -l                           # 查看最近提交"
    echo "  ./smart-merge.sh -c a660815                   # 直接合并指定commit"
    echo "  ./smart-merge.sh -s                           # 查看分支状态"
    echo "  ./smart-merge.sh -m                           # 多commit选择模式"
    echo "  ./smart-merge.sh --source dev --target test   # 自定义分支名称"
}

# 检查环境和状态
check_environment() {
    # 检查是否在git仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "当前目录不是git仓库"
        exit 1
    fi

    # 检查源分支和目标分支是否存在
    if ! git --no-pager show-ref --verify --quiet refs/heads/$SOURCE_BRANCH; then
        print_error "$SOURCE_BRANCH分支不存在"
        exit 1
    fi

    if ! git --no-pager show-ref --verify --quiet refs/heads/$TARGET_BRANCH; then
        print_error "$TARGET_BRANCH分支不存在"
        exit 1
    fi

    # 检查是否有未提交的更改
    if ! git --no-pager diff-index --quiet HEAD --; then
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
    echo "$SOURCE_BRANCH分支最新提交："
    git --no-pager log $SOURCE_BRANCH --oneline -1
    echo ""
    echo "$TARGET_BRANCH分支最新提交："
    git --no-pager log $TARGET_BRANCH --oneline -1

    echo ""
    echo "🔀 分支差异统计："
    commits_ahead=$(git rev-list --count $TARGET_BRANCH..$SOURCE_BRANCH)
    commits_behind=$(git rev-list --count $SOURCE_BRANCH..$TARGET_BRANCH)
    echo "$SOURCE_BRANCH领先$TARGET_BRANCH: $commits_ahead 个提交"
    echo "$TARGET_BRANCH领先$SOURCE_BRANCH: $commits_behind 个提交"

    # 提示用户可以查看完整提交差异
    if [ $commits_ahead -gt 0 ]; then
        print_tip "查看具体差异可使用: git --no-pager log $TARGET_BRANCH..$SOURCE_BRANCH --oneline"
    fi
}

# 预览文件变更
preview_changes() {
    local commit_hash="$1"

    echo ""
    print_header "预览文件变更内容"

    # 使用 --no-pager 选项避免分页器产生的~符号和(END)
    git --no-pager show "$commit_hash" --color
}

# 智能分析commit内容
analyze_commit() {
    local commit_hash="$1"

    # 获取涉及的文件
    files=$(git --no-pager show --name-only --format="" "$commit_hash")

    print_info "文件分析："
    echo "$files" | sed 's/^/  📄 /'

    # 智能判断是否适合目标分支
    if echo "$files" | grep -E "(enterprise|advanced|admin|face)" > /dev/null; then
        print_warning "检测到可能的企业版/高级功能文件，请确认是否适合$TARGET_BRANCH分支"
    fi

    if echo "$files" | grep -E "(core|components|composables|utils)" > /dev/null; then
        print_success "检测到核心功能文件，推荐合并到$TARGET_BRANCH分支"
    fi

    # 显示修改统计
    echo ""
    echo "📈 修改统计："
    git --no-pager show --stat "$commit_hash" | tail -1

    # 提供预览选项
    echo ""
    echo "是否预览详细变更？(y/n/p)"
    print_tip "y - 完整预览, n - 跳过, p - 仅预览修改部分"
    read preview_confirm

    case $preview_confirm in
        y|Y)
            preview_changes "$commit_hash"
            ;;
        p|P)
            echo ""
            print_header "仅显示修改内容"
            # 使用 --no-pager 选项避免分页器
            git --no-pager show "$commit_hash" --color --patch
            ;;
        n|N)
            # 跳过预览
            ;;
        *)
            print_warning "无效选项，跳过预览"
            ;;
    esac
}

# 处理交互式输入
handle_interactive_input() {
    local input="$1"

    case $input in
        h|H)
            show_keyboard_tips
            return 1
            ;;
        q|Q)
            print_info "退出脚本"
            exit 0
            ;;
        *)
            # 正常输入处理
            return 0
            ;;
    esac
}

# 交互式选择commit
interactive_mode() {
    local multi_mode=$1
    local selected_commits=()
    local original_branch=$(git branch --show-current)

    print_header "交互式选择模式"
    if [ "$multi_mode" = true ]; then
        print_info "已启用多commit选择模式"
    fi

    # 显示快捷键提示
    show_keyboard_tips

    # 显示源分支最近10个提交，带编号
    echo ""
    echo "📋 $SOURCE_BRANCH分支最近提交："
    echo "编号 | Commit Hash | 提交信息"
    echo "---- | ----------- | --------"
    git --no-pager log $SOURCE_BRANCH --oneline -10 --decorate | nl -v0 -s" | " | sed 's/^/  /'

    if [ "$multi_mode" = true ]; then
        echo ""
        echo "请选择要合并的提交："
        echo "  - 输入编号(用空格分隔多个编号)"
        echo "  - 或直接输入commit hash(用空格分隔多个hash)"
        echo "  - 输入 'd' 完成选择并开始合并"
        echo "  - 输入 'h' 显示帮助"
        echo "  - 输入 'q' 退出"

        while true; do
            echo ""
            echo "当前已选择 ${#selected_commits[@]} 个commit"
            if [ ${#selected_commits[@]} -gt 0 ]; then
                echo "已选择: ${selected_commits[@]}"
            fi

            read -p "输入选择 (d完成, h帮助, q退出): " input

            # 处理特殊命令
            handle_interactive_input "$input"
            if [ $? -eq 1 ]; then
                continue
            fi

            if [ "$input" = "d" ]; then
                if [ ${#selected_commits[@]} -eq 0 ]; then
                    print_warning "未选择任何commit"
                    continue
                fi
                break
            fi

            # 处理输入的编号或hash
            for item in $input; do
                if [[ "$item" =~ ^[0-9]+$ ]]; then
                    # 是编号，获取对应的commit hash
                    commit_hash=$(git --no-pager log $SOURCE_BRANCH --oneline -10 | sed -n "$((item + 1))p" | cut -d' ' -f1)
                    if [ -z "$commit_hash" ]; then
                        print_error "无效的编号: $item"
                        continue
                    fi

                    if [[ ! " ${selected_commits[@]} " =~ " ${commit_hash} " ]]; then
                        selected_commits+=("$commit_hash")
                        print_success "添加: $commit_hash"
                    else
                        print_warning "$commit_hash 已在列表中"
                    fi
                else
                    # 直接使用输入的hash
                    commit_hash="$item"
                    if git cat-file -e "$commit_hash" 2>/dev/null; then
                        if [[ ! " ${selected_commits[@]} " =~ " ${commit_hash} " ]]; then
                            selected_commits+=("$commit_hash")
                            print_success "添加: $commit_hash"
                        else
                            print_warning "$commit_hash 已在列表中"
                        fi
                    else
                        print_error "commit不存在: $item"
                    fi
                fi
            done
        done

        # 多commit模式，顺序处理所有选择的commit
        process_multiple_commits "${selected_commits[@]}" "$original_branch"
    else
        # 单个commit选择模式
        echo ""
        echo "请选择要合并的提交："
        echo "  - 输入编号 (0-9)"
        echo "  - 输入完整commit hash"
        echo "  - 输入 'h' 显示帮助"
        echo "  - 输入 'q' 退出"

        local commit_hash=""
        while true; do
            read -p "输入选择: " input

            # 处理特殊命令
            handle_interactive_input "$input"
            if [ $? -eq 1 ]; then
                continue
            fi

            # 判断输入是编号还是hash
            if [[ "$input" =~ ^[0-9]$ ]]; then
                # 是编号，获取对应的commit hash
                commit_hash=$(git --no-pager log $SOURCE_BRANCH --oneline -10 | sed -n "$((input + 1))p" | cut -d' ' -f1)
                if [ -z "$commit_hash" ]; then
                    print_error "无效的编号"
                    continue
                fi
                break
            else
                # 直接使用输入的hash
                commit_hash="$input"
                if ! git cat-file -e "$commit_hash" 2>/dev/null; then
                    print_error "commit不存在: $input"
                    continue
                fi
                break
            fi
        done

        cherry_pick_commit "$commit_hash" false "$original_branch"
    fi
}

# 执行cherry-pick操作
cherry_pick_commit() {
    local commit_hash="$1"
    local is_multiple=${2:-false}
    local original_branch=${3:-$(git branch --show-current)}

    # 检查commit是否存在
    if ! git cat-file -e "$commit_hash" 2>/dev/null; then
        print_error "commit '$commit_hash' 不存在"
        return 1
    fi

    # 检查commit是否属于源分支
    if ! git merge-base --is-ancestor "$commit_hash" $SOURCE_BRANCH; then
        print_error "commit '$commit_hash' 不在$SOURCE_BRANCH分支中"
        return 1
    fi

    echo ""
    print_header "准备合并 Commit: $commit_hash"

    # 显示commit详细信息
    echo ""
    echo "📝 提交信息："
    git --no-pager show -s --format="  作者: %an <%ae>%n  时间: %ad%n  信息: %s" "$commit_hash"

    # 分析commit内容
    echo ""
    analyze_commit "$commit_hash"

    echo ""
    echo "🤔 确认要将此commit合并到$TARGET_BRANCH分支吗？(y/n)"
    read confirm

    if [ "$confirm" != "y" ]; then
        if [ "$is_multiple" = true ]; then
            print_info "跳过此commit"
            return 0
        else
            print_info "操作已取消"
            exit 0
        fi
    fi

    # 如果当前不在目标分支，则切换
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$TARGET_BRANCH" ]; then
        print_info "切换到$TARGET_BRANCH分支..."
        git checkout $TARGET_BRANCH

        print_info "更新$TARGET_BRANCH分支..."
        git pull origin $TARGET_BRANCH
    fi

    print_info "执行cherry-pick..."
    if git cherry-pick "$commit_hash"; then
        print_success "合并成功！"

        # 显示合并结果
        echo ""
        echo "📊 合并结果："
        git --no-pager show --stat HEAD

        # 如果是多commit模式，不每次都询问推送
        if [ "$is_multiple" != true ]; then
            echo ""
            echo "🚀 是否推送到远程$TARGET_BRANCH分支？(y/n)"
            read push_confirm

            if [ "$push_confirm" = "y" ]; then
                print_info "推送到远程..."
                git push origin $TARGET_BRANCH
                print_success "已推送到远程仓库"
            else
                print_info "已保存到本地，记得手动推送: git push origin $TARGET_BRANCH"
            fi

            # 询问是否切回原分支
            if [ "$original_branch" != "$TARGET_BRANCH" ]; then
                echo ""
                echo "是否切回原分支 '$original_branch'？(y/n)"
                read switch_back
                if [ "$switch_back" = "y" ]; then
                    git checkout "$original_branch"
                    print_info "已切回 $original_branch 分支"
                fi
            fi
        fi
    else
        print_warning "发生冲突，需要手动解决"
        echo ""
        echo "🛠️  冲突解决步骤："
        echo "  1. 编辑冲突文件，解决冲突标记"
        echo "  2. git add 已解决冲突的文件"
        echo "  3. git cherry-pick --continue"
        echo ""
        echo "或者放弃此次合并："
        echo "  git cherry-pick --abort"

        print_tip "提示: 可以使用 'git status' 查看冲突文件"
        print_tip "提示: 可以使用 'git diff' 查看具体冲突内容"

        # 如果是多commit模式，询问是否继续
        if [ "$is_multiple" = true ]; then
            echo ""
            echo "是否继续处理其他commit？(y/n)"
            read continue_confirm
            if [ "$continue_confirm" != "y" ]; then
                print_info "操作已中断"
                # 询问是否切回原分支
                if [ "$current_branch" != "$original_branch" ]; then
                    echo ""
                    echo "是否切回原分支 '$original_branch'？(y/n)"
                    read switch_back
                    if [ "$switch_back" = "y" ]; then
                        git checkout "$original_branch"
                        print_info "已切回 $original_branch 分支"
                    fi
                fi
                exit 1
            else
                return 0
            fi
        else
            # 询问是否切回原分支
            if [ "$current_branch" != "$original_branch" ]; then
                echo ""
                echo "是否切回原分支 '$original_branch'？(y/n)"
                read switch_back
                if [ "$switch_back" = "y" ]; then
                    git checkout "$original_branch"
                    print_info "已切回 $original_branch 分支"
                fi
            fi
            exit 1
        fi
    fi

    return 0
}

# 处理多个commit的情况
process_multiple_commits() {
    local commits=("${@:1:$#-1}")  # 所有参数除了最后一个
    local original_branch="${!#}"   # 最后一个参数
    local success=true

    print_header "批量处理多个commit"
    print_info "共选择了 ${#commits[@]} 个commit"

    # 切换到目标分支并更新
    print_info "切换到$TARGET_BRANCH分支..."
    git checkout $TARGET_BRANCH

    print_info "更新$TARGET_BRANCH分支..."
    git pull origin $TARGET_BRANCH

    # 逐个处理commit
    local total=${#commits[@]}
    local current=1

    for commit_hash in "${commits[@]}"; do
        print_header "处理 commit [$current/$total]: $commit_hash"
        if ! cherry_pick_commit "$commit_hash" true "$original_branch"; then
            success=false
            break
        fi
        ((current++))
    done

    # 处理完成后询问是否推送
    if [ "$success" = true ]; then
        echo ""
        echo "🚀 所有commit处理完成，是否推送到远程$TARGET_BRANCH分支？(y/n)"
        read push_confirm

        if [ "$push_confirm" = "y" ]; then
            print_info "推送到远程..."
            git push origin $TARGET_BRANCH
            print_success "已推送到远程仓库"
        else
            print_info "已保存到本地，记得手动推送: git push origin $TARGET_BRANCH"
        fi
    fi

    # 询问是否切回原分支
    if [ "$original_branch" != "$TARGET_BRANCH" ]; then
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
    # 显示开始信息
    if [ "$1" = "" ]; then
        print_header "Vue3-H5项目智能合并工具"
        print_tip "输入 -t 查看快速帮助，-h 查看完整帮助"
        echo ""
    fi

    # 解析自定义分支参数
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --source)
                SOURCE_BRANCH="$2"
                shift 2
                ;;
            --target)
                TARGET_BRANCH="$2"
                shift 2
                ;;
            *)
                break
                ;;
        esac
    done

    # 检查环境
    check_environment

    case "$1" in
        -h|--help)
            show_help
            ;;
        -t|--tips)
            show_quick_help
            ;;
        -l|--list)
            print_header "$SOURCE_BRANCH分支最近提交"
            git --no-pager log $SOURCE_BRANCH --oneline -10 --decorate --graph
            ;;
        -s|--status)
            show_status
            ;;
        -i|--interactive)
            interactive_mode false
            ;;
        -m|--multi)
            interactive_mode true
            ;;
        -c)
            if [ -z "$2" ]; then
                print_error "请提供commit hash"
                print_tip "使用格式: ./smart-merge.sh -c <commit-hash>"
                exit 1
            fi
            cherry_pick_commit "$2"
            ;;
        "")
            interactive_mode false
            ;;
        *)
            print_error "未知选项: $1"
            print_tip "使用 -h 查看帮助"
            exit 1
            ;;
    esac
}

# 运行主程序
main "$@"
