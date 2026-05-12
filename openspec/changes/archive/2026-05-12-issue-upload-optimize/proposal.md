## Why

当前问题反馈页面将所有图片和视频一次性打包提交，导致 Nginx 因 `client_max_body_size` 限制返回 413，或因飞书上传耗时过长导致 `proxy_read_timeout` 超时返回 504。需要将文件上传从提交流程中剥离，改为逐个上传，同时提供上传进度反馈。

## What Changes

- **新增** 验证码校验接口 `POST /issue/verify-captcha`，校验通过后返回一次性 `uploadToken`（无 Redis，用 JWT 实现，有效期 10 分钟）
- **新增** 单文件上传接口 `POST /issue/upload-file`，携带 `uploadToken`，服务端接收文件后立即返回（异步上传飞书），前端可感知上传进度
- **新增** 新版提交接口 `POST /issue/submit-v2`，只接收文本字段 + 已上传文件的 URL 列表，不再传文件
- **保留** 原接口 `POST /issue/submit` 不变，兼容已发布版本
- **前端** 新增分步流程：校验验证码 → 逐个上传文件（展示进度）→ 提交表单
- **Nginx** 调整 `client_max_body_size` 和 `proxy_read_timeout` 配置

## Capabilities

### New Capabilities

- `issue-captcha-verify`: 验证码独立校验，返回 uploadToken（JWT，无状态，无需 Redis）
- `issue-file-upload`: 单文件上传接口，服务端接收即返回，异步上传飞书，前端展示逐文件上传进度
- `issue-submit-v2`: 新版提交接口，仅接收文本 + fileUrl 列表，不处理文件

### Modified Capabilities

（无，原 submit 接口行为不变）

## Impact

- **后端**：`langrissar-server/src/issue/` 新增接口和服务方法；新增 JWT 工具（复用项目现有 JWT 模块或 `@nestjs/jwt`）
- **前端**：`langrissar-github/src/b/issues.vue` 重写提交流程，新增进度 UI
- **Nginx**：需调整 `client_max_body_size`（≥ 250m）和 `proxy_read_timeout`（≥ 120s）
- **无破坏性变更**：原 `/issue/submit` 接口完整保留
