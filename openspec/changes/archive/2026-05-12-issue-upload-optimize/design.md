## Context

当前 `POST /issue/submit` 接口将所有图片和视频一次性通过 multipart/form-data 上传，服务端接收后再串行上传到飞书云空间。这导致两个问题：

1. **413**：Nginx `client_max_body_size` 默认 1MB，多个大文件一次性提交超限
2. **504**：飞书上传耗时（尤其是视频分片上传）超过 Nginx `proxy_read_timeout` 默认 60s

项目无 Redis，已有 `@nestjs/jwt` 和 `JwtService`（在 UserModule 中注册）。验证码存储在 `UserService.captchaStore`（内存 Map）。

## Goals / Non-Goals

**Goals:**
- 新增三个接口实现分步上传流程，解决 413/504
- 前端逐文件上传，展示实时进度（第 N 个文件，已上传 X%）
- 服务端接收文件后立即返回，飞书上传异步进行，前端给用户友好提示
- 原 `POST /issue/submit` 接口完整保留，不影响已发布版本
- 提供 Nginx 配置修改指引

**Non-Goals:**
- 不实现飞书上传进度的实时推送（WebSocket/SSE）
- 不实现上传任务的持久化状态查询
- 不修改管理端相关接口

## Decisions

### 1. uploadToken 用 JWT 实现（无 Redis）

**决策**：复用项目已有的 `JwtService`，签发一个短期 JWT 作为 uploadToken。

**Payload**：`{ captchaId, purpose: 'issue-upload', iat, exp }`

**有效期**：10 分钟（足够完成上传流程）

**验证**：`/issue/upload-file` 和 `/issue/submit-v2` 都需要验证此 token，用 `jwtService.verify()` 即可，无需存储。

**替代方案**：内存 Map（类似 captchaStore）—— 但无法水平扩展，且 JWT 已有基础设施，优先复用。

### 2. 服务端接收即返回，飞书上传异步

**决策**：`/issue/upload-file` 接收文件写入临时目录后，立即返回一个 `pendingFileId`（UUID），然后异步执行飞书上传。前端拿到 pendingFileId 后继续下一个文件。

**最终提交**：`/issue/submit-v2` 接收 `pendingFileIds[]`，服务端查找对应的上传结果（内存 Map 存储 `pendingFileId → { status, url }`）。若飞书上传尚未完成，等待完成后再落库。

**内存 Map 结构**：
```
pendingUploads: Map<string, {
  status: 'uploading' | 'done' | 'error',
  url?: string,
  error?: string,
  promise: Promise<void>  // 用于 submit-v2 等待
}>
```

**替代方案**：同步等待飞书上传完成再返回 —— 单文件可能 10-30s，用户体验差，且仍有 504 风险。

### 3. 上传进度由前端 axios onUploadProgress 实现

**决策**：前端用 axios 的 `onUploadProgress` 回调获取文件上传到服务器的进度（0-100%）。飞书上传阶段显示"处理中..."提示。

**进度展示**：`正在上传第 N/M 个文件（文件名）... XX%`

### 4. IssueModule 注入 JwtModule

**决策**：在 `IssueModule` 中 import `JwtModule.register(...)` 使用相同配置，或抽取为全局模块。查看现有代码，JwtModule 在 UserModule 中注册，需在 IssueModule 中单独注册（或将 JwtModule 改为 global）。

选择在 IssueModule 中单独注册，避免改动现有模块结构。

### 5. Nginx 配置调整

需修改两个参数：
```nginx
client_max_body_size 250m;   # 单文件最大 200MB，留余量
proxy_read_timeout 120s;     # 给飞书上传留足时间
proxy_connect_timeout 10s;
proxy_send_timeout 30s;
```

## Risks / Trade-offs

- **内存泄漏风险**：pendingUploads Map 需要定期清理过期条目。→ 缓解：设置 TTL（如 30 分钟），定时清理
- **服务重启丢失**：pendingUploads 在内存中，服务重启后 pendingFileId 失效。→ 缓解：前端在 submit-v2 时若收到"文件不存在"错误，提示用户重新上传
- **飞书上传失败**：异步上传失败时，submit-v2 等待 promise 会 reject。→ 缓解：submit-v2 等待时捕获错误，返回具体失败信息，前端提示重试
- **uploadToken 无法主动吊销**：JWT 无状态，10 分钟内有效。→ 可接受，这是公开表单，风险低

## Migration Plan

1. 后端先发布（新增接口，原接口不变）
2. Nginx 配置更新（可与后端同步或提前）
3. 前端发布新版本（使用新接口流程）
4. 观察一段时间后，可选择下线旧接口（不强制）

## Open Questions

- 无
