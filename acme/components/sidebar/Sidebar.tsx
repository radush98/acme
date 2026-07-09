export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <aside className="w-fit h-full w-sidebar bg-sidebar text-sidebar-foreground p-4 border-r border-border flex shrink-0">
        {children}
    </aside>
}