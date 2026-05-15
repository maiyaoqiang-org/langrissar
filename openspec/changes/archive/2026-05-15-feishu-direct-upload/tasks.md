## 1. 后端 - FeishuStorageService 新增流式上传方法

- [x] 1.1 在 `feishu-storage.service.ts` 新增 `uploadBuffer(input)` 方法：接收 Buffer 而非文件路径，调用飞书 uploadAll，返回 `{ fileToken, url }`
- [x] 1.2 新增 `uploadLargeFileFromPath(input)` 方法：接收文件路径，使用飞书分块上传（prepare → uploadPart × N → finish），返回 `{ fileToken, url }`，上传完成后删除临时文件

## 2. 后端 - IssueService 重写 uploadFile

- [x] 2.1 修改 `issue.controller.ts` 的 upload-file 端点：根据文件大小切换 multer storage（≤20MB 用 memoryStorage，>20MB 用 diskStorage）
- [x] 2.2 重写 `issue.service.ts` 的 `uploadFile` 方法：同步调用飞书上传，返回 `{ fileToken, url, mimeType }` 而非 `{ pendingFileId, status }`
- [x] 2.3 去掉 `pendingUploads` Map、定时清理逻辑、`cleanTmpFile` 方法

## 3. 后端 - IssueService 简化 submitV2

- [x] 3.1 修改 `submit-v2-issue-feedback.dto.ts`：将 `pendingFileIds` 字段改为 `fileTokens`（类型不变，仍是 `string[]`）
- [x] 3.2 重写 `submitV2` 方法：接收 fileTokens，对每个 fileToken 调用 `resolvePublicUrl`，按 mimeType 分类为 imageUrls / videoUrls，落库
- [x] 3.3 去掉 submitV2 中 409/ConflictException 逻辑和失败文件检查逻辑

## 4. 前端 - issues.vue 适配新接口

- [x] 4.1 修改 `submitFormV2`：upload-file 返回 `{ fileToken, url, mimeType }`，收集 fileTokens 而非 pendingFileIds
- [x] 4.2 去掉 submit-v2 的 409 重试循环（while + setTimeout），改为直接调用一次
- [x] 4.3 去掉 `skipErrorCodes: [409]` 配置（不再需要）
- [x] 4.4 去掉 `uploadProgress` 中的 `processing` phase（不再有异步处理阶段）
- [x] 4.5 更新 `maskMessage`：去掉 `processing` 状态的文案
