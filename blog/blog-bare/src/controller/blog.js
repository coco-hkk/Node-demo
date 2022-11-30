const xss = require('xss')
const { exec, escape } = require('../db/mysql')

const getList = (author, keyword) => {
    // 1=1 防止 author 和 keyword 为空时 sql 语句出错
    // 类似情况 a=1：xxx.html?a=1&k1=v1&k2=v2&k3=v3
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回一个 promise
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id = '${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content 属性
    let { title, content, author } = blogData
    const createTime = Date.now()

    title = xss(title)
    content = xss(content)

    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', ${createTime}, '${author}')
    `

    return exec(sql).then(insertData => {
        //console.log(insertData)
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    // id 要更新的博客
    // blogData 是一个博客对象，包含 title content 属性
    let { title, content } = blogData
    title = escape(title)
    content = escape(content)

    const sql = `
        update blogs set title=${title}, content=${content} where id='${id}'
    `

    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    // id 要删除的博客
    const sql = `
        delete from blogs where id='${id}' and author='${author}'
    `
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}