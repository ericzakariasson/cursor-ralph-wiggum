import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Issue, Status, STATUS_CONFIG } from "../types";
import { IssueCard } from "./IssueCard";

interface ColumnProps {
  status: Status;
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

export function Column({ status, issues, onIssueClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = STATUS_CONFIG[status];

  return (
    <div className={`column ${isOver ? "column-over" : ""}`}>
      <div className="column-header">
        <span
          className="column-indicator"
          style={{ backgroundColor: config.color }}
        />
        <h2 className="column-title">{config.label}</h2>
        <span className="column-count">{issues.length}</span>
      </div>
      <div ref={setNodeRef} className="column-content">
        <SortableContext
          items={issues.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => onIssueClick(issue)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
