
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ApiKeyTestResult } from '@/utils/apiKeyTester';

interface TestResultDisplayProps {
  testResult: ApiKeyTestResult;
}

export const TestResultDisplay: React.FC<TestResultDisplayProps> = ({ testResult }) => {
  return (
    <div className="mt-3">
      <Alert variant={testResult.success ? "default" : "destructive"}>
        {testResult.success ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle>
          {testResult.success ? "测试成功" : "测试失败"}
        </AlertTitle>
        <AlertDescription>
          <div className="space-y-1">
            <p>{testResult.message}</p>
            {testResult.details && (
              <p className="text-xs opacity-75">{testResult.details}</p>
            )}
            <p className="text-xs opacity-50">
              测试时间: {testResult.timestamp?.toLocaleString()}
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
