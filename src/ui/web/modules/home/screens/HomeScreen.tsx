import {
  useTasks,
  useToggleTaskCompletion,
} from "@/infrastructure/convex/TaskApi";
import { cn } from "@/ui/web/lib/utils";
import { ComponentExample } from "@/ui/web/modules/home/components/ComponentExample";

export function HomeScreen() {
  const tasks = useTasks();
  const toggleComplete = useToggleTaskCompletion();

  return (
    <div className={"flex flex-col gap-8"}>
      <ComponentExample />
      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
            <p className="text-sm text-muted-foreground">
              Stay on top of what matters today.
            </p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {tasks?.length ?? 0} items
          </span>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          {tasks?.length ? (
            tasks.map(({ _id, text, isCompleted }) => {
              const taskId = `task-${_id}`;
              return (
                <label
                  key={_id}
                  htmlFor={taskId}
                  className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <input
                    id={taskId}
                    type="checkbox"
                    checked={Boolean(isCompleted)}
                    onChange={() => toggleComplete({ id: _id })}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                  <span
                    className={cn(
                      "text-sm font-medium text-foreground transition group-hover:text-foreground",
                      isCompleted && "text-muted-foreground line-through",
                    )}
                  >
                    {text}
                  </span>
                </label>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
              No tasks yet. Add one to get started.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
