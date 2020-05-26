# webpack 学习

## 安装

```js
npm install webpack webpack-cli --save-dev
```

## 最简单的例子

- 在根目录下新建`webpack.config.js`文件

```js
'use strict';
module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	mode: 'production',
};
```

- 在`src`下新建`index.js`和`helloworld.js`

index.js

```js
import { helloWorld } from './helloworld';
document.write(helloWorld());
```

helloworld.js

```js
export function helloWorld() {
	return 'hello world';
}
```

- 运行脚本 `./node_modules/.bin/webpack`
  运行完后在项目的根目录下会新建一个 dist 文件，文件名为 bundle.js 的文件。

- 手动在 dist 文件夹下新建一个 index.html,将 bundle.js 引进来。

## 通过 npm script 运行 webpack

刚才是手动通过运行 node_modules 下的 webpack 进行运行。其实可以在 package.json 中通过 npm run build 来运行。它的远离是：模块局部安装会在 node_modules/.bin 目录创建一个软链接。

```js
{
  "name": "webpack-project",
  "version": "1.0.0",
  "description": "## 基础用法",
  "main": "index.js",
  "scripts": {
    "build": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11"
  }
}
```

## 基础用法

### entry

对于非代码比如图片、字体依赖也会不断加入到依赖图中

单入口：entry 是一个字符串

```js
module.exports = {
	entry: './path/to/my/entry/file.js',
};
```

多入口：entry 是一个对象

```js
module.exports = {
	entry: {
		app: './src/app.js',
		search: './src/search.js',
	},
};
```

### output

用来告诉 webpack 如何将编译后的文件输出到磁盘

单入口配置

```js
module.exports = {
	entry: './path/to/my/entry/file.js',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/dist',
	},
};
```

多入口配置: 通过占位符确保文件名称的唯一

```js
module.exports = {
	entry: {
		app: './src/app.js',
		search: './src/search.js',
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/dist',
	},
};
```

### loaders

webpack 开箱即用只支持 JS 和 JSON 两种文件类型，通过 Loaders 去支持其他文件类型并且把他们转换成有效的模块，并且可以添加到依赖中。

本身是一个函数，接受源文件作为参数，返回转换结果。

常用的 loaders:

- babel-loader: 转换 ES6、ES7 等 JS 新特性语法。

- css-loader

- less-loader

- ts-loader

- file-loader: 进行图片、字体等打包

- raw-loader: 将文件以字符串的形式导入

- thread-loader: 多进程打包 JS 和 CSS

用法：在 module 下有个 rules,rules 是一个数组，将要使用的 loaders 放在 rules 中。数组的每一项是一个对象，对象中 test 指定匹配规则， use 指定使用的 loader 名称

```js
'use strict';

const path = require('path');

module.exports = {
	entry: {
		index: './src/index.js',
		search: './src/search.js',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.txt$/,
				use: 'raw-loader',
			},
		],
	},
	mode: 'production',
};
```

### plugins

插件用于 bundle 文件的优化，资源管理和环境变量的注入

作用于整个构建过程

用法：直接放在 plugins 中

```js
'use strict';

const path = require('path');

module.exports = {
	entry: {
		index: './src/index.js',
		search: './src/search.js',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.txt$/,
				use: 'raw-loader',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	],
	mode: 'production',
};
```

### mode

mode 用来指定当前的构建环境是：production、development 还是 none

设置 mode 可以使用 webpack 内置的函数，默认值为 production

### 解析 ES6 和 react

- 解析 ES6

需安装 @babel/core @babel/preset-env babel-loader

```js
npm i @babel/core @babel/preset-env babel-loader -D
```

在项目的根目录下新建 .babelrc 文件

```js
{
  "presets": [
    "@babel/preset-env",
  ]
}
```

在 webpack.config.js 文件中使用 babel-loader

```js
'use strict';

const path = require('path');

module.exports = {
	entry: {
		index: './src/index.js',
		search: './src/search.js',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
			},
		],
	},
	mode: 'production',
};
```

- 解析 react

安装 @babel/preset-react

```js
npm i @babel/preset-react react react-dom -D
```

在.babelrc 文件的 presets 中添加@babel/preset-react

```js
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

### 解析 CSS、LESS 和 SASS

- 解析 css
  css-loader 用于加载.css 文件，并且转换为 commonjs 对象
  style-loader 将样式通过`<style>`标签插入到 `head` 中

```js
module: {
	rules: [
		{
			test: /\.js$/,
			use: 'babel-loader',
		},
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader'],
		},
		{
			test: /\.less$/,
			use: ['style-loader', 'css-loader', 'less-loader'],
		},
	],
},
```

- 解析 less

注意： 多个 loader，解析时从右到左

### 解析图片和字体

file-loader 用于处理图片和字体

url-loader 也可以处理图片和字体 可以设置较小资源自动 base64。
limit 可以限制大小，在大小小于 limit 限制的大小可以自动 base64

```js
{
	test: /\.(jpg|png|jpeg|gif)$/,
	use: [
		{
			loader: 'url-loader',
			options: {
				limit: 20480,
			},
		},
	],
},
```

### webpack 文件监听

webpack 设置文件监听有两种方式：

- 启动 webpack 命令时，带上 --watch 参数
- 在 webpack.config.js 中设置 watch：true

文件监听原理分析：
轮询判断文件的最后编辑时间是否变化
某个文件发生了变化，不会立刻告诉监听着，而是先缓存起来，等 aggregateTimeout

```js
module.exports = {
	// 默认false，也是不开启
	watch: true,
	// 只有开启文件监听模式时，watchOptions才有意义
	watchOptions: {
		// 默认为空，不监听的文件或者文件夹，支持正则匹配
		ignored: /node_modules/,
		// 监听到发生变化后会再等300ms再去执行，默认300ms
		aggregateTimeout: 300,
		// 判断文件是否发生变化时通过不停地询问系统指定文件有没有变化实现的，默认每秒访问1000次
		poll: 1000,
	},
};
```

### webpack 中的热更新及原理分析

热更新：webpack-dev-server
wds 不刷新浏览器
wds 不输出到文件，而是放在内存中
使用 HotModuleReplacementPlugin 插件

### 文件指纹策略：chunkhash、contenthash 和 hash

hash: 和整个项目有关，只要项目文件有修改，整个项目构建的 hash 就会更改
chunkhash: 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值
contenthash: 根据文件的内容来定义 hash，文件内容不变，则 contenthash 不变

```js
'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: {
		index: './src/index.js',
		search: './src/search.js',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name]_[chunkhash:8].js',
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.less$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
			},
			{
				test: /\.(jpg|png|jpeg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]_[hash:8].[ext]',
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]_[hash:8].[ext]',
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name]_[contenthash:8].css',
		}),
	],
};
```
