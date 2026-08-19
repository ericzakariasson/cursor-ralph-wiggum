import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { Issue, Status, Priority, STATUSES } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Column } from "./components/Column";
import { NewIssueForm } from "./components/NewIssueForm";
import { IssuePanel } from "./components/IssuePanel";
import "./App.css";

function App() {
  const [issues, setIssues] = useLocalStorage<Issue[]>(
    "linear-clone-issues",
    [],
  );
  const [showNewIssueForm, setShowNewIssueForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === "c" &&
        !showNewIssueForm &&
        !selectedIssue &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setShowNewIssueForm(true);
      }
      if (e.key === "Escape") {
        setShowNewIssueForm(false);
        setSelectedIssue(null);
      }
    },
    [showNewIssueForm, selectedIssue],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const createIssue = (data: {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
  }) => {
    const now = new Date().toISOString();
    const newIssue: Issue = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      createdAt: now,
      updatedAt: now,
    };
    setIssues((prev) => [...prev, newIssue]);
  };

  const updateIssue = (updatedIssue: Issue) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === updatedIssue.id ? updatedIssue : issue,
      ),
    );
    setSelectedIssue(updatedIssue);
  };

  const deleteIssue = (id: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging over a column
    if (STATUSES.includes(overId as Status)) {
      const activeIssue = issues.find((i) => i.id === activeId);
      if (activeIssue && activeIssue.status !== overId) {
        setIssues((prev) =>
          prev.map((issue) =>
            issue.id === activeId
              ? {
                  ...issue,
                  status: overId as Status,
                  updatedAt: new Date().toISOString(),
                }
              : issue,
          ),
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropped on a column, update the status
    if (STATUSES.includes(overId as Status)) {
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === activeId
            ? {
                ...issue,
                status: overId as Status,
                updatedAt: new Date().toISOString(),
              }
            : issue,
        ),
      );
    }
  };

  const getIssuesByStatus = (status: Status) => {
    return issues.filter((issue) => issue.status === status);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <svg
            className="logo"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <h1>Linear Clone</h1>
        </div>
        <div className="header-right">
          <button
            className="btn-primary"
            onClick={() => setShowNewIssueForm(true)}
          >
            <span>+</span> New Issue
            <kbd>C</kbd>
          </button>
        </div>
      </header>

      <main className="board">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              issues={getIssuesByStatus(status)}
              onIssueClick={setSelectedIssue}
            />
          ))}
        </DndContext>
      </main>

      {showNewIssueForm && (
        <NewIssueForm
          onSubmit={createIssue}
          onClose={() => setShowNewIssueForm(false)}
        />
      )}

      {selectedIssue && (
        <IssuePanel
          issue={selectedIssue}
          onUpdate={updateIssue}
          onDelete={deleteIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}

export default App;
