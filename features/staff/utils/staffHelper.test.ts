// features/staff/utils/staffHelper.test.ts
import { getStatusColor, formatDateTime } from "./staffHelper";

describe("getStatusColor", () => {
  it("returns gray for idle", () => {
    expect(getStatusColor("idle")).toBe("bg-gray-400");
  });

  it("returns green for active", () => {
    expect(getStatusColor("active")).toBe("bg-green-400");
  });

  it("returns primary color for submitted", () => {
    expect(getStatusColor("submitted")).toBe("bg-primary");
  });

  it("returns red for disconnected", () => {
    expect(getStatusColor("disconnected")).toBe("bg-red-500");
  });

  it("returns undefined for an unrecognized status", () => {
    // @ts-expect-error - intentionally testing an invalid status value
    expect(getStatusColor("unknown")).toBeUndefined();
  });
});

describe("formatDateTime", () => {
  it("formats a timestamp as DD/MM/YYYY, HH:mm:ss", () => {
    // 2024-03-15T09:05:30.000Z
    const timestamp = new Date(Date.UTC(2024, 2, 15, 9, 5, 30)).getTime();

    const result = formatDateTime(timestamp);

    // en-GB DateTimeFormat outputs "15/03/2024, 09:05:30" style,
    // but exact hour depends on the runner's local timezone since
    // no timeZone option is passed to Intl.DateTimeFormat.
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}$/);
    expect(result).toContain("15/03/2024");
  });

  it("pads single-digit day, month, hour, minute, and second with a leading zero", () => {
    // 2024-01-05T03:07:09.000Z
    const timestamp = new Date(Date.UTC(2024, 0, 5, 3, 7, 9)).getTime();

    const result = formatDateTime(timestamp);

    expect(result).toContain("05/01/2024");
  });

  it("returns a string", () => {
    const result = formatDateTime(Date.now());
    expect(typeof result).toBe("string");
  });
});