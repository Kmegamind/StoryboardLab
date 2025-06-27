
import { toast } from "@/hooks/use-toast";

export interface ApiKeyTestResult {
  success: boolean;
  message: string;
  details?: string;
  timestamp: Date;
}

export const testDeepSeekApiKey = async (apiKey: string): Promise<ApiKeyTestResult> => {
  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      message: "API密钥不能为空",
      timestamp: new Date(),
    };
  }

  // 验证API密钥格式
  if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
    return {
      success: false,
      message: "API密钥格式不正确，应以'sk-'开头",
      timestamp: new Date(),
    };
  }

  try {
    // 发送一个简单的测试请求
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        max_tokens: 10,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      
      if (response.status === 401) {
        return {
          success: false,
          message: "API密钥无效或已过期",
          details: "请检查您的API密钥是否正确",
          timestamp: new Date(),
        };
      } else if (response.status === 429) {
        return {
          success: false,
          message: "API调用频率超限",
          details: "请稍后再试",
          timestamp: new Date(),
        };
      } else if (response.status === 500) {
        return {
          success: false,
          message: "DeepSeek服务器错误",
          details: "请稍后再试",
          timestamp: new Date(),
        };
      } else {
        return {
          success: false,
          message: `API调用失败 (${response.status})`,
          details: errorData.substring(0, 100),
          timestamp: new Date(),
        };
      }
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return {
        success: true,
        message: "API密钥测试成功",
        details: "可以正常使用DeepSeek API",
        timestamp: new Date(),
      };
    } else {
      return {
        success: false,
        message: "API响应异常",
        details: "未收到有效响应",
        timestamp: new Date(),
      };
    }
  } catch (error) {
    console.error('API Key test error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: "网络连接错误",
        details: "请检查网络连接或稍后重试",
        timestamp: new Date(),
      };
    }
    
    return {
      success: false,
      message: "测试过程中发生错误",
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
    };
  }
};

export const formatApiKeyForDisplay = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 8) return '****';
  return `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`;
};
