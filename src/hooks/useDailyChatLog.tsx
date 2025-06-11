
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reflectionCaptured?: boolean;
}

interface DailyChatLog {
  id: string;
  date: string;
  title?: string;
  messages: ChatMessage[];
}

export const useDailyChatLog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentLog, setCurrentLog] = useState<DailyChatLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const today = new Date().toISOString().split('T')[0];

  // Get or create today's chat log
  const getTodaysLog = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // First, try to get today's log
      const { data: existingLog, error: fetchError } = await supabase
        .from('daily_chat_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      let logId;
      
      if (fetchError && fetchError.code === 'PGRST116') {
        // No log exists for today, create one
        const { data: newLog, error: createError } = await supabase
          .from('daily_chat_logs')
          .insert({
            user_id: user.id,
            date: today,
            title: `Chat - ${new Date().toLocaleDateString()}`
          })
          .select()
          .single();

        if (createError) throw createError;
        logId = newLog.id;
      } else if (fetchError) {
        throw fetchError;
      } else {
        logId = existingLog.id;
      }

      // Get messages for this log
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('daily_log_id', logId)
        .order('timestamp', { ascending: true });

      if (messagesError) throw messagesError;

      setCurrentLog({
        id: logId,
        date: today,
        title: existingLog?.title || `Chat - ${new Date().toLocaleDateString()}`,
        messages: messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          reflectionCaptured: msg.reflection_captured || false
        }))
      });

    } catch (error) {
      console.error('Error getting today\'s chat log:', error);
      toast({
        title: "Error loading chat",
        description: "Could not load today's chat history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load available chat dates
  const loadAvailableDates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_chat_logs')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setAvailableDates(data.map(log => log.date));
    } catch (error) {
      console.error('Error loading available dates:', error);
    }
  };

  // Add a message to the current log
  const addMessage = async (role: 'user' | 'assistant', content: string, reflectionCaptured = false) => {
    if (!currentLog) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          daily_log_id: currentLog.id,
          role,
          content,
          reflection_captured: reflectionCaptured
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage: ChatMessage = {
        id: data.id,
        role,
        content,
        timestamp: new Date(data.timestamp),
        reflectionCaptured
      };

      setCurrentLog(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage]
      } : null);

      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      toast({
        title: "Error saving message",
        description: "Could not save your message",
        variant: "destructive"
      });
      return null;
    }
  };

  // Load a specific date's chat log
  const loadChatLog = async (date: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: log, error: logError } = await supabase
        .from('daily_chat_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .single();

      if (logError) throw logError;

      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('daily_log_id', log.id)
        .order('timestamp', { ascending: true });

      if (messagesError) throw messagesError;

      setCurrentLog({
        id: log.id,
        date: log.date,
        title: log.title || `Chat - ${new Date(log.date).toLocaleDateString()}`,
        messages: messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          reflectionCaptured: msg.reflection_captured || false
        }))
      });

    } catch (error) {
      console.error('Error loading chat log:', error);
      toast({
        title: "Error loading chat",
        description: "Could not load chat for selected date",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a chat log
  const deleteChatLog = async (date: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('daily_chat_logs')
        .delete()
        .eq('user_id', user.id)
        .eq('date', date);

      if (error) throw error;

      await loadAvailableDates();
      
      if (date === today) {
        await getTodaysLog();
      } else if (currentLog?.date === date) {
        await getTodaysLog();
      }

      toast({
        title: "Chat deleted",
        description: "Chat log has been deleted successfully"
      });

      return true;
    } catch (error) {
      console.error('Error deleting chat log:', error);
      toast({
        title: "Error deleting chat",
        description: "Could not delete the chat log",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      getTodaysLog();
      loadAvailableDates();
    }
  }, [user]);

  return {
    currentLog,
    loading,
    availableDates,
    addMessage,
    loadChatLog,
    deleteChatLog,
    getTodaysLog
  };
};
