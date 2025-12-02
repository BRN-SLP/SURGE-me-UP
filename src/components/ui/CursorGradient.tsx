"use client";

export function CursorGradient() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
            style={{
                background: `
                    radial-gradient(circle 800px at 20% 30%, rgba(0, 82, 255, 0.15), transparent),
                    radial-gradient(circle 600px at 80% 70%, rgba(255, 4, 32, 0.12), transparent),
                    radial-gradient(circle 700px at 50% 50%, rgba(252, 204, 22, 0.10), transparent),
                    radial-gradient(circle 500px at 70% 20%, rgba(138, 99, 210, 0.13), transparent),
                    black
                `,
            }}
        />
    );
}
