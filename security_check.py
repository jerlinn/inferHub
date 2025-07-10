#!/usr/bin/env python3
"""
Security Check Script
扫描项目文件中的潜在 API 密钥泄露 (sk-xxx 格式)
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple

class SecurityScanner:
    def __init__(self, root_dir: str = "."):
        self.root_dir = Path(root_dir)
        self.target_extensions = {'.py', '.tsx', '.ts', '.js', '.jsx', '.vue', '.json', '.env', '.yaml', '.yml'}
        self.excluded_dirs = {
            'node_modules', '.git', '__pycache__', '.next', 'dist', 'build', 
            '.venv', 'venv', 'env', '.env'
        }
        
        # 匹配 sk- 开头，后跟数字和字母的模式，但排除 sk-*** 这种占位符
        self.api_key_pattern = re.compile(r'sk-[a-zA-Z0-9]{10,}')
        
        self.findings: List[Dict] = []
        
    def should_scan_file(self, file_path: Path) -> bool:
        """判断是否应该扫描该文件"""
        # 检查文件扩展名
        if file_path.suffix not in self.target_extensions:
            return False
            
        # 检查是否在排除目录中
        for part in file_path.parts:
            if part in self.excluded_dirs:
                return False
                
        return True
    
    def scan_file(self, file_path: Path) -> List[Dict]:
        """扫描单个文件中的 API 密钥"""
        findings = []
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                
            for line_num, line in enumerate(lines, 1):
                matches = self.api_key_pattern.findall(line.strip())
                
                for match in matches:
                    # 排除明显的占位符
                    if not re.match(r'sk-\*+$', match):
                        findings.append({
                            'file': str(file_path.relative_to(self.root_dir)),
                            'line': line_num,
                            'key': match,
                            'context': line.strip()[:100] + ('...' if len(line.strip()) > 100 else '')
                        })
                        
        except Exception as e:
            print(f"警告: 无法读取文件 {file_path}: {e}")
            
        return findings
    
    def scan_directory(self) -> None:
        """扫描整个目录"""
        print(f"开始扫描目录: {self.root_dir.absolute()}")
        
        scanned_files = 0
        for file_path in self.root_dir.rglob('*'):
            if file_path.is_file() and self.should_scan_file(file_path):
                file_findings = self.scan_file(file_path)
                self.findings.extend(file_findings)
                scanned_files += 1
                
                if scanned_files % 50 == 0:
                    print(f"已扫描 {scanned_files} 个文件...")
                    
        print(f"扫描完成，共检查 {scanned_files} 个文件")
    
    def generate_report(self) -> str:
        """生成扫描报告"""
        report_lines = [
            "# 安全检查报告",
            "",
            f"**扫描时间:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"**扫描目录:** {self.root_dir.absolute()}",
            "",
            "## 扫描结果概览",
            "",
            f"- **发现的潜在 API 密钥数量:** {len(self.findings)}",
            f"- **涉及文件数量:** {len(set(finding['file'] for finding in self.findings))}",
            "",
        ]
        
        if not self.findings:
            report_lines.extend([
                "## ✅ 恭喜！",
                "",
                "未发现任何 `sk-xxx` 格式的 API 密钥泄露。",
                "",
                "## 扫描范围",
                "",
                f"- **文件类型:** {', '.join(sorted(self.target_extensions))}",
                f"- **排除目录:** {', '.join(sorted(self.excluded_dirs))}",
                "",
                "## 建议",
                "",
                "- 继续保持良好的安全习惯",
                "- 定期运行此脚本进行检查",
                "- 使用环境变量或配置文件管理敏感信息",
            ])
        else:
            report_lines.extend([
                "## ⚠️  发现的潜在 API 密钥",
                "",
                "以下文件中发现了疑似 API 密钥，请立即检查并处理：",
                "",
            ])
            
            # 按文件分组
            by_file = {}
            for finding in self.findings:
                if finding['file'] not in by_file:
                    by_file[finding['file']] = []
                by_file[finding['file']].append(finding)
            
            for file_path, file_findings in sorted(by_file.items()):
                report_lines.extend([
                    f"### 📁 `{file_path}`",
                    "",
                ])
                
                for finding in file_findings:
                    report_lines.extend([
                        f"- **行 {finding['line']}:** `{finding['key']}`",
                        f"  ```",
                        f"  {finding['context']}",
                        f"  ```",
                        "",
                    ])
            
            report_lines.extend([
                "## 🔒 安全建议",
                "",
                "1. **立即行动:**",
                "   - 撤销/重置所有泄露的 API 密钥",
                "   - 检查相关账户是否有异常活动",
                "",
                "2. **代码修复:**",
                "   - 将 API 密钥移至环境变量",
                "   - 使用 `.env` 文件（确保加入 `.gitignore`）",
                "   - 考虑使用密钥管理服务",
                "",
                "3. **预防措施:**",
                "   - 在 CI/CD 中集成此安全检查",
                "   - 使用 pre-commit hooks",
                "   - 定期进行安全审计",
                "",
                "## 示例：安全的 API 密钥管理",
                "",
                "```python",
                "import os",
                "from dotenv import load_dotenv",
                "",
                "load_dotenv()",
                "api_key = os.getenv('OPENAI_API_KEY')",
                "```",
                "",
                "```bash",
                "# .env 文件",
                "OPENAI_API_KEY=sk-your-actual-key-here",
                "```",
            ])
        
        return "\n".join(report_lines)
    
    def save_report(self, output_file: str = "safety-check.md") -> None:
        """保存报告到文件"""
        report = self.generate_report()
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)
            
        print(f"报告已保存至: {output_file}")
        
        # 输出简要统计
        if self.findings:
            print(f"\n⚠️  发现 {len(self.findings)} 个潜在的 API 密钥泄露！")
            print(f"涉及 {len(set(finding['file'] for finding in self.findings))} 个文件")
            print("请查看详细报告并立即处理。")
        else:
            print("\n✅ 未发现 API 密钥泄露，安全检查通过！")

def main():
    """主函数"""
    print("=== 项目安全检查工具 ===")
    print("正在扫描 sk-xxx 格式的 API 密钥...")
    print()
    
    scanner = SecurityScanner()
    scanner.scan_directory()
    scanner.save_report()

if __name__ == "__main__":
    main() 