export const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <header className="sticky top-0 left-0 right-0 h-16 bg-background text-foreground p-4 border-b border-border z-10">
        {children}
    </header>
}