/**
 * Utility to format image URLs, prepending the backend origin if necessary.
 * Handles local static images, external URLs, and backend-hosted images.
 */
export const getImagePath = (path: string | null | undefined): string => {
    if (!path || path.trim() === "" || path === "/images/placeholder-pro.jpg" || path === "/placeholder-product.png") {
        return "/images/placeholder-pro.jpg";
    }

    // If it's already a full URL, return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If it's a local static image from public folder, return as-is
    if (path.startsWith('/Product/') || path.startsWith('/images/')) {
        return path;
    }

    // If it's a backend upload, use relative path to trigger local proxy (next.config rewrites)
    if (path.startsWith('uploads/') || path.startsWith('/uploads/')) {
        return "/" + path.replace(/^\//, "");
    }

    // If it's a storage path (Laravel default), prefix with backend origin
    if (path.startsWith('storage/') || path.startsWith('/storage/')) {
        const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || process.env.NEXT_PUBLIC_API_URL || 'https://api.yupimall.net';
        const base = backendOrigin.replace(/\/$/, "");
        const normalizedPath = path.replace(/^\//, "");
        return `${base}/${normalizedPath}`;
    }

    // Fallback logic for other paths
    const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || process.env.NEXT_PUBLIC_API_URL || 'https://api.yupimall.net';
    const base = backendOrigin.replace(/\/$/, "");
    const normalizedPath = path.replace(/^\//, "");

    // If it's production, we prefer relative paths for proxying if it looks like an upload
    if (process.env.NODE_ENV === 'production' && !path.startsWith('http')) {
        return "/" + normalizedPath;
    }

    return `${base}/${normalizedPath}`;
};

export default getImagePath;
