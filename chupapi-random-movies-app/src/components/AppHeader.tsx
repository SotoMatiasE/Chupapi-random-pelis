interface AppHeaderProps {
    totalSpins: number;
}

export const AppHeader = ({ totalSpins }: AppHeaderProps) => {
    return (
        <header className="app-header">
            <div>
                <span className="app-brand-kicker">Chupapi</span>
                <h1>Movie Mime</h1>
            </div>

            <div className="counter-card" aria-label={`Cantidad de tiradas: ${totalSpins}`}>
                <span>Tiradas</span>
                <strong>{totalSpins}</strong>
            </div>
        </header>
    );
};
