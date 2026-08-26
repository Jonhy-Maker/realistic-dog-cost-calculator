"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="container-x grid min-h-screen place-items-center py-20 text-center">
          <div>
            <div className="text-6xl">🐶</div>
            <h1 className="mt-5 text-4xl font-black">Something went wrong</h1>
            <p className="mt-3 text-[#65736d]">The application could not render this page.</p>
            <button type="button" onClick={() => reset()} className="mt-6 rounded-xl bg-[#1f7a58] px-5 py-3 font-bold text-white">Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
