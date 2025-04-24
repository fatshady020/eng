const $ = new API('DailyEnglishExport', true)
const cache = $.cache
const exportBaseUrl = "http://127.0.0.1:6166" // Surge本地API地址

// 存储当前检测到的媒体资源
let currentMedia = {
  audio: null,
  subtitle: null
}

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 检测音频资源
  if (/\.(mp3|aac|m4a|wav)$/.test(url.pathname)) {
    const audioId = url.pathname.split('/').pop()
    currentMedia.audio = {
      id: audioId,
      url: request.url,
      title: getMediaTitle(request) || `audio_${Date.now()}`
    }
  }
  
  // 检测字幕资源
  if (/\.(srt|vtt|ass|txt)$/.test(url.pathname)) {
    const subtitleId = url.pathname.split('/').pop()
    currentMedia.subtitle = {
      id: subtitleId,
      url: request.url,
      title: getMediaTitle(request) || `subtitle_${Date.now()}`
    }
  }
  
  return $response
}

// 导出API
$.router.get('/export/audio', async (req) => {
  if (!currentMedia.audio) {
    return { status: 404, body: "No audio detected" }
  }
  
  const audio = await getMediaContent(currentMedia.audio.url)
  return {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${currentMedia.audio.title}.mp3"`
    },
    body: audio
  }
})

$.router.get('/export/subtitle', async (req) => {
  if (!currentMedia.subtitle) {
    return { status: 404, body: "No subtitle detected" }
  }
  
  const subtitle = await getMediaContent(currentMedia.subtitle.url)
  return {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${currentMedia.subtitle.title}.srt"`
    },
    body: subtitle
  }
})

$.router.get('/export/panel', (req) => {
  return {
    status: 200,
    body: `
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, sans-serif; padding: 20px; }
          .btn { 
            display: block; width: 100%; padding: 15px; margin: 10px 0;
            background: #007AFF; color: white; text-align: center;
            border-radius: 10px; text-decoration: none; font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h2>Export Panel</h2>
        ${currentMedia.audio ? 
          `<a href="${exportBaseUrl}/export/audio" class="btn">Export Audio</a>` : 
          '<p>No audio detected</p>'}
        ${currentMedia.subtitle ? 
          `<a href="${exportBaseUrl}/export/subtitle" class="btn">Export Subtitle</a>` : 
          '<p>No subtitle detected</p>'}
      </body>
      </html>
    `
  }
})

// 辅助函数
async function getMediaContent(url) {
  return await $.http.get({ url }).then(resp => resp.body)
}

function getMediaTitle(request) {
  // 从请求头或URL中提取标题
  return request.headers['X-Title'] || 
         new URL(request.url).searchParams.get('title') || 
         null
}

export default {
  fetch: handleRequest
}


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
