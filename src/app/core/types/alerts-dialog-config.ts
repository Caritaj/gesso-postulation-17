export interface AlertsDialogConfig {
    title?: string;
    message?: string;
    icon?: {
        show?: boolean;
        name?: 'info' | 'error' | 'warning' | 'check_circle';
        color?: 'info' | 'error' | 'warning' | 'success';
    };
    actions?: {
        confirm?: {
            show?: boolean;
            label?: string;
            color?: string;
        };
        cancel?: {
            show?: boolean;
            label?: string;
        };
    };
    dismissible?: boolean;
}
