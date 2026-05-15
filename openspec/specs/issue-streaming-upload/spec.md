### Requirement: 后端流式转发文件到飞书（不落磁盘，小文件）
对于 ≤20MB 的文件，后端 SHALL 使用 multer memoryStorage 接收文件为 Buffer，直接传给飞书 SDK uploadAll 接口，不写入磁盘。上传完成后 SHALL 返回 `{ fileToken, url }`。

#### Scenario: 小图片上传
- **WHEN** 前端上传一张 5MB 的 PNG 图片到 `/issue/upload-file`
- **THEN** 后端将文件 Buffer 直接传给飞书 uploadAll，不写临时文件，返回 `{ fileToken: "xxx", url: "https://..." }`

#### Scenario: 小视频上传
- **WHEN** 前端上传一个 15MB 的 MP4 视频到 `/issue/upload-file`
- **THEN** 后端将文件 Buffer 直接传给飞书 uploadAll，不写临时文件，返回 `{ fileToken: "xxx", url: "https://..." }`

### Requirement: 大文件分块上传（落磁盘 + 即时清理）
对于 >20MB 的文件，后端 SHALL 使用 diskStorage 写入临时目录，使用飞书分块上传（prepare → uploadPart × N → finish），上传完成后 SHALL 立即删除临时文件。

#### Scenario: 大视频上传
- **WHEN** 前端上传一个 150MB 的 MP4 视频到 `/issue/upload-file`
- **THEN** 后端写入临时目录，通过飞书分块上传完成后立即删除临时文件，返回 `{ fileToken: "xxx", url: "https://..." }`

#### Scenario: 临时文件清理
- **WHEN** 大文件飞书上传完成（无论成功或失败）
- **THEN** 临时文件 SHALL 被立即删除，不留残留

### Requirement: 同步返回上传结果
upload-file 接口 SHALL 同步等待飞书上传完成后返回结果，不使用异步 pendingUploads Map。

#### Scenario: 上传成功立即返回
- **WHEN** 前端上传文件到 `/issue/upload-file`
- **THEN** 接口阻塞直到飞书上传完成，返回 `{ fileToken, url, mimeType }`

#### Scenario: 上传失败返回错误
- **WHEN** 飞书上传失败（网络错误、飞书限流等）
- **THEN** 接口返回 400 错误，包含具体错误信息
