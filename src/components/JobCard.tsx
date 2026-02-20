import { useState } from "react";

import type { Job, JobStatus } from "../types/Job";

type JobCardProps = {
  job: Job;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Job, "id">>) => void;
};

const statuses: JobStatus[] = ["Applied", "Interview", "Rejected", "Offer"];

export default function JobCard({ job, onDelete, onUpdate }: JobCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState(job.company);
  const [role, setRole] = useState(job.role);
  const [status, setStatus] = useState<JobStatus>(job.status);

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    onUpdate(job.id, {
      company: company.trim(),
      role: role.trim(),
      status,
    });
    setIsEditing(false);
  }

  function cancelEdit() {
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setIsEditing(false);
  }

  return (
    <article className="job-card">
      {isEditing ? (
        <form className="job-edit" onSubmit={saveEdit}>
          <label>
            <span>Company</span>
            <input value={company} onChange={(e) => setCompany(e.target.value)} required />
          </label>
          <label>
            <span>Role</span>
            <input value={role} onChange={(e) => setRole(e.target.value)} required />
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <div className="job-actions">
            <button type="submit">Save</button>
            <button type="button" className="btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3>
            {job.role} <span>@ {job.company}</span>
          </h3>
          <p>Applied on: {job.date}</p>
          <p className={`job-status status-${job.status.toLowerCase()}`}>Status: {job.status}</p>
          <div className="job-actions">
            <button type="button" onClick={() => onUpdate(job.id, { status: "Interview" })}>
              Interview
            </button>
            <button type="button" onClick={() => onUpdate(job.id, { status: "Rejected" })}>
              Rejected
            </button>
            <button type="button" onClick={() => onUpdate(job.id, { status: "Offer" })}>
              Offer
            </button>
            <button type="button" className="btn-secondary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button type="button" className="btn-danger" onClick={() => onDelete(job.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}
