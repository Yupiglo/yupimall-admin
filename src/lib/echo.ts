import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo
if (typeof window !== 'undefined') {
    (window as any).Pusher = Pusher;
}

const createEchoInstance = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return new Echo({
        broadcaster: 'reverb',
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || '',
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
        wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
        wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
        forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
    });
};

// Singleton instance
let echoInstance: Echo<'reverb'> | null = null;

export const getEcho = () => {
    if (!echoInstance) {
        echoInstance = createEchoInstance();
    }
    return echoInstance;
};

export default getEcho;
