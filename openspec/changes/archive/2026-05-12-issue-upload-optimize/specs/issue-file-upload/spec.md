## ADDED Requirements

### Requirement: 单文件上传接口
系统 SHALL 提供 `POST /issue/upload-file` 接口，接收 `uploadToken`（Header 或 Body）和单个文件（multipart/form-data，字段名 `file`），验证 token 后将文件写入临时目录，立即返回 `pendingFileId`，并异步执行飞书上传。

#### Scenario: 合法 token 上传图片
- **WHEN** 客户端携带有效 uploadToken 上传一张图片（≤10MB）
- **THEN** 系统立即返回 `{ pendingFileId: "<uuid>", status: "uploading" }`，HTTP 200，后台异步上传飞书

#### Scenario: 合法 token 上传视频
- **WHEN** 客户端携带有效 uploadToken 上传一个视频（≤200MB）
- **THEN** 系统立即返回 `{ pendingFileId: "<uuid>", status: "uploading" }`，HTTP 200，后台异步上传飞书

#### Scenario: uploadToken 无效或过期
- **WHEN** 客户端携带无效或过期的 uploadToken
- **THEN** 系统返回 HTTP 401

#### Scenario: 文件超过大小限制
- **WHEN** 客户端上传图片超过 10MB 或视频超过 200MB
- **THEN** 系统返回 HTTP 400，message 说明超限

#### Scenario: 文件类型不合法
- **WHEN** 客户端上传非图片/视频文件
- **THEN** 系统返回 HTTP 400，message 说明类型不支持

### Requirement: 上传状态内存管理
系统 SHALL 在内存中维护 `pendingUploads` Map，存储每个 pendingFileId 对应的上传状态（uploading/done/error）、飞书 URL 和异步 Promise。条目 SHALL 在创建 30 分钟后自动清理，防止内存泄漏。

#### Scenario: 飞书上传成功
- **WHEN** 异步飞书上传完成
- **THEN** 对应条目 status 更新为 done，url 字段填入飞书访问链接

#### Scenario: 飞书上传失败
- **WHEN** 异步飞书上传抛出异常
- **THEN** 对应条目 status 更新为 error，error 字段记录错误信息

#### Scenario: 条目过期清理
- **WHEN** 某条目创建超过 30 分钟
- **THEN** 系统定时任务将其从 Map 中删除
