// Auth 関連の型定義
export interface AuthUser {
  id: string;                 // Cognito User ID (sub)
  email: string;
  name?: string;
  phone_number?: string;
  email_verified: boolean;
  preferred_username?: string;
  custom_attributes?: Record<string, any>;
}

export type AuthStatus = 'CHECKING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
}

export interface SignUpForm {
  email: string;
  password: string;
  name?: string;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface ResetPasswordForm {
  email: string;
}

export interface ConfirmResetPasswordForm {
  email: string;
  code: string;
  newPassword: string;
}

export interface ConfirmSignUpForm {
  email: string;
  code: string;
}

export interface UpdatePasswordForm {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserAttributesForm {
  name?: string;
  email?: string;
  phone_number?: string;
}

// Event モデル
export interface EventNotification {
  type: 'percent' | 'time';
  value: number;
  message: string;
}

export interface EventRepeat {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endAfter: number | null;
  endDate: Date | null;
}

export interface Event {
  id: string;                 // UUID
  userId: string;             // ユーザーID (Cognito)
  name: string;               // イベント名
  description?: string;       // 説明 (オプション)
  startDate: Date;            // 開始日時
  endDate: Date;              // 終了日時
  color: string;              // プログレスバーの色 (HEX)
  repeat?: EventRepeat;       // 繰り返し設定 (オプション)
  showInWidget: boolean;      // ウィジェットに表示するか
  widgetPosition: number;     // ウィジェット表示順序
  notifyAt: EventNotification[]; // 通知設定 (配列)
  createdAt: Date;            // 作成日時
  updatedAt: Date;            // 更新日時
}

// User 設定モデル
export interface UserSettings {
  userId: string;             // ユーザーID (Cognito)
  theme: 'light' | 'dark' | 'system';
  widgetUpdateFrequency: 'realtime' | 'hourly' | 'daily';
  defaultColor: string;       // デフォルトのプログレスバー色
  showCompleted: boolean;     // 完了したイベントを表示するか
  notificationsEnabled: boolean; // 通知の有効/無効
  createdAt: Date;            // 作成日時
  updatedAt: Date;            // 更新日時
}

// APIエンドポイント型定義
export interface Endpoint<T = any, R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth: boolean;
  params?: T;
  body?: R;
}

// レスポンス型定義
export interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
}

// パラメータ型定義
export interface EventListParams {
  status?: 'all' | 'active' | 'completed';
  limit?: number;
  nextToken?: string;
}

// ウィジェットデータ型定義
export interface WidgetData {
  events: Array<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    color: string;
  }>;
  lastUpdated: Date;
}
