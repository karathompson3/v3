
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, MessageCircle, ChevronLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ChatHistoryProps {
  availableDates: string[];
  currentDate: string;
  onDateSelect: (date: string) => void;
  onDeleteDate: (date: string) => void;
  onClose: () => void;
}

export const ChatHistory = ({ 
  availableDates, 
  currentDate, 
  onDateSelect, 
  onDeleteDate, 
  onClose 
}: ChatHistoryProps) => {
  const [deleteDate, setDeleteDate] = useState<string | null>(null);

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (dateString === today) return 'Today';
    if (dateString === yesterday) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const handleDelete = async (date: string) => {
    await onDeleteDate(date);
    setDeleteDate(null);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Chat History</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {availableDates.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No chat history yet</p>
            <p className="text-sm">Start chatting to build your history!</p>
          </div>
        ) : (
          availableDates.map((date) => (
            <div
              key={date}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                date === currentDate
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <button
                onClick={() => onDateSelect(date)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatDateDisplay(date)}</span>
                  {date === currentDate && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">{date}</p>
              </button>
              
              <AlertDialog open={deleteDate === date} onOpenChange={(open) => !open && setDeleteDate(null)}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteDate(date)}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Chat Log</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the chat log for {formatDateDisplay(date)}? 
                      This action cannot be undone and all messages from that day will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(date)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
