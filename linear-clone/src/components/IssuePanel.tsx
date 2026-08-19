import { useState, useEffect } from "react";
import {
  Issue,
  Priority,
  Status,
  PRIORITIES,
  PRIORITY_CONFIG,
  STATUSES,
  STATUS_CONFIG,
} from "../types";

interface IssuePanelProps {
  issue: Issue;
  onUpdate: (issue: Issue) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function IssuePanel({
  issue,
  onUpdate,
  onDelete,
  onClose,
}: IssuePanelProps) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [priority, setPriority] = useState<Priority>(issue.priority);
  const [status, setStatus] = useState<Status>(issue.status);

  useEffect(() => {
    setTitle(issue.title);
    setDescription(issue.description);
    setPriority(issue.priority);
    setStatus(issue.status);
  }, [issue]);

  const handleUpdate = () => {
    onUpdate({
      ...issue,
      title,
      description,
      priority,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this issue?")) {
      onDelete(issue.id);
      onClose();
    }
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <span className="issue-id">
            ISS-{issue.id.slice(0, 4).toUpperCase()}
          </span>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="panel-content">
          <div className="form-group">
            <input
              type="text"
              className="panel-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleUpdate}
              placeholder="Issue title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleUpdate}
              placeholder="Add a description..."
              rows={6}
            />
          </div>

          <div className="panel-fields">
            <div className="panel-field">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as Status);
                  setTimeout(handleUpdate, 0);
                }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="panel-field">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value as Priority);
                  setTimeout(handleUpdate, 0);
                }}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_CONFIG[p].icon} {PRIORITY_CONFIG[p].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="panel-meta">
            <p>Created: {new Date(issue.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="panel-actions">
            <button className="btn-danger" onClick={handleDelete}>
              Delete Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
