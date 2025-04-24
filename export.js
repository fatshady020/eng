const $ = new API('DailyEnglishExport', true)
$.debug = true // 启用调试模式

try {
    // 主处理函数
    const handleRequest = async (request) => {
        try {
            const url = new URL(request.url)
            
            // 调试日志
            $.log(`[Debug] 拦截到请求: ${url.toString()}`)
            
            // 仅处理特定域名
            if(!url.hostname.includes('eudic.net') && !url.hostname.includes('tingdaily.com')) {
                return $response
            }
            
            // 你的处理逻辑...
            
            return $response
        } catch (e) {
            $.log(`[Error] 请求处理错误: ${e}`)
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: e.message })
            }
        }
    }

    // 导出函数
    export default {
        fetch: handleRequest,
        onError: (err) => {
            $.log(`[Critical Error] ${err}`)
            return { status: 500 }
        }
    }
} catch (e) {
    $.log(`[Initialization Error] ${e}`)
    throw e
}
