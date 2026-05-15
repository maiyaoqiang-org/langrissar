## MODIFIED Requirements

### Requirement: 新版提交接口（仅文本 + fileToken 列表）
系统 SHALL 提供 `POST /issue/submit-v2` 接口，接收 `uploadToken`（Header `x-upload-token`）、`nickname`、`question` 和 `fileTokens[]`（字符串数组，每个为 upload-file 返回的 fileToken）。系统验证 token 后，对每个 fileToken 设置公开权限、解析公开 URL，收集为 imageUrls / videoUrls，落库并通知 Coze。

#### Scenario: 提交带文件的反馈
- **WHEN** 客户端提交 submit-v2，携带有效的 fileTokens 列表
- **THEN** 系统对每个 fileToken 设置公开权限，按 mimeType 分类为 imageUrls / videoUrls，落库，返回 `{ id: "<uuid>" }`，HTTP 200

#### Scenario: 纯文字提交
- **WHEN** 客户端提交 submit-v2 时 fileTokens 为空数组或不传
- **THEN** 系统正常落库（无图片/视频），返回 `{ id: "<uuid>" }`，HTTP 200

#### Scenario: uploadToken 无效或过期
- **WHEN** 客户端携带无效或过期的 uploadToken
- **THEN** 系统返回 HTTP 401

## REMOVED Requirements

### Requirement: 部分文件仍在上传中（409 轮询）
**Reason**: 文件上传已在 upload-file 阶段同步完成，不再存在"上传中"状态
**Migration**: 前端去掉 409 重试循环，submit-v2 调用一次即可

### Requirement: 飞书上传失败检查
**Reason**: 上传失败已在 upload-file 阶段直接返回错误，submit-v2 不再需要检查上传状态
**Migration**: submit-v2 只处理 fileToken 权限设置和落库
