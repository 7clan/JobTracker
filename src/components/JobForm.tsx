import { useState } from "react";

import type { Job, JobStatus } from "../types/Job";

type Props = {
  onAddJob: (job: Job) => void;
};

const statuses: JobStatus[] = ["Applied", "Interview", "Rejected", "Offer"];

export default function JobForm({ onAddJob }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<JobStatus>("Applied");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newJob: Job = {
      id: crypto.randomUUID(),
      company: company.trim(),
      role: role.trim(),
      date: new Date().toISOString().split("T")[0],
      status,
    };

    onAddJob(newJob);

    setCompany("");
    setRole("");
    setStatus("Applied");
  }

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <label>
        <span>Company</span>
        <input
          type="text"
          placeholder="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </label>

      <label>
        <span>Role</span>
        <input
          type="text"
          placeholder="Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </label>

      <label>
        <span>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
          {statuses.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Add Job</button>
    </form>
  );
}
