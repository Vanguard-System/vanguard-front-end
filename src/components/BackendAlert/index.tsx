import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import type { FC } from 'react';

interface BackendAlertProps {
  status: 'success' | 'error'; 
  message: string;
}

const BackendAlert: FC<BackendAlertProps> = ({ status, message }) => {
  return (
    <Alert
      className={`${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
    >
      <div className="flex items-start gap-2">
        {status === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
        )}
        <div className="flex-1">
          <AlertTitle className="font-semibold">{status === 'success' ? 'Sucesso' : 'Erro'}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default BackendAlert;
