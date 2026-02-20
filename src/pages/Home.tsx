import "../styles/Home.css";

import { useEffect, useMemo, useState } from "react";

import Filter from "../components/Filter";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import ParticleBackground from "../components/ParticleBackground";
import type { Job, JobStatus } from "../types/Job";

const STORAGE_KEY = "viraljobs.jobs.v1";

type SortBy = "date-desc" | "date-asc" | "company-asc" | "status";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | JobStatus>("All");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Job[];
      if (Array.isArray(parsed)) {
        setJobs(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [isHydrated, jobs]);

  function addJob(job: Job) {
    setJobs((prev) => [job, ...prev]);
  }

  function deleteJob(id: string) {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }

  function updateJob(id: string, updates: Partial<Omit<Job, "id">>) {
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...updates } : job)));
  }

  const visibleJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = jobs.filter((job) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        job.company.toLowerCase().includes(normalizedSearch) ||
        job.role.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === "date-desc") {
        return b.date.localeCompare(a.date);
      }
      if (sortBy === "date-asc") {
        return a.date.localeCompare(b.date);
      }
      if (sortBy === "company-asc") {
        return a.company.localeCompare(b.company);
      }
      return a.status.localeCompare(b.status);
    });

    return sorted;
  }, [jobs, searchTerm, sortBy, statusFilter]);

  return (
    <div className="home-page">
      <ParticleBackground />

      <main className="home-shell">
        <header className="home-header">
          <p className="home-kicker">Career Dashboard</p>
          <h1>Job Tracker</h1>
          <p className="home-subtitle">Track applications, update progress, and stay focused on interviews.</p>
        </header>

        <section className="panel panel-form">
          <JobForm onAddJob={addJob} />
        </section>

        <section className="panel panel-list">
          <div className="panel-top">
            <h2>Applications ({visibleJobs.length})</h2>
          </div>

          <Filter
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            sortBy={sortBy}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
          />

          {visibleJobs.length === 0 ? (
            <p className="empty-state">No matching jobs. Try changing your filters or add a new application.</p>
          ) : (
            <div className="jobs-grid">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} onDelete={deleteJob} onUpdate={updateJob} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
