export interface SendMailConfig {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, any>;
  from?: string;
}
