# 北大软设答案（网站部分）

## 首页

见 [docs/README.md](./docs/README.md)。

## 其它数据

在私有仓库 `pku-software/homework-answer-data`。

由于读取私有仓库使用了 Guyutongxue 的 PAT，而 PAT 只有一年有效期。所以每年三月都需要手动延长。如果 Guyutongxue 失踪了无法延长，那么请手动生成 PAT，把它设置到本仓库的 `DATA_REPO_PAT` 秘密中。

如果 Guyutongxue 手欠修改了他的 OJ 密码，那么请当期助教把自己的用户名密码设置到本仓库的 `OPENJUDGE_USERNAME` 与 `OPENJUDGE_PASSWORD` 秘密中。

## 本地开发

- 新建 `.env` 文件写入 `OPENJUDGE_USERNAME` 与 `OPENJUDGE_PASSWORD`。
- 新建 `data` 目录符号链接到 `pku-software/homework-answer-data`。
- 运行 `pnpm build:data` 准备数据。
- 运行 `pnpm dev` 热预览。
