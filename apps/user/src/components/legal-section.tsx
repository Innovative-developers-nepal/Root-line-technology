export function LegalSection({
  number,
  id,
  title,
  children,
}: {
  number: string;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-12 first:pt-0">
      <div className="mb-6 border-t border-border/30 pt-8">
        <h2 className="font-display text-2xl leading-tight tracking-tight text-foreground md:text-3xl">
          <span className="text-muted-foreground/30">{number}.</span> {title}
        </h2>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground prose-headings:text-foreground prose-a:text-foreground prose-strong:text-foreground">
        {children}
      </div>
    </section>
  );
}
