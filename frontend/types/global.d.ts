declare global {
    interface Window {
        Telegram: {
            Login: {
                auth: (params: {
                    bot_id: string;
                    element: HTMLElement;
                    request_access?: boolean;
                    embed?: boolean;
                    lang?: string;
                },
                    onAuth: (user: any) => void
                ) => void;
            };
        };
    }
}
export { };