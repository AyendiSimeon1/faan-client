interface LogOptions {
  feature?: string;
  action?: string;
  data?: any;
  error?: any;
}

export const logSuccess = ({ feature, action, data }: LogOptions) => {
  const timestamp = new Date().toISOString();
  const message = `✅ ${feature ? `[${feature}] ` : ''}${action || 'Success'}`;
  
  console.log(
    `%c${timestamp} - ${message}`,
    'color: #10B981; font-weight: bold;',
    (data ? '\nData:' : ''),
    data || ''
  );
};

export const logError = ({ feature, action, error }: LogOptions) => {
  const timestamp = new Date().toISOString();
  const message = `❌ ${feature ? `[${feature}] ` : ''}${action || 'Error'}`;
  const errorMessage = error?.message || error;

  console.error(
    `%c${timestamp} - ${message}`,
    'color: #EF4444; font-weight: bold;',
    '\nError:',
    errorMessage,
    '\nStack:',
    error?.stack || 'No stack trace'
  );
};

export const logInfo = ({ feature, action, data }: LogOptions) => {
  const timestamp = new Date().toISOString();
  const message = `ℹ️ ${feature ? `[${feature}] ` : ''}${action || 'Info'}`;

   console.log(
    `%c${timestamp} - ${message}`,
    'color: #10B981; font-weight: bold;',
    (data ? '\nData:' : ''),
    data || ''
  );
};

export const logWarning = ({ feature, action, data }: LogOptions) => {
  const timestamp = new Date().toISOString();
  const message = `⚠️ ${feature ? `[${feature}] ` : ''}${action || 'Warning'}`;

   console.log(
    `%c${timestamp} - ${message}`,
    'color: #10B981; font-weight: bold;',
    (data ? '\nData:' : ''),
    data || ''
  );
};
