# Apiex

Apiex 是为了解决后端 controller 层的工作量及前端 Require 层的工作量。

Apiex 使用 graphql 局部语法来约定前后端接口，为后端生成 RESTful API 接口层代码；为前端（typescript、dart）生成请求代码。

Apiex 其实是针对 graphql 的解析，制定了一些默认的代码生成脚本，在开发过程中可以定制调整脚本以满足业务需要。

Apiex 默认支持 Typescript、Golang、Dart 三种语法的类型解析。

默认定制的脚本有：

- (后端) golang + fiber 框架的 controller 层
- (前端) browser + fetch
- (前端) flutter + dart + dio

其他需要可以自行调整解析代码。

## 创建脚本

In backEnd:

```bash
$ npx apiex init go
$ npx apiex
```

In frontEnd:

```bash
$ npx apiex init dart
$ npx apiex
```

or

```bash
$ npx apiex init ts
$ npx apiex
```

## Get started

首先创建一个 Golang 工程

```bash
mkdir server_example
cd server_example
go mod init server_example
```

然后创建 apiex 配置文件:

```bash
npx apiex init go
```

此时项目中创建了三个文件：

- `apiex-config.yaml`： 配置文件
- `apiex-schema.gql`： 接口描述文件
- `apiex-go.js`： 代码编译脚本

我们查看 `apiex-config.yaml`：

```yaml
graphql:
  - apiex-schema.gql # 指定接口描述文件路径
  # - http://localhost:3000/apiex # 亦指定远程文件
go:
  builder: apiex-go.js # 指定代码编译脚本路径
  out: apiex/apiex.go # 指定代码编译结果路径
```

有了这三个配置文件，我们可以执行编译脚本：

```bash
apiex apiex-config.yml
```

此时目录多了一个 go 接口文件： `apiex/apiex.go`, 安装依赖：

```bash
go mod tidy
```

## 编写业务代码

创建 main.go 文件:

```bash
touch main.go
```

我们编写剩余的业务代码：

```go

```
