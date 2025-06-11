
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Mic, Square, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaCaptureProps {
  onMediaCapture: (media: { type: 'photo' | 'voice'; url: string; duration?: number; caption?: string }) => void;
  onClose: () => void;
}

export const MediaCapture = ({ onMediaCapture, onClose }: MediaCaptureProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<{ type: 'photo' | 'voice'; url: string; duration?: number } | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ type: 'voice', url, duration: recordingTime });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record voice notes.",
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setCapturedMedia({ type: 'photo', url });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
    }
  };

  const confirmCapture = () => {
    if (capturedMedia) {
      onMediaCapture({
        ...capturedMedia,
        caption: capturedMedia.type === 'photo' ? photoCaption : undefined
      });
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (capturedMedia) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 space-y-4">
          {capturedMedia.type === 'photo' ? (
            <div className="space-y-3">
              <img 
                src={capturedMedia.url} 
                alt="Captured" 
                className="w-full max-h-64 object-cover rounded-lg"
              />
              <input
                type="text"
                placeholder="Add a caption (optional)..."
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
                <Mic className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-slate-700">Voice note recorded</p>
              <p className="text-sm text-slate-500">Duration: {formatTime(capturedMedia.duration || 0)}</p>
              <audio controls src={capturedMedia.url} className="w-full" />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={confirmCapture} className="flex-1">
              Add to Entry
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setCapturedMedia(null);
                setPhotoCaption('');
              }}
            >
              Retake
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="font-semibold text-slate-800 mb-2">Add Media</h3>
          <p className="text-sm text-slate-600">Capture a moment or feeling</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 h-20"
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">Photo</span>
          </Button>

          <Button
            variant="outline"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            className={`flex flex-col items-center gap-2 h-20 ${isRecording ? 'bg-red-50 border-red-200' : ''}`}
          >
            {isRecording ? (
              <>
                <Square className="w-6 h-6 text-red-600" />
                <span className="text-sm text-red-600">{formatTime(recordingTime)}</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                <span className="text-sm">Voice</span>
              </>
            )}
          </Button>
        </div>

        <Button variant="outline" onClick={onClose} className="w-full">
          Cancel
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
