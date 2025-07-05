export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'film' | 'series' | 'documentary' | 'commercial' | 'short';
  icon: string;
  plot?: string;
  screenwriter_output?: string;
  assets?: Array<{
    asset_type: 'character' | 'prop' | 'location';
    asset_name: string;
    description: string;
  }>;
  shots?: Array<{
    shot_number: string;
    scene_content: string;
    shot_type?: string;
    camera_movement?: string;
    estimated_duration?: string;
  }>;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: '空白项目',
    description: '从零开始创建您的项目',
    category: 'film',
    icon: 'FileText',
  },
  {
    id: 'short-film',
    name: '短片项目',
    description: '适合5-15分钟的短片创作',
    category: 'short',
    icon: 'Film',
    plot: '一个关于追求梦想的温暖故事。主人公面临选择，最终通过勇气和坚持找到了属于自己的道路。',
    assets: [
      {
        asset_type: 'character',
        asset_name: '主人公',
        description: '年轻有梦想的主角，面临人生重要选择'
      },
      {
        asset_type: 'location',
        asset_name: '咖啡厅',
        description: '温馨的咖啡厅，故事的主要发生地'
      }
    ],
    shots: [
      {
        shot_number: '001',
        scene_content: '咖啡厅内，主人公独自坐在窗边思考',
        shot_type: '中景',
        camera_movement: '静止',
        estimated_duration: '5秒'
      }
    ]
  },
  {
    id: 'commercial',
    name: '商业广告',
    description: '产品宣传和品牌推广视频',
    category: 'commercial',
    icon: 'Megaphone',
    plot: '通过情感故事展现产品价值，让观众产生共鸣并记住品牌。',
    assets: [
      {
        asset_type: 'prop',
        asset_name: '产品',
        description: '需要推广的核心产品'
      },
      {
        asset_type: 'character',
        asset_name: '代言人',
        description: '产品使用者或品牌代言人'
      }
    ]
  },
  {
    id: 'documentary',
    name: '纪录片',
    description: '真实记录和深度探索主题',
    category: 'documentary',
    icon: 'Camera',
    plot: '深入探讨一个有意义的主题，通过真实的人物和事件展现深层思考。',
    assets: [
      {
        asset_type: 'character',
        asset_name: '被访者',
        description: '纪录片的主要采访对象'
      },
      {
        asset_type: 'location',
        asset_name: '拍摄场地',
        description: '与主题相关的真实场所'
      }
    ]
  },
  {
    id: 'series-pilot',
    name: '剧集试播集',
    description: '电视剧或网剧的第一集',
    category: 'series',
    icon: 'Tv',
    plot: '介绍主要角色和世界观，设置悬念和冲突，为后续剧集奠定基础。',
    assets: [
      {
        asset_type: 'character',
        asset_name: '男主角',
        description: '剧集的核心角色之一'
      },
      {
        asset_type: 'character',
        asset_name: '女主角',
        description: '剧集的核心角色之一'
      },
      {
        asset_type: 'location',
        asset_name: '主要场景',
        description: '剧集中经常出现的重要场所'
      }
    ]
  }
];