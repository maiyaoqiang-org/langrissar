## ADDED Requirements

### Requirement: 新版提交接口（仅文本 + fileId 列表）
系统 SHALL 提供 `POST /issue/submit-v2` 接口，接收 `uploadToken`、`nickname`、`question` 和 `pendingFileIds[]`（字符串数组），不接收文件。系统验证 token 后，等待所有 pendingFileId 对应的飞书上传完成，再落库并通知 Coze。

#### Scenario: 所有文件已上传完成
- **WHEN** 客户端提交 submit-v2，所有 pendingFileId 对应状态均为 done
- **THEN** 系统立即落库，返回 `{ id: "<uuid>" }`，HTTP 200

#### Scenario: 部分文件仍在上传中
- **WHEN** 客户端提交 submit-v2，部分 pendingFileId 对应状态为 uploading
- **THEN** 系统等待对应 Promise resolve 后再落库，返回 `{ id: "<uuid>" }`，HTTP 200

#### Scenario: 某文件飞书上传失败
- **WHEN** 客户端提交 submit-v2，某 pendingFileId 对应状态为 error
- **THEN** 系统返回 HTTP 400，message 说明哪个文件上传失败，提示用户重新上传

#### Scenario: pendingFileId 不存在（服务重启等）
- **WHEN** 客户端提交的 pendingFileId 在内存中不存在
- **THEN** 系统返回 HTTP 400，message 提示"文件信息已失效，请重新上传"

#### Scenario: uploadToken 无效或过期
- **WHEN** 客户端携带无效或过期的 uploadToken
- **THEN** 系统返回 HTTP 401

#### Scenario: 不传 pendingFileIds（纯文字提交）
- **WHEN** 客户端提交 submit-v2 时 pendingFileIds 为空数组或不传
- **THEN** 系统正常落库（无图片/视频），返回 `{ id: "<uuid>" }`，HTTP 200
