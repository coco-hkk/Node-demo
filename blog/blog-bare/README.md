- [blog-bare](#blog-bare)
- [MySQL](#mysql)
- [redis](#redis)
- [Nginx](#nginx)
- [http-server](#http-server)
- [nodemon](#nodemon)
- [xss](#xss)

# blog-bare
不适用框架开发，使用 node 底层 API 实现简单博客 server 系统。

环境：
- win10
- nodejs v18.12.1
- MySQL 8.0.31
- redis 5.0.14.1
- Nginx 1.22.1

# MySQL
硬盘数据库，数据存储在硬盘中。
- MySQL [官网](https://www.mysql.com/)
- MySQL Community [下载页](https://dev.mysql.com/downloads/)
- MySQL Community Server [下载](https://dev.mysql.com/downloads/mysql/)，选择 `Windows (x86, 64-bit), ZIP Archive`
- MySQL Workbench [下载](https://dev.mysql.com/downloads/workbench/)，图形界面操作 MySQL

Workbench 直接安装即可，MySQL 是 ZIP 压缩文件，需要解压后配置才能使用。
1. 解压 MySQL 压缩文件到合适位置，如 `D:\MySQL`
2. 配置环境变量，添加 `D:\MySQL\bin`
3. 在 MySQL 根目录 `D:\MySQL` 配置初始化 `my.ini` 文件，此文件不存在需要创建。
    ```ini
    [mysqld]
    # 设置 mysql 的安装目录
    basedir=D:\MySQL\
    # 设置 MySQL 数据库的数据的存放目录
    datadir=D:\MySQL\data\
    ```
    此配置中指定的 data 目录无需创建，下一步初始化工作会自动创建。
4. 初始化数据库，在 bin 目录中执行 `mysqld --initialize -- console`，执行完成后会打印 root 用户的初始默认密码。
    若没记住刚刚的密码，直接删除 datadir 目录重新初始化即可。
5. 安装服务，在 bin 目录中执行 `mysqld --install`，安装完成后启动服务 `net start mysql`，停止服务 `net stop mysql`。
    卸载服务 `sc delete MySQL/mysqld -remove`.
6. 更改密码，在 bin 目录中执行 `mysql -u root -p` 输入初始默认密码即可登陆成功，
    ```sql
    -- 修改密码
    alter uesr 'root'@'localhost' identified with mysql_native_password by '新密码';
    ```

使用 Workbench 连接 MySQL 服务，：
```sql
-- 查看版本
select version();
-- 查看数据库
show databases;
-- 选择数据库
use myblog;
-- 查看数据库中的表
show tables;
-- 增，向表中增加数据，mysql 关键字需要用单引号 ` 包围
insert into users (username, `password`, realname) values ('lisi', '123', '李四');
-- 删，删除数据，一般不会直接使用此语句删除数据
delete from users where username='lisi';
update users set state='0' where username='lisi'    -- 软删除所有 username='lisi'，通过设置 state 项而非直接删除
select * from users where state <> '0'  -- 查看所有非软删除的数据， <> 不等于
-- 查
select * from users;    -- 查看 users 表所有数据
select * from users where username='zhangsan';   -- 查看 users 表中所有 username='zhangsan' 的数据
select * from users where username='zhangsan' and `password`='123';  -- 查看 users 表中所有用户名和密码为 'zhangsan' 和 '123' 的数据
select * from users where username='zhangsan' or `password`='123';  -- 查看 users 表中所有用户名为 'zhangsan' 或密码为 '123' 的数据
select * from users where username like '%zhang%';   -- 查看 users 表中所有用户名中匹配 zhang 的数据
select * from users where `password` like '%1%' order by id desc;   -- 查看 users 表中所有密码中包含 1 的数据，并以倒序的方式排列
-- 改、更新
update users set realname='zhangsan' where username='lisi'  -- 将 users 表中所有 username='lisi' 的项中 realname 改为 zhangsan
```

# redis
缓存数据库，速度快，性能好，也可保存在硬盘中。
- redis [官网](https://redis.io/)
- redis [下载页](https://redis.io/download/)

将下载的 ZIP 文件解压到 `D:\redis`.
1. 配置环境变量 `D:\redis`
2. 在终端中运行 `redis-server`，窗口会显示服务相关信息。
3. 保持服务终端不要关闭，打开新的终端执行 `redis-cli -h 127.0.0.1 -p 6379` 即可连接 redis.

- `keys *` 查看所有键值对
- `set k1 v1` 增改键值对
- `get k1` 获取 key 对应的 value
- `del k1` 删除 key 所在的键值对

# Nginx
用于反向代理。
- nginx [官网](http://nginx.org/)
- nginx [下载页](http://nginx.org/en/download.html)

将下载的 ZIP 文件解压到 `D:\nginx`.

修改配置文件 `conf/nginx.conf`
```conf
# 设置 nginx 工作进程和 CPU 核数相同
worker_processes  12;

server {
# 监听端口号 8080
    listen       8080;

    # 反向代理前端
    location / {
        proxy_pass http://localhost:8001;
    }

    # 反向代理 web server
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }
}
```

直接双击 `nginx.exe` 启动，或将 nginx 安装目录添加到环境变量中执行 `start nginx` 启动。
若修改配置文件后，执行 `nginx -s reload` 重启服务。

在 win10 若想在局域网内访问 nginx，要么关闭防火墙，要么配置防火墙的入站规则，找到 nginx 项允许开放端口即可。

# http-server
http-server 是一个超轻量级 web 服务器，它可以将任何一个文件夹当作服务器的目录供自己使用。

需要 npm 安装 `npm install http-server -g`.

在想作为服务器的目录中打开终端，输入 `http-server -p 8001` 启动。成功后，可通过 `http://localhost:port` 访问。

# nodemon
检测到服务相关文件更改时自动重新启动 node 应用程序。

需要 npm 安装 `npm install nodemon -g`.

- 自动重新启动应用程序。
- 检测要监视的默认文件扩展名。
- 默认支持 node，但易于运行任何可执行文件，如 python、ruby、make 等。
- 忽略特定的文件或目录。
- 监视特定目录。

本地安装需要在 package.json 文件的 script 脚本中指定要需要执行的命令：
```json
{
    "script": {
        "dev": 'nodemon app.js'
    }
}
```
然后运行 `npm run dev`

# xss
预防 XSS 攻击。

安裝 `npm install xss`.