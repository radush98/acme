export const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4">{children}</div>
}