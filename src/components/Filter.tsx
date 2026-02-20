import type { JobStatus } from "../types/Job";

type SortBy = "date-desc" | "date-asc" | "company-asc" | "status";

type FilterProps = {
  searchTerm: string;
  statusFilter: "All" | JobStatus;
  sortBy: SortBy;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "All" | JobStatus) => void;
  onSortChange: (value: SortBy) => void;
};

const statuses: Array<"All" | JobStatus> = ["All", "Applied", "Interview", "Rejected", "Offer"];

export default function Filter({
  searchTerm,
  statusFilter,
  sortBy,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: FilterProps) {
  return (
    <div className="filters">
      <label>
        <span>Search</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company or role"
        />
      </label>

      <label>
        <span>Status</span>
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value as "All" | JobStatus)}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Sort</span>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value as SortBy)}>
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="company-asc">Company A-Z</option>
          <option value="status">Status</option>
        </select>
      </label>
    </div>
  );
}
