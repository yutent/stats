## github-stats
> 一个显示gayhub状态的小工具。


### 示例 

```md
![top-langs](https://stats.wkit.fun/api/toplangs?username=${用户名}&count=${要显示的语言数量})
```

![demo](./preview/demo.png)


### 接口

暂时只有一个"显示使用最多的语言"接口

#### /api/toplangs

1. username   - 用户名
2. count   - 要显示的语言数量, 最低2条, 最多16条