## ADDED Requirements

### Requirement: 验证码独立校验并返回 uploadToken
系统 SHALL 提供 `POST /issue/verify-captcha` 接口，接收 `captchaId` 和 `captcha` 字段，校验通过后返回一个有效期 10 分钟的 JWT uploadToken，用于后续上传和提交接口的鉴权。

#### Scenario: 验证码正确
- **WHEN** 客户端提交正确的 captchaId 和 captcha
- **THEN** 系统消费该验证码，返回 `{ uploadToken: "<jwt>" }`，HTTP 200

#### Scenario: 验证码错误或过期
- **WHEN** 客户端提交错误或已过期的验证码
- **THEN** 系统返回 HTTP 400，message 为"验证码无效或已过期"

#### Scenario: 缺少字段
- **WHEN** 客户端未提交 captchaId 或 captcha
- **THEN** 系统返回 HTTP 400 参数校验错误
