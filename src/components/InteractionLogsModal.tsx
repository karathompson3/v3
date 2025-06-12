
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGovernance } from '../hooks/useGovernance';
import { Clock, User, Tag, FileText, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InteractionLogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InteractionLogsModal = ({ open, onOpenChange }: InteractionLogsModalProps) => {
  const { interactionLogs, userRole, permissions } = useGovernance();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'entry_created': return <FileText className="w-4 h-4" />;
      case 'motif_detected': return <Tag className="w-4 h-4" />;
      case 'reflection_captured': return <User className="w-4 h-4" />;
      case 'system_update': return <Settings className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'entry_created': return 'bg-blue-100 text-blue-800';
      case 'motif_detected': return 'bg-purple-100 text-purple-800';
      case 'reflection_captured': return 'bg-green-100 text-green-800';
      case 'system_update': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (!permissions.canViewLogs) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Restricted</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">You don't have permission to view interaction logs.</p>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Interaction Logs & Audit Trail
            <Badge variant="outline" className="ml-2">{userRole}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="motifs">Motif Detection</TabsTrigger>
            <TabsTrigger value="system">System Events</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-3">
                {interactionLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No interaction logs yet. Start using the system to see your activity trail.
                  </div>
                ) : (
                  interactionLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(log.type)}
                          <Badge className={getTypeColor(log.type)}>
                            {log.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <div className="font-medium text-slate-700">Input:</div>
                        <div className="text-slate-600 bg-slate-50 p-2 rounded text-xs font-mono">
                          {log.input.substring(0, 200)}
                          {log.input.length > 200 && '...'}
                        </div>
                      </div>

                      {log.output && (
                        <div className="text-sm">
                          <div className="font-medium text-slate-700">Output:</div>
                          <div className="text-slate-600 bg-slate-50 p-2 rounded text-xs">
                            {log.output.substring(0, 200)}
                            {log.output.length > 200 && '...'}
                          </div>
                        </div>
                      )}

                      {log.motifTags && log.motifTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {log.motifTags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="motifs">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-3">
                {interactionLogs
                  .filter(log => log.type === 'motif_detected')
                  .map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-100 text-purple-800">Motif Detected</Badge>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {log.motifTags?.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="system">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-3">
                {interactionLogs
                  .filter(log => log.type === 'system_update')
                  .map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-amber-100 text-amber-800">System Update</Badge>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">{log.input}</div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-slate-500">
            Transparency Mode: Full • Audit Trail: Enabled
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
