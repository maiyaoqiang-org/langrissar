## Context

当前 issue 上传流程（V2）：前端逐个上传文件到后端 → 后端 multer diskStorage 写入 tmp-issue-upload 目录 → 异步调用飞书 API 上传 → 前端轮询 submit-v2 等待结果。

关键瓶颈：
- 文件落磁盘后再读取上传，双倍 I/O
- 异步飞书上传 + pendingUploads Map 增加状态管理复杂度
- 前端需要 409 轮询等待文件处理完成
- 临时文件清理逻辑（定时清理 pendingUploads + cleanTmpFile）

## Goals / Non-Goals

**Goals:**
- 后端收到文件后直接流式转发到飞书，不落磁盘
- 上传同步完成，接口直接返回 file_token 和 URL
- 去掉 pendingUploads Map 和 409 轮询逻辑
- 前端体验不变（逐文件上传 + 进度条）

**Non-Goals:**
- 不改变前端上传交互（仍然逐文件上传到后端）
- 不改变飞书存储路径和权限设置
- 不引入新的外部依赖（OSS 等）

## Decisions

### 1. 使用 multer memoryStorage 替代 diskStorage

**选择**：multer `memoryStorage` 将文件读入内存 Buffer，然后流式转发到飞书。

**备选方案**：
- diskStorage + 流式读取：仍需磁盘 I/O
- 自定义 storage engine 直接 pipe：实现复杂，multer 不支持真正的 streaming upload

**理由**：memoryStorage 简单直接，文件在内存中作为 Buffer 存在，可以直接传给飞书 SDK。对于单文件上传（V2 已是逐个上传），内存占用可控。图片 ≤10MB，视频 ≤200MB，但视频场景下 200MB 全量加载到内存可能偏高。

**最终方案**：对于小文件（≤20MB，含所有图片和大部分视频）使用 memoryStorage + 飞书 uploadAll。对于大文件（>20MB）仍然使用 diskStorage + 飞书分块上传，上传完立即删除临时文件。这是 pragmatic 的折中——大多数上传是图片（<10MB），真正的大视频才走磁盘。

### 2. 飞书上传改为同步等待

**选择**：upload-file 接口同步等待飞书上传完成，直接返回 `{ fileToken, url }`。

**理由**：不再需要 pendingUploads Map、409 轮询、定时清理。前端拿到响应就知道文件已上传成功，直接收集 fileToken 提交即可。

**权衡**：upload-file 接口响应时间变长（需要等飞书上传完），但前端已有进度条遮罩，用户体验不变。

### 3. submit-v2 简化

**选择**：submit-v2 只需接收 fileToken 列表（不再是 pendingFileId），直接设置公开权限 + 落库。

**理由**：文件上传已在 upload-file 阶段同步完成，submit-v2 只负责落库和通知 Coze。

### 4. 前端去掉 409 重试

**选择**：前端 submitFormV2 去掉 while 重试循环，直接调一次 submit-v2。

**理由**：不再有异步处理中的状态。

## Risks / Trade-offs

- **[大文件内存占用]** → 小文件用 memoryStorage，大文件（>20MB）仍走 diskStorage + 即时清理，规避风险
- **[upload-file 接口耗时变长]** → 前端已有上传进度条和遮罩，用户感知不变；后端设 timeout: 0 允许长耗时
- **[飞书 API 超时/失败]** → 同步上传失败直接返回错误，前端 alert 提示，用户可重试；比异步失败后才发现更直观
- **[nginx 代理超时]** → 已配置 proxy_read_timeout 600s，覆盖最大上传耗时
