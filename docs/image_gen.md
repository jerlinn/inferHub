# 通用图形接口

## 接口说明

Aihubmix 提供统一图形接口，支持以下多种主流模型：

- [OpenAI 系列](#openai)
- [Ideogram V3](#ideogram-v3)
- [Stability SD 3.5 Large](#stability)
- [Google Imagen 系列](#google-imagen)

**接口规格：**

```shell Curl
curl https://aihubmix.com/v1/models/<model_path>/predictions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer sk-***" \
    -d '{
  "input": {
    "prompt": "your prompt"
  }
}'
```

**其中：**

- `https://aihubmix.com/v1/models/` 为固定前缀
- `<model_path>` 为模型路径，支持：
  - `opanai/gpt-image-1`
  - `opanai/dall-e-3`
  - `ideogram/V3`
  - `stability/Stable-Diffusion-3-5-Large`
  - `imagen-4.0-ultra-generate-preview-06-06`
  - `imagen-4.0-generate-preview-06-06`
  - `imagen-4.0-ultra-generate-exp-05-20`
  - `imagen-4.0-generate-preview-05-20`
  - `imagen-3.0-generate-002`
- `sk-***` 为你在 Aihubmix 生成的 API Key

---

下面是各个模型的调用方法。

## OpenAI

### 支持的模型：

- gpt-image-1
- dall-e-3

<Note>
  不支持 2 个逆向模型 `gpt-4o-image-vip` 和 `gpt-4o-image`
</Note>

### 调用方法：

<CodeGroup>

```shell Curl gpt-image-1
curl https://aihubmix.com/v1/models/opanai/gpt-image-1/predictions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer sk-***" \
    -d '{
  "input": {
    "prompt": "A deer drinking in the lake, Sakura petals falling, green and clean water, japanese temple, dappled sunlight, cinematic lighting, expansive view, peace",
    "size": "1024x1024", 
    "n": 1,
    "quality": "high",
    "moderation": "low",
    "background": "auto"
  }
}'
```


```shell Curl dall-e-3
curl https://aihubmix.com/v1/models/opanai/dall-e-3/predictions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer sk-***" \
    -d '{
  "input": {
    "prompt": "A deer drinking in the lake, Sakura petals falling, green and clean water, japanese temple, dappled sunlight, cinematic lighting, expansive view, peace",
    "size": "1024x1024", 
    "n": 1
  }
}'
```

</CodeGroup>

## Ideogram V3

### 支持的模型：

- V3

<Note>
  1. V3 以下版本（V_2、V_1 等）为旧接口，暂不支持
  2. 返回的链接需要打开代理网络才能获取
</Note>

### 调用方法：

<CodeGroup>

```shell Curl
curl https://aihubmix.com/v1/models/ideogram/V3/predictions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer sk-***" \
    -d '{
  "input": {
    "prompt": "A deer drinking in the lake, Sakura petals falling, green and clean water, japanese temple, dappled sunlight, cinematic lighting, expansive view, peace, in the style of Pixar 3D",
    "rendering_speed": "QUALITY",
    "aspect_ratio": "2x1"
  }
}'
```

</CodeGroup>

## Stability

### 支持的模型：

- Stable-Diffusion-3-5-Large

### 调用方法：

<CodeGroup>

```shell Curl
curl https://aihubmix.com/v1/models/stability/Stable-Diffusion-3-5-Large/predictions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer sk-***" \
    -d '{
  "input": {
    "prompt": "A deer drinking in the lake, Sakura petals falling, green and clean water, japanese temple, dappled sunlight, cinematic lighting, expansive view, peace",
    "n": 1
  }
}'
```

</CodeGroup>

## Google Imagen

### 支持的模型：

- `imagen-4.0-ultra-generate-preview-06-06`
- `imagen-4.0-generate-preview-06-06`
- `imagen-4.0-ultra-generate-exp-05-20`
- `imagen-4.0-generate-preview-05-20`
- `imagen-3.0-generate-002`

<Note>
  不支持 gemini 系列
</Note>

### 调用方法：

<CodeGroup>

```shell Curl
curl https://aihubmix.com/v1/models/google/imagen-3.0-generate-002/predictions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer sk-***" \
    -d '{
  "input": {
    "prompt": "A deer drinking in the lake, Sakura petals falling, green and clean water, japanese temple, dappled sunlight, cinematic lighting, expansive view, peace",
    "numberOfImages": 1
  }
}'
```

</CodeGroup>