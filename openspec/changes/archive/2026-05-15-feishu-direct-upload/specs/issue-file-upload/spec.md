## MODIFIED Requirements

### Requirement: 单文件上传接口
系统 SHALL 提供 `POST /issue/upload-file` 接口，接收 `uploadToken`（Header `x-upload-token`）和单个文件（multipart/form-data，字段名 `file`）。验证 token 后，根据文件大小选择上传策略：
- ≤20MB：使用 multer memoryStorage 接收为 Buffer，直接传给飞书 uploadAll
- \>20MB：使用 diskStorage 写入临时目录，飞书分块上传，完成后立即删除临时文件

上传 SHALL 同步完成，接口直接返回 `{ fileToken, url, mimeType }`。

#### Scenario: 合法 token 上传小图片
- **WHEN** 客户端携带有效 uploadToken 上传一张 5MB PNG 图片
- **THEN** 系统将 Buffer 直接传给飞书 uploadAll，同步返回 `{ fileToken: "xxx", url: "https://...", mimeType: "image/png" }`，HTTP 200

#### Scenario: 合法 token 上传大视频
- **WHEN** 客户端携带有效 uploadToken 上传一个 150MB MP4 视频
- **THEN** 系统写入临时目录，通过飞书分块上传完成后立即删除临时文件，同步返回 `{ fileToken: "xxx", url: "https://...", mimeType: "video/mp4" }`，HTTP 200

#### Scenario: uploadToken 无效或过期
- **WHEN** 客户端携带无效或过期的 uploadToken
- **THEN** 系统返回 HTTP 401

#### Scenario: 文件超过大小限制
- **WHEN** 客户端上传图片超过 10MB 或视频超过 200MB
- **THEN** 系统返回 HTTP 400，message 说明超限

#### Scenario: 文件类型不合法
- **WHEN** 客户端上传非图片/视频文件
- **THEN** 系统返回 HTTP 400，message 说明类型不支持

#### Scenario: 飞书上传失败
- **WHEN** 飞书 API 返回错误或网络超时
- **THEN** 系统返回 HTTP 400，message 说明上传失败原因

## REMOVED Requirements

### Requirement: 上传状态内存管理
**Reason**: 流式上传同步完成，不再需要异步状态管理
**Migration**: 去掉 pendingUploads Map、30 分钟定时清理、pendingFileId 概念
