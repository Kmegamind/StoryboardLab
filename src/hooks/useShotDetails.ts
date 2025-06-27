
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

export const useShotDetails = (shotId: string | undefined, userId: string | undefined) => {
  const [shot, setShot] = useState<Shot | null>(null);
  const [isLoadingShot, setIsLoadingShot] = useState(true);
  const navigate = useNavigate();

  const fetchShotDetails = async () => {
    if (!shotId) return;
    
    setIsLoadingShot(true);
    try {
      const { data, error } = await supabase
        .from('structured_shots')
        .select('*')
        .eq('id', shotId)
        .single();

      if (error) {
        toast({ title: "加载分镜失败", description: error.message, variant: "destructive" });
        navigate('/dashboard');
      } else {
        setShot(data);
      }
    } catch (error) {
      toast({ title: "加载分镜出错", description: "请重试", variant: "destructive" });
      navigate('/dashboard');
    } finally {
      setIsLoadingShot(false);
    }
  };

  useEffect(() => {
    if (shotId && userId) {
      fetchShotDetails();
    }
  }, [shotId, userId]);

  return {
    shot,
    isLoadingShot,
    fetchShotDetails,
  };
};
