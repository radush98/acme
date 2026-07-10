export const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="relative min-h-0 flex-1 overflow-auto p-4 flex flex-col gap-4">{children}</div>
}