interface ErrorBannerProps {
    message: string;
    onClose: () => void;
}

export const ErrorBanner = ({ message, onClose }: ErrorBannerProps) => {
    if (!message) return null;

    return (
        <div className="error-banner" role="alert">
            <p>{message}</p>
            <button type="button" onClick={onClose} aria-label="Cerrar error">
                x
            </button>
        </div>
    );
};
