export const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <main className="relative flex-1 overflow-auto p-4">{children}</main>
}