export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout is now just a purely empty shell for the admin section.
    // It does NOT have the sidebar.
    // The sidebar lives in (dashboard)/layout.tsx
    return (
        <div style={{ minHeight: '100vh', background: '#050505' }}>
            {children}
        </div>
    );
}
