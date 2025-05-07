#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
提供与 AiHubMix API 交互的功能，用于管理 KEY、查询账户信息等。
"""

import requests
import sys
import json
from typing import Dict, List, Optional, Union, Any

class AiHubMixClient:
    """
    Client for interacting with AiHubMix API
    
    AiHubMix provides OpenAI-compatible APIs for various AI services.
    This client helps manage API keys, query account balance, and use AI models.
    """
    
    def __init__(self, api_url: str = "https://aihubmix.com", access_token: Optional[str] = None):
        """
        Initialize the AiHubMix client
        
        Args:
            api_url: The base URL for the AiHubMix API
            access_token: The API 访问令牌 for authentication
        """
        self.api_url = api_url.rstrip('/')
        self.access_token = access_token
        self.headers = {
            "Content-Type": "application/json"
        }
        
        if access_token:
            self.headers["Authorization"] = access_token
    
    def create_token(self, token_name: str, expires_in: Optional[int] = None, 
                    remaining_quota: Optional[float] = None) -> Dict[str, Any]:
        """
        Create a new API KEY
        
        Args:
            token_name: Name for the new KEY
            expires_in: KEY expiration time in seconds (None for never expire)
            remaining_quota: Remaining quota for the KEY (None for default)
            
        Returns:
            API response containing KEY information
        """
        url = f"{self.api_url}/api/token/"
        
        payload = {
            "name": token_name,
            "expired_time": -1,  # Default to never expire
            "unlimited_quota": False,
            "subnet": ""
        }
        
        if expires_in is not None:
            payload["expired_time"] = expires_in
        
        if remaining_quota is not None:
            payload["remain_quota"] = remaining_quota
        else:
            payload["remain_quota"] = 500000
        
        return self._make_request("POST", url, payload)
    
    def get_balance(self) -> Dict[str, Any]:
        """
        Get account balance information
        
        Returns:
            Account balance and user information
        """
        url = f"{self.api_url}/api/user/self"
        return self._make_request("GET", url)
    
    def get_tokens(self) -> Dict[str, Any]:
        """
        Get all API KEYs for the account
        
        Returns:
            List of all API KEYs
        """
        url = f"{self.api_url}/api/token/"
        return self._make_request("GET", url)
    
    def search_tokens(self, query: str) -> Dict[str, Any]:
        """
        Search API KEYs
        
        Args:
            query: Search query string
            
        Returns:
            List of matching KEYs
        """
        url = f"{self.api_url}/api/token/search?keyword={query}"
        return self._make_request("GET", url)
    
    def get_token(self, token_id: str) -> Dict[str, Any]:
        """
        Get a specific KEY by ID
        
        Args:
            token_id: The ID of the KEY to retrieve
            
        Returns:
            KEY information
        """
        url = f"{self.api_url}/api/token/{token_id}"
        return self._make_request("GET", url)
    
    def update_token(self, token_id: str, **kwargs) -> Dict[str, Any]:
        """
        Update an existing KEY
        
        Args:
            token_id: The ID of the KEY to update
            **kwargs: KEY properties to update
            
        Returns:
            Updated KEY information
        """
        url = f"{self.api_url}/api/token/"
        payload = {"id": token_id, **kwargs}
        return self._make_request("PUT", url, payload)
    
    def delete_token(self, token_id: str) -> Dict[str, Any]:
        """
        Delete a KEY
        
        Args:
            token_id: The ID of the KEY to delete
            
        Returns:
            API response
        """
        url = f"{self.api_url}/api/token/{token_id}"
        return self._make_request("DELETE", url)
    
    def get_models(self) -> Dict[str, Any]:
        """
        Get available AI models
        
        Returns:
            List of available models
        """
        url = f"{self.api_url}/api/models"
        return self._make_request("GET", url)
    
    def get_available_models(self) -> Dict[str, Any]:
        """
        Get models available to the user
        
        Returns:
            List of available models for the user
        """
        url = f"{self.api_url}/api/user/available_models"
        return self._make_request("GET", url)
    
    def get_user_token(self) -> Optional[str]:
        """
        Get user KEY using API 访问令牌
        
        Returns:
            User KEY if successful, None otherwise
        """
        url = f"{self.api_url}/api/user/token"
        result = self._make_request("GET", url)
        
        if result and result.get("success", False):
            data = result.get("data", {})
            return data.get("token")
        return None

    def get_user_self(self) -> Dict[str, Any]:
        """
        Get current user information
        
        Returns:
            User information
        """
        url = f"{self.api_url}/api/user/self"
        return self._make_request("GET", url)
    
    def update_user_self(self, **kwargs) -> Dict[str, Any]:
        """
        Update current user information
        
        Args:
            **kwargs: User properties to update
            
        Returns:
            Updated user information
        """
        url = f"{self.api_url}/api/user/self"
        return self._make_request("PUT", url, kwargs)
    
    def _make_request(self, method: str, url: str, json_data: Optional[Dict] = None) -> Union[Dict[str, Any], str, None]:
        """
        Make HTTP request to the API
        
        Args:
            method: HTTP method (GET, POST, etc.)
            url: API endpoint URL
            json_data: JSON data to send (for POST/PUT)
            
        Returns:
            API response as dictionary, string, or None if failed
        """
        try:
            response = requests.request(method, url, headers=self.headers, json=json_data)
            
            # Check if the response content is empty
            if not response.text.strip():
                return {"success": False, "message": "服务器返回空响应"}
                
            # Try to parse as JSON first
            try:
                result = response.json()
                
                if "access token 无效" in result.get("message", ""):
                    self._handle_invalid_token_error(result.get("message", "未知错误"))
                    return None
                
                # 检查 HTTP 状态码
                if response.status_code >= 400:
                    error_msg = result.get("message", f"请求失败，状态码: {response.status_code}")
                    print(f"错误: {error_msg}")
                    return {"success": False, "message": error_msg}
                    
                return result
                    
            except json.JSONDecodeError:
                # If not JSON, return the text content
                if response.status_code >= 400:
                    print(f"错误: 请求失败，状态码: {response.status_code}")
                    print(f"响应内容: {response.text[:500]}{'...' if len(response.text) > 500 else ''}")
                    return {"success": False, "message": f"请求失败，状态码: {response.status_code}"}
                
                # The API returned text/plain content that's not JSON
                return response.text
                
            except Exception as e:
                print(f"解析响应失败: {e}")
                print(f"响应状态码: {response.status_code}")
                print(f"响应文本: {response.text[:500]}{'...' if len(response.text) > 500 else ''}")
                return {"success": False, "message": f"解析响应失败: {e}"}
            
        except requests.exceptions.ConnectionError:
            print(f"连接错误：无法连接到服务器 {self.api_url}")
            print("请检查：")
            print("1. 网络连接是否正常")
            print("2. API URL 是否正确")
            print("3. 服务器是否可用")
            print(f"可以尝试使用备用域名：https://api.aihubmix.com")
            return None
        except requests.exceptions.Timeout:
            print(f"请求超时：服务器没有在规定时间内响应")
            print("请稍后重试或检查网络连接")
            return None
        except requests.exceptions.RequestException as e:
            print(f"请求失败：{e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg = error_data.get("message", f"请求失败，状态码: {e.response.status_code}")
                    print(f"错误详情：{error_msg}")
                    
                    if "access token 无效" in error_msg:
                        self._handle_invalid_token_error(error_msg)
                except:
                    print(f"状态码：{e.response.status_code}")
                    print(f"响应内容：{e.response.text[:500]}{'...' if len(e.response.text) > 500 else ''}")
            return None
    
    def _handle_invalid_token_error(self, error_message: str) -> None:
        """
        Handle invalid token error with helpful messages
        
        Args:
            error_message: Error message from the API
        """
        print("\n令牌验证失败：" + error_message)
        print("\n可能的原因：")
        print("1. 访问令牌已过期或被禁用")
        print("2. 访问令牌没有足够的权限进行此操作")
        print("3. 访问令牌格式不正确")
        print("\n建议操作：")
        print("1. 登录 AiHubMix 网站 (https://aihubmix.com)，重新生成访问令牌")
        print("2. 确保使用具有正确权限的访问令牌")
        print("3. 检查访问令牌格式是否正确，应为类似 fd*** 格式")
        print("4. 使用 --save-config 保存正确的令牌到配置文件")
        print("5. 尝试使用备用域名：https://api.aihubmix.com")
        print("6. 联系 AiHubMix 客服寻求帮助") 