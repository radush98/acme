export const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <header className="flex h-16 shrink-0 items-center border-b border-border bg-background p-4 text-foreground">
        {children}
    </header>
}