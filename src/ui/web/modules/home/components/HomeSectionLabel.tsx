import { Small } from "@/ui/web/components/Typography";

type HomeSectionLabelProps = {
  text: string;
};

export const HomeSectionLabel = ({ text }: HomeSectionLabelProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border/60" />
      <Small variant="label" className="text-[10px] text-muted-foreground/80">
        {text}
      </Small>
      <span className="h-px flex-1 bg-border/60" />
    </div>
  );
};
