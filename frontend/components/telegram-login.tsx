'use client';

import { useEffect, useRef } from 'react';
import { TelegramUser } from '@/types/telegram';

interface TelegramLoginProps {
    botName: string;
    onAuth: (user: TelegramUser) => void;
    triggerRef: React.RefObject<HTMLButtonElement>;
}

export function TelegramLogin({
    botName,
    onAuth,
    triggerRef
}: TelegramLoginProps) {
    const widgetInitialized = useRef(false);

    useEffect(() => {
        // Create a hidden container
        const container = document.createElement('div');
        container.id = 'telegram-login-container';
        container.style.position = 'fixed';
        container.style.visibility = 'hidden';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);

        // Function to initialize the widget
        const initWidget = () => {
            if (window.Telegram && window.Telegram.Login && !widgetInitialized.current) {
                console.log('Initializing Telegram widget');

                // Create the login button element
                const loginDiv = document.createElement('div');
                loginDiv.id = 'telegram-login';
                container.appendChild(loginDiv);
                const cleanBotName = botName.replace(/_bot$/, '');
                console.log({
                    bot_id: cleanBotName,
                    element: loginDiv,
                    request_access: true,
                    embed: true,
                    lang: 'en',
                    onAuth: (user: any) => {
                        console.log('Auth callback received');
                        onAuth(user);
                    }
                })
                // Initialize the widget
                window.Telegram.Login.auth({
                    bot_id: cleanBotName,
                    element: loginDiv,
                    request_access: true,
                    embed: true,
                    lang: 'en'
                }, (user) => {
                    console.log('Auth callback received');
                    onAuth(user);
                }
                );

                widgetInitialized.current = true;
                console.log('Widget initialized');
            }
        };

        // Add the Telegram script
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;

        // Initialize when script loads
        script.onload = () => {
            console.log('Telegram script loaded');
            initWidget();
        };

        document.body.appendChild(script);

        // Handle custom button click
        const handleClick = async (e: MouseEvent) => {
            e.preventDefault();
            console.log('Custom button clicked');

            // Give a moment for initialization if needed
            if (!widgetInitialized.current) {
                console.log('Widget not initialized, attempting initialization');
                initWidget();
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            const iframe = document.querySelector<HTMLElement>('#telegram-login iframe');
            if (iframe) {
                console.log('Found Telegram iframe, clicking');
                iframe.style.pointerEvents = 'auto';
                iframe.click();
                iframe.style.pointerEvents = 'none';
            } else {
                console.error('Telegram login iframe not found - widget may not be initialized');
            }
        };

        if (triggerRef.current) {
            triggerRef.current.addEventListener('click', handleClick);
            console.log('Click handler attached to button');
        }

        // Cleanup
        return () => {
            if (triggerRef.current) {
                triggerRef.current.removeEventListener('click', handleClick);
            }
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
            widgetInitialized.current = false;
        };
    }, [botName, onAuth, triggerRef]);

    return null;
}