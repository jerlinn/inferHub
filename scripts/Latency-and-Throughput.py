'''性能测试脚本 - 延迟和吞吐量计算

延迟计算：
- 使用 stream 模式测量第一个 token 的响应时间
- 多轮测试取平均值和标准差

吞吐量计算：
- 使用非 stream 模式测量完整响应生成
- 吞吐率 = response.usage.total_tokens / 生成时间 (TPS)
- 记录平均、最大、最低吞吐率

@author: jerlin
'''

from openai import OpenAI
import os
import time
import numpy as np

# 全局变量：模型 ID
MODEL_ID = "claude-sonnet-4-20250514"

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

def measure_latency(test_rounds=3):
    latencies = []
    test_messages = ["Hi"] * 3  # 统一使用简单的"Hi"作为测试输入
    
    # 在获取第一个 token 后直接计算并记录延迟
    for i in range(test_rounds):
        start_time = time.time()
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": test_messages[i % len(test_messages)]}],
            stream=True
        )
        
        # 仅测量第一个 token 的延迟
        try:
            next(response)
            first_token_time = time.time()
            latency = first_token_time - start_time
            latencies.append(latency)
        except StopIteration:
            print(f"警告：第{i+1}轮测试未收到任何 token")
    
    # 计算延迟统计指标
    if latencies:
        avg_latency = np.mean(latencies)
        std_latency = np.std(latencies)
    else:
        avg_latency = float('inf')
        std_latency = 0
        print("警告：所有测试轮次均未收到 token，无法计算有效的延迟指标")
    
    return avg_latency, std_latency

def measure_throughput(test_rounds=3):
    throughputs = []
    token_counts = []
    test_messages = [
        "用一个简洁段落来讲解第一性原理",
        "解释一下量子纠缠现象",
        "什么是 LLM 的幻觉"
    ]
    
    for i in range(test_rounds):
        start_time = time.time()
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": test_messages[i % len(test_messages)]}],
            stream=False
        )
        end_time = time.time()
        
        # 使用 response.usage 获取准确的 token 数量
        token_count = response.usage.total_tokens
        token_counts.append(token_count)
        
        # 计算吞吐率
        generation_time = end_time - start_time
        if generation_time > 0:
            throughput = token_count / generation_time
            throughputs.append(throughput)
        else:
            print(f"警告：第{i+1}轮测试 generation_time 异常，已跳过")
            continue
    
    # 计算吞吐率统计指标
    avg_throughput = np.mean(throughputs)
    std_throughput = np.std(throughputs)
    avg_tokens = np.mean(token_counts)
    max_throughput = max(throughputs)
    min_throughput = min(throughputs)
    
    return avg_throughput, std_throughput, avg_tokens, max_throughput, min_throughput

def measure_performance(test_rounds=3):
    # 测量延迟
    avg_latency, std_latency = measure_latency(test_rounds)
    
    # 测量吞吐率
    avg_throughput, std_throughput, avg_tokens, max_throughput, min_throughput = measure_throughput(test_rounds)
    
    # 打印详细的性能报告
    print("\n=== 性能测试报告 ===")
    print(f"测试轮数：{test_rounds}")
    print(f"平均延迟：{avg_latency:.2f} S")
    print(f"平均吞吐率：{avg_throughput:.2f} TPS")
    print(f"总 token 数：{int(avg_tokens)}")
    print(f"最高吞吐率：{max_throughput:.2f} TPS")
    print(f"最低吞吐率：{min_throughput:.2f} TPS")
    print("===================")

if __name__ == "__main__":
    measure_performance()
