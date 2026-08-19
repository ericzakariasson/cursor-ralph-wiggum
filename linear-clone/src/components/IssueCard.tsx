import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Issue, PRIORITY_CONFIG } from "../types";

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityConfig = PRIORITY_CONFIG[issue.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="issue-card"
      onClick={onClick}
    >
      <div className="issue-card-header">
        <span className="issue-id">
          ISS-{issue.id.slice(0, 4).toUpperCase()}
        </span>
        <span
          className="priority-indicator"
          title={priorityConfig.label}
          style={{ color: priorityConfig.color }}
        >
          {priorityConfig.icon}
        </span>
      </div>
      <h3 className="issue-title">{issue.title}</h3>
      {issue.description && (
        <p className="issue-description">{issue.description}</p>
      )}
    </div>
  );
}
