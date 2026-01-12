import { RecentMatchCardProps } from "./recent-match-card";

export const MOCK_PROFILE_DETAILS = [
  { label: "Location", value: "Brooklyn, NY" },
  { label: "Member since", value: "January 2026" },
  { label: "Last active", value: "2 days ago" },
];

export const MOCK_MATCHES: RecentMatchCardProps[] = [
  {
    opponent: "John Doe",
    frames: 16,
    format: "Competitive",
    date: "2026-01-01",
    result: "win",
    heroScore: 66,
    villainScore: 34,
  },
  {
    opponent: "Jane Doe",
    frames: 8,
    format: "Casual",
    date: "2026-01-02",
    result: "loss",
    heroScore: 34,
    villainScore: 66,
  },
  {
    opponent: "John Smith",
    frames: 16,
    format: "Ranked",
    date: "2026-01-03",
    result: "win",
    heroScore: 66,
    villainScore: 34,
  },
];
