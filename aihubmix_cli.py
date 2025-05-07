#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
AiHubMix API 实用管理脚本：用于管理 AiHubMix API KEY 和查询账户信息。

使用示例：
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action create_token --name "新KEY名称"
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action get_balance
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action get_tokens
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action get_models
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action get_user_token
  
  # 使用配置文件
  python aihubmix_cli.py --save-config --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN"
  python aihubmix_cli.py --action get_balance  # 将使用保存的配置
"""

import argparse
import json
import sys
import os
from typing import Dict, Any, Optional

# 导入本地模块
from aihubmix_client import AiHubMixClient

# 配置文件路径
CONFIG_FILE = os.path.expanduser("~/.aihubmix.json")

def load_config() -> Dict[str, str]:
    """
    Load configuration from file
    
    Returns:
        Dictionary with configuration values
    """
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"加载配置文件失败: {e}")
    return {}

def save_config(url: str, token: str) -> None:
    """
    Save configuration to file
    
    Args:
        url: API URL
        token: API 访问令牌
    """
    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump({"url": url, "token": token}, f)
        print(f"配置已保存到 {CONFIG_FILE}")
    except Exception as e:
        print(f"保存配置文件失败: {e}")

def format_balance(data: Dict[str, Any]) -> None:
    """
    Format and print balance information
    
    Args:
        data: Balance data from API
    """
    print(f"\n账户余额信息：")
    print(f"用户名：{data.get('username', '未知')}")
    print(f"显示名称：{data.get('display_name', '未知')}")
    print(f"当前余额：{data.get('quota', '未知')}")
    print(f"已使用额度：{data.get('used_quota', '未知')}")
    print(f"请求次数：{data.get('request_count', '未知')}")
    print(f"用户组：{data.get('group', '未知')}")


def format_tokens(tokens: list) -> None:
    """
    Format and print KEY information
    
    Args:
        tokens: List of KEY data from API
    """
    print(f"\nKEY列表 (共 {len(tokens)} 个):")
    for i, token in enumerate(tokens, 1):
        print(f"\nKEY {i}:")
        print(f"  ID: {token.get('id', '未知')}")
        print(f"  名称：{token.get('name', '未知')}")
        print(f"  密钥：{token.get('key', '未知')}")
        print(f"  创建时间：{token.get('created_time', '未知')}")
        print(f"  访问时间：{token.get('accessed_time', '未知')}")
        print(f"  过期时间：{token.get('expired_time', '未知')}")
        print(f"  状态：{'启用' if token.get('status') == 1 else '禁用'}")

def format_models(models_data: Dict[str, list]) -> None:
    """
    Format and print model information
    
    Args:
        models_data: Model data from API
    """
    total_models = set()
    
    # 收集所有唯一的模型名称
    for channel_id, models in models_data.items():
        if models and isinstance(models, list):
            for model in models:
                total_models.add(model)
    
    total_models = sorted(list(total_models))
    print(f"\n可用模型列表 (共 {len(total_models)} 个唯一模型):")
    for i, model in enumerate(total_models, 1):
        print(f"  {i}. {model}")

def create_token_action(client: AiHubMixClient, args: argparse.Namespace) -> None:
    """
    Execute create KEY action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
    """
    result = client.create_token(args.name, args.expires, args.quota)
    if result:
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif "data" in result and result.get("success", False):
            print(f"\n成功创建KEY")
            # 从响应中提取KEY信息
            token_data = result.get("data", {})
            print(f"  ID: {token_data.get('id', '未知')}")
            print(f"  名称：{token_data.get('name', '未知')}")
            print(f"  密钥：{token_data.get('key', '未知')}")
            print(f"  创建时间：{token_data.get('created_time', '未知')}")
            print(f"  过期时间：{token_data.get('expired_time', '未知')}")
        else:
            print(f"\n创建KEY失败：{result.get('message', '未知错误')}")

def get_balance_action(client: AiHubMixClient, args: argparse.Namespace) -> None:
    """
    Execute get balance action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
    """
    result = client.get_balance()
    if result:
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif "data" in result and result.get("success", False):
            format_balance(result.get("data", {}))
        else:
            print(f"\n获取余额失败：{result.get('message', '未知错误')}")

def get_tokens_action(client: AiHubMixClient, args: argparse.Namespace) -> None:
    """
    Execute get KEYs action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
    """
    result = client.get_tokens()
    if result:
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif "data" in result and result.get("success", False):
            format_tokens(result.get("data", []))
        else:
            print(f"\n获取KEY列表失败：{result.get('message', '未知错误')}")

def search_tokens_action(client: AiHubMixClient, args: argparse.Namespace) -> None:
    """
    Execute search KEYs action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
    """
    if not args.query:
        print("错误：搜索KEY时必须提供搜索关键字 (--query)")
        return
        
    result = client.search_tokens(args.query)
    if result:
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif "data" in result and result.get("success", False):
            format_tokens(result.get("data", []))
        else:
            print(f"\n搜索KEY失败：{result.get('message', '未知错误')}")

def delete_token_action(client: AiHubMixClient, args: argparse.Namespace) -> None:
    """
    Execute delete KEY action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
    """
    if not args.id:
        print("错误：删除KEY时必须提供KEY ID (--id)")
        return
        
    result = client.delete_token(args.id)
    if result:
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif result.get("success", False):
            print(f"\n成功删除KEY ID: {args.id}")
        else:
            print(f"\n删除KEY失败：{result.get('message', '未知错误')}")

def update_token_action(client: AiHubMixClient, args: argparse.Namespace) -> None:
    """
    Execute update KEY action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
    """
    if not args.id:
        print("错误：更新KEY时必须提供KEY ID (--id)")
        return
        
    # 构建更新数据
    update_data = {}
    if args.name:
        update_data["name"] = args.name
    if args.expires is not None:
        update_data["expired_time"] = args.expires
    if args.quota is not None:
        update_data["remain_quota"] = args.quota
    if args.status is not None:
        update_data["status"] = args.status
        
    if not update_data:
        print("错误：更新KEY时必须提供至少一个要更新的属性")
        return
        
    result = client.update_token(args.id, **update_data)
    if result:
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif result.get("success", False):
            print(f"\n成功更新KEY ID: {args.id}")
            if "data" in result:
                token_data = result.get("data", {})
                print(f"  名称：{token_data.get('name', '未知')}")
                print(f"  过期时间：{token_data.get('expired_time', '未知')}")
                print(f"  剩余配额：{token_data.get('remain_quota', '未知')}")
                print(f"  状态：{'启用' if token_data.get('status') == 1 else '禁用'}")
        else:
            print(f"\n更新KEY失败：{result.get('message', '未知错误')}")

def get_models_action(client: AiHubMixClient, args: argparse.Namespace) -> None:
    """
    Execute get models action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
    """
    result = client.get_models()
    if result:
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif "data" in result and result.get("success", False):
            format_models(result.get("data", {}))
        else:
            print(f"\n获取模型列表失败：{result.get('message', '未知错误')}")

def get_available_models_action(client: AiHubMixClient, args: argparse.Namespace) -> None:
    """
    Execute get available models action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
    """
    result = client.get_available_models()
    if result:
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        elif "data" in result and result.get("success", False):
            models = result.get("data", [])
            print(f"\n用户可用模型列表 (共 {len(models)} 个):")
            for i, model in enumerate(models, 1):
                print(f"  {i}. {model}")
        else:
            print(f"\n获取用户可用模型失败：{result.get('message', '未知错误')}")

def get_user_token_action(client: AiHubMixClient, args: argparse.Namespace) -> Optional[str]:
    """
    Execute get user KEY action
    
    Args:
        client: AiHubMixClient instance
        args: Command line arguments
        
    Returns:
        User KEY if successful, None otherwise
    """
    user_token = client.get_user_token()
    if user_token:
        print(f"用户KEY: {user_token}")
        return user_token
    else:
        print("获取用户KEY失败")
        return None

def main() -> None:
    """
    Main entry point for the CLI
    """
    # 创建命令行参数解析器
    parser = argparse.ArgumentParser(
        description='AiHubMix API 管理工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例：
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action create_token --name "新KEY名称"
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action get_balance
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action get_tokens
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action get_models
  python aihubmix_cli.py --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN" --action get_user_token
  
  # 使用配置文件
  python aihubmix_cli.py --save-config --url "https://aihubmix.com" --token "YOUR_ACCESS_TOKEN"
  python aihubmix_cli.py --action get_balance  # 将使用保存的配置

注意：必须使用从 AiHubMix 网站获取的有效访问令牌（如 fd***44c 格式）
"""
    )
    
    # 配置选项
    parser.add_argument('--save-config', action='store_true', help='保存 URL 和访问令牌到配置文件')
    parser.add_argument('--url', type=str, help='API 基础 URL')
    parser.add_argument('--token', type=str, help='访问令牌')
    parser.add_argument('--action', type=str, 
                        choices=[
                            'create_token', 'get_tokens', 'search_tokens', 'delete_token', 'update_token',
                            'get_balance',
                            'get_models', 'get_available_models',
                            'get_user_token',
                        ],
                        help='要执行的操作')
    
    # 令牌相关参数
    parser.add_argument('--name', type=str, help='KEY名称 (create_token, update_token)')
    parser.add_argument('--expires', type=int, help='KEY过期时间，秒 (create_token, update_token)')
    parser.add_argument('--quota', type=float, help='KEY剩余配额 (create_token, update_token)')
    parser.add_argument('--id', type=str, help='KEY ID (update_token, delete_token)')
    parser.add_argument('--status', type=int, choices=[0, 1], help='KEY状态：0-禁用，1-启用 (update_token)')
    
    # 搜索相关参数
    parser.add_argument('--query', type=str, help='搜索关键字 (search_tokens)')
    
    parser.add_argument('--json', action='store_true', help='以 JSON 格式输出结果')
    
    args = parser.parse_args()
    
    # 加载配置文件
    config = load_config()
    
    # 如果参数没有提供，则使用配置文件中的值
    url = args.url or config.get('url', 'https://aihubmix.com')
    token = args.token or config.get('token')
    
    # 如果要保存配置
    if args.save_config:
        if not args.url or not args.token:
            print("错误：保存配置需要同时提供 URL (--url) 和访问令牌 (--token)")
            sys.exit(1)
        save_config(args.url, args.token)
        if not args.action:
            return
    
    # 检查是否提供了操作
    if not args.action:
        if args.save_config:
            return
        print("错误：需要提供操作 (--action)")
        parser.print_help()
        sys.exit(1)
    
    # 检查是否提供了令牌
    if not token and args.action not in ['get_models']:
        print("错误：需要提供访问令牌 (--token) 或使用已保存的配置")
        print("请在 AiHubMix 网站 (https://aihubmix.com) 登录后，在设置页面生成访问令牌")
        print("或者使用 --save-config 选项保存配置")
        sys.exit(1)
    
    # 对于特定操作，检查是否提供了必要的参数
    if args.action == 'create_token' and not args.name:
        print("错误：创建KEY时必须提供KEY名称 (--name)")
        sys.exit(1)
    
    # 创建 API 客户端
    client = AiHubMixClient(url, token)
    
    # 执行相应的操作
    action_map = {
        'create_token': create_token_action,
        'get_balance': get_balance_action,
        'get_tokens': get_tokens_action,
        'search_tokens': search_tokens_action,
        'delete_token': delete_token_action,
        'update_token': update_token_action,
        'get_models': get_models_action,
        'get_available_models': get_available_models_action,
        'get_user_token': get_user_token_action,
    }
    
    # 执行对应的操作
    if args.action in action_map:
        try:
            action_map[args.action](client, args)
        except KeyboardInterrupt:
            print("\n操作已取消")
            sys.exit(1)
        except Exception as e:
            print(f"\n操作执行出错: {e}")
            sys.exit(1)
    else:
        print(f"错误：未知操作 {args.action}")
        sys.exit(1)


if __name__ == "__main__":
    main() 