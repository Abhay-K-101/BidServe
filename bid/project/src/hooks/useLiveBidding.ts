import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Task, Bid } from '../types';
import { useBidStore } from '../store/bidStore';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const useLiveBidding = (task: Task) => {
  const { addBid, updateTask } = useBidStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`task-${task.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `task_id=eq.${task.id}`,
        },
        (payload) => {
          const newBid = payload.new as Bid;
          addBid(newBid);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tasks',
          filter: `id=eq.${task.id}`,
        },
        (payload) => {
          const updatedTask = payload.new as Task;
          updateTask(task.id, updatedTask);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [task.id]);

  // Check for task expiration
  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date();
      const expiresAt = new Date(task.expiresAt);

      if (task.status === 'open' && expiresAt <= now) {
        updateTask(task.id, { status: 'expired' });
      }
    };

    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [task]);

  const placeBid = async (amount: number, message: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: bidError } = await supabase
        .from('bids')
        .insert([
          {
            task_id: task.id,
            amount,
            message,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (bidError) throw bidError;

      // Update task with new current bid
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          current_bid: {
            amount,
            bidder_id: data.bidder_id,
          },
        })
        .eq('id', task.id);

      if (taskError) throw taskError;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bid');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    placeBid,
    isLoading,
    error,
  };
};