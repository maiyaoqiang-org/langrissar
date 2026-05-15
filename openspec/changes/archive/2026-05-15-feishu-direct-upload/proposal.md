## Why

当前 issue 上传流程是"前端 → 后端磁盘 → 飞书"两跳中转，文件先完整写入服务器临时目录（tmp-issue-upload），再由后端异步读取并上传飞书。3Mbps 带宽下每 10MB 附件用户需等待约 30 秒，且磁盘 I/O 和临时文件管理增加了复杂度和潜在泄漏风险。优化为后端流式代理转发（不落磁盘），可以减少磁盘开销、简化临时文件清理逻辑、降低内存占用。

## What Changes

- 修改 `upload-file` 接口：后端收到文件后直接流式转发到飞书 API，不写入临时目录
- 对于大文件（>20MB）使用飞书分块上传，后端逐块 pipe 转发
- 去掉异步 pendingUploads 逻辑：流式转发是同步的，上传完成后立即拿到 file_token
- 简化 submit-v2：不再需要轮询等待文件处理，直接提交即可
- 去掉临时文件清理逻辑（不再有临时文件）

## Capabilities

### New Capabilities
- `issue-streaming-upload`: 后端流式代理转发文件到飞书（不落磁盘），小文件 uploadAll、大文件分块 upload，同步返回 file_token 和 URL

### Modified Capabilities
- `issue-submit-v2`: 去掉 409 轮询逻辑，文件上传已同步完成，直接落库即可
- `issue-file-upload`: 从"落磁盘 + 异步飞书上传"改为"流式转发 + 同步返回"

## Impact

- **后端** langrissar-server/src/issue/issue.service.ts：uploadFile 方法重写为流式转发
- **后端** langrissar-server/src/feishu-storage/feishu-storage.service.ts：新增流式上传方法（接收 stream 而非文件路径）
- **前端** langrissar-github/src/b/issues.vue：去掉 409 重试循环，submit-v2 直接调用一次即可
- **部署**：不再需要 tmp-issue-upload 目录，不再需要定时清理 pendingUploads
