import { useTasks } from "@/infrastructure/convex/TaskApi";
import { ComponentExample } from "@/ui/web/modules/home/components/ComponentExample";

export function HomeScreen() {
  const tasks = useTasks();
  return (
    <div className={"flex flex-col gap-8"}>
      <ComponentExample />
      {tasks?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </div>
  );
}
