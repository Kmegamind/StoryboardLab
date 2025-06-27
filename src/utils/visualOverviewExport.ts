
import { toast } from '@/hooks/use-toast';
import { ShotWithPrompts } from '@/types/visualOverview';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const exportToPDF = (selectedShots: string[], shots: ShotWithPrompts[]) => {
  if (selectedShots.length === 0) {
    toast({ title: '请选择要导出的分镜', variant: 'destructive' });
    return;
  }

  const doc = new jsPDF();
  const selectedShotsData = shots.filter(shot => selectedShots.includes(shot.id));

  doc.setFontSize(16);
  doc.text('分镜视觉总览', 20, 20);

  let yPosition = 40;
  selectedShotsData.forEach((shot, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.text(`镜头 ${shot.shot_number || index + 1}`, 20, yPosition);
    doc.setFontSize(10);
    doc.text(`类型: ${shot.shot_type || 'N/A'}`, 20, yPosition + 10);
    doc.text(`内容: ${shot.scene_content?.substring(0, 100) || 'N/A'}...`, 20, yPosition + 20);
    
    if (shot.latest_prompt?.prompt_text) {
      doc.text(`提示词: ${shot.latest_prompt.prompt_text.substring(0, 100)}...`, 20, yPosition + 30);
    }

    yPosition += 50;
  });

  doc.save(`分镜总览_${new Date().toISOString().split('T')[0]}.pdf`);
  toast({ title: 'PDF 导出成功' });
};

export const exportToExcel = (selectedShots: string[], shots: ShotWithPrompts[]) => {
  if (selectedShots.length === 0) {
    toast({ title: '请选择要导出的分镜', variant: 'destructive' });
    return;
  }

  const selectedShotsData = shots.filter(shot => selectedShots.includes(shot.id));
  const worksheetData = selectedShotsData.map(shot => ({
    '镜头号': shot.shot_number || '',
    '镜头类型': shot.shot_type || '',
    '场景内容': shot.scene_content || '',
    '对话': shot.dialogue || '',
    '预估时长': shot.estimated_duration || '',
    '运镜方式': shot.camera_movement || '',
    '视觉风格': shot.visual_style || '',
    '关键道具': shot.key_props || '',
    '导演备注': shot.director_notes || '',
    '最新提示词': shot.latest_prompt?.prompt_text || '',
    '是否最终版': shot.final_prompt ? '是' : '否',
    '创建时间': new Date(shot.created_at).toLocaleDateString('zh-CN'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '分镜总览');
  XLSX.writeFile(workbook, `分镜总览_${new Date().toISOString().split('T')[0]}.xlsx`);
  
  toast({ title: 'Excel 导出成功' });
};
