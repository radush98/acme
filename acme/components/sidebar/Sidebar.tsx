export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-muted p-4 text-foreground">
        {children}
    </aside>
}