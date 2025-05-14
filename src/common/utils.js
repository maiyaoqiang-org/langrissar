import {evaluate} from "mathjs";
import Big from "big.js";
import _ from 'lodash'
import * as XLSX from 'xlsx'

// 计算最终结果
export function calculateFormula(formula, variables={},{log=false}={}) {
    if(typeof formula === "number"&&formula){
        return formula
    }
    try {
        // 计算变量的值
        let context = {};
        Object.keys(variables).forEach(key => {
            if(variables[key]){
                try {
                    context[key] = evaluate(variables[key]+""); // 计算变量的值
                } catch (e) {}
            }
        });

        // 对于未定义的变量，默认赋值为 0
        formula.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g)?.forEach(variable => {
            if (!(variable in context)) {
                context[variable] = 0;
            }
        });
        if(log){
            console.log(formula,context,variables)
        }
        // 计算公式结果
        return evaluate(formula, context);
    }
    catch (e){
        return 0
    }
}


export function round(val, dp=0,rm=Big.roundHalfUp){
    if(typeof val !== "number" || isNaN(val)){
        return 0
    }
    try {
        // 用big.js 进行四舍五入
        return new Big(val).round(dp, rm).toNumber()
    }
    catch (e) {
        console.trace(e)
        return 0
    }
}

export function parseCSVToObjects(data) {
    const lines = data.trim().split('\n'); // 按行分割并去掉首尾空行
    const headers = lines[0].split(',').map(i => i.replace("\r", '')); // 第一行作为键

    return lines.slice(1).map(line => {
        // 使用正则表达式来正确处理包含逗号的字段
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(value => value.replace(/^"|"$/g, ''));
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}


/**
 * @method 导出excel 必须有引入xlsx.js和lodash.js
 * @param {object} options
 * @param {Array<any>} options.data 需要导出的数据
 * @param {Array<any>} options.exportOption 导出数据的配置
 * @param {string} options.exportOption.key 后端返回时对应对象的path
 * @param {string} options.exportOption.label 表头的名称
 * @param {function(value:string,item:object)} options.exportOption.handler 如果需要二次处理数据，传入handler 回调函数value是当前值,item是整个对象值
 * @param {string?} options.sheetName  表名默认值""
 * @param {string?} options.bookName   文件名默认值"" 此时会用moment().format('YYYY-MM-DD HH:mm:ss') + '导出'作为文件名
 * @example
 let data=[
 {
 manager_status:"y",
 },
 {
 manager_status:"n",
 },
 ],
 let exportOption = [
 {
 label:"合伙人账号",
 key: "manager_status",
 handler: (value) => {
 return value==='y'?"已入驻":"未入驻"
 },
 }
 ];
 exportExcelFun({
 data: data,
 exportOption: exportOption,
 sheetName: "我是表名",
 bookName: "我是文件名",
 });
 */
export const exportExcelFun = (options) => {
    const {data, exportOption, sheetName = '', bookName = ''} = options
    const table = []
    _.forEach(data, (dataItem, index) => {
        const tableItem = {}
        _.forEach(exportOption, (item) => {
            const key = item.label
            const value = _.property(item.key)(dataItem)
            if (item.handler) {
                tableItem[key] = item.handler(value, dataItem, index)
            } else {
                tableItem[key] = value
            }
        })
        table.push(tableItem)
    })
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(table, {
        header: exportOption.map(item => item.label),
    })
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, `${bookName || (dayjs().format('YYYY-MM-DD HH:mm:ss') + '导出')}.xlsx`)
}

/**
 * importExcelFun({
 file: file,
 importOption: [
 {
 label: '序号',
 key: 'id',
 },
 ],
 sheetName: 'Sheet1',
 })
 .then((data) => {
 console.log(data)
 })
 .catch((err) => {
 this.$message({
 message: err,
 type: 'error',
 })
 })
 * */
/**
 * @method 导入excel 必须有引入xlsx.js和lodash.js
 * @param {object} options
 * @param {file} options.file 需要导入的文件
 * @param {Array<any>} options.importOption 导入数据的配置
 * @param {string} options.importOption.key 后端返回时对应对象的path
 * @param {string} options.importOption.label 表头的名称
 * @param {string?} options.sheetName  需要导出的数据的表名
 */
export const importExcelFun = (options) => {
    return new Promise((resolve, reject) => {
        const {file, importOption, sheetName = 'Sheet1'} = options
        const name = file.name
        const fileName = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
        if (fileName != 'xls' && fileName != 'xlsx') {
            const message = '请上传xls/xlsx格式文件'
            reject(message)
        }

        function readWorkbookFromLocalFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = function (e) {
                    const data = e.target.result
                    const workbook = XLSX.read(data, {type: 'binary'})
                    resolve(workbook)
                }
                reader.readAsBinaryString(file)
            })
        }

        readWorkbookFromLocalFile(file)
            .then((data) => {
                const res = XLSX.utils.sheet_to_json(data.Sheets[sheetName])
                const newRes = []
                _.forEach(res, (dataItem, key) => {
                    const newObj = {}
                    _.forEach(importOption, (item) => {
                        newObj[item.key] = dataItem[item.label]
                    })
                    newRes.push(newObj)
                })
                resolve(newRes)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export function selectExcelFile() {
    return new Promise((resolve, reject) => {
        // 创建一个隐藏的 <input> 元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file'; // 设置为文件选择
        fileInput.accept = '.xlsx, .xls'; // 限制只能选择 Excel 文件

        // 监听文件选择事件
        fileInput.addEventListener('change', function(event) {
            const files = event.target.files; // 获取选中的文件列表
            if (files.length > 0) {
                resolve(files[0]); // 返回选中的文件
            } else {
                reject(new Error('No file selected')); // 未选择文件
            }

            // 移除文件输入框
            document.body.removeChild(fileInput);
        });

        // 将 <input> 添加到页面上（不可见）
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        // 手动触发文件选择对话框
        fileInput.click();
    });
}


// createLatestOnly(asyncFun)该创建函数方法创建一个新异步函数，该函数会跟踪最新的请求，旧的请求都进入catch。
export function createLatestOnly(asyncFunc) {
    let latestRequestId = 0 // 用于追踪最新请求的标识符
    return async function (...args) {
        const requestId = ++latestRequestId // 为当前请求生成唯一的标识符
        try {
            // 调用原始的异步函数并等待结果
            const result = await asyncFunc(...args)
            // 只有当当前请求是最新请求时才返回结果
            if (requestId === latestRequestId) {
                return result
            } else {
                throw new Error("已舍弃请求")
            }
        } catch (error) {
            // 处理可能的错误，但确保忽略已过期的结果
            if (requestId === latestRequestId) {
                throw error
            } else {
                throw new Error("已舍弃请求")
            }
        }
    }
}

// createCachedAsyncFunction(asyncFunc,1000) 创建一个，只要参数一致，在一定时间内不再调用异步函数，直接返回缓存结果
export function createCachedAsyncFunction(asyncFunc, cacheTime = 60000) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);
        const currentTime = Date.now();

        // 检查缓存是否存在且未过期
        if (cache.has(key)) {
            const {result, timestamp} = cache.get(key);
            if (currentTime - timestamp < cacheTime) {
                return result; // 返回缓存结果
            }
        }

        // 创建新的请求
        const requestPromise = asyncFunc(...args).catch(error => {
            // 请求失败时，删除缓存
            cache.delete(key);
            return Promise.reject(error);
        });

        // 缓存结果
        cache.set(key, {result: requestPromise, timestamp: Date.now()});
        return requestPromise; // 直接返回请求 Promise
    };
}
