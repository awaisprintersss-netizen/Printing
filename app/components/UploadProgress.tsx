'use client';

interface UploadProgressProps {
  progress: number;
  message?: string;
}

export const UploadProgress = ({ progress, message }: UploadProgressProps) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="bg-page-secondary rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-light border-t-accent animate-spin mb-4"></div>
          <h3 className="text-lg font-semibold text-primary mb-2">Uploading Image</h3>
          <p className="text-secondary text-center mb-4">
            {message || 'Please wait while we upload your image to Cloudinary...'}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-page-tertiary rounded-full h-2 mb-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-tertiary">{progress}%</p>
        </div>
      </div>
    </div>
  );
};