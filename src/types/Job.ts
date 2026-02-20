export type JobStatus = "Applied" | "Interview" | "Rejected" | "Offer";

export type Job = {
  id: string;
  company: string;
  role: string;
  date: string;
  status: JobStatus;
};
