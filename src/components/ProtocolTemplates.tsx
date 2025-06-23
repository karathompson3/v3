
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Copy, Edit, Trash2, BookOpen, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProtocolTemplate } from '../types/ProtocolTemplate';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates, createCustomTemplate } from '../utils/protocolTemplates';

interface ProtocolTemplatesProps {
  onUseTemplate: (template: string) => void;
  onClose: () => void;
}

export const ProtocolTemplates = ({ onUseTemplate, onClose }: ProtocolTemplatesProps) => {
  const [customTemplates, setCustomTemplates] = useState<ProtocolTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('parental');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProtocolTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    template: '',
    tags: ''
  });
  const { toast } = useToast();

  // Load custom templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('protocol_custom_templates');
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load custom templates:', error);
      }
    }
  }, []);

  // Save custom templates to localStorage
  const saveCustomTemplates = (templates: ProtocolTemplate[]) => {
    localStorage.setItem('protocol_custom_templates', JSON.stringify(templates));
    setCustomTemplates(templates);
  };

  const getCurrentTemplates = () => {
    const categoryTemplates = getTemplatesByCategory(selectedCategory, customTemplates);
    return searchQuery 
      ? searchTemplates(searchQuery, categoryTemplates)
      : categoryTemplates;
  };

  const handleUseTemplate = (template: ProtocolTemplate) => {
    // Increment usage count
    if (template.isCustom) {
      const updated = customTemplates.map(t => 
        t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
      );
      saveCustomTemplates(updated);
    }
    
    onUseTemplate(template.template);
    toast({
      title: "Template applied",
      description: `Using "${template.name}" template`,
    });
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.template.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and template text",
        variant: "destructive"
      });
      return;
    }

    const tags = newTemplate.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const template = createCustomTemplate(
      newTemplate.name,
      newTemplate.description,
      newTemplate.template,
      tags
    );

    const updated = [...customTemplates, template];
    saveCustomTemplates(updated);
    
    setNewTemplate({ name: '', description: '', template: '', tags: '' });
    setShowCreateDialog(false);
    setSelectedCategory('custom');
    
    toast({
      title: "Template created",
      description: `"${template.name}" has been added to your custom templates`,
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updated = customTemplates.filter(t => t.id !== templateId);
    saveCustomTemplates(updated);
    
    toast({
      title: "Template deleted",
      description: "Custom template has been removed",
    });
  };

  const handleCopyTemplate = async (template: string) => {
    try {
      await navigator.clipboard.writeText(template);
      toast({
        title: "Copied to clipboard",
        description: "Template text copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
              🔮 Protocol Template Library
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Custom Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Template text - the actual message that will be used"
                    value={newTemplate.template}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, template: e.target.value }))}
                    className="min-h-[100px]"
                  />
                  <Input
                    placeholder="Tags (comma-separated, optional)"
                    value={newTemplate.tags}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      Create Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full overflow-hidden">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-6 w-full">
              {TEMPLATE_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {TEMPLATE_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{category.name} Templates</h3>
                  <p className="text-sm text-slate-600">{category.description}</p>
                </div>
                
                <div className="grid gap-4">
                  {getCurrentTemplates().map((template) => (
                    <Card key={template.id} className="border-l-4 border-l-blue-400 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-slate-800">{template.name}</h4>
                            {template.description && (
                              <p className="text-sm text-slate-600">{template.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {template.usageCount > 0 && (
                              <Badge variant="outline" className="text-xs">
                                Used {template.usageCount}x
                              </Badge>
                            )}
                            {template.isCustom && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                Custom
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 p-3 rounded border mb-3">
                          <p className="text-sm text-slate-700 italic">"{template.template}"</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {template.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyTemplate(template.template)}
                              className="flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUseTemplate(template)}
                              className="flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3" />
                              Use This
                            </Button>
                            {template.isCustom && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getCurrentTemplates().length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      {searchQuery ? 'No templates match your search.' : 'No templates in this category yet.'}
                      {selectedCategory === 'custom' && !searchQuery && (
                        <p className="mt-2">Create your first custom template using the button above!</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
