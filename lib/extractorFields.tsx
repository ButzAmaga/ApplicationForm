export function extractFamilyMembers(formData: FormData) {
    const familyMap: Record<number, any> = {};

    for (const [key, value] of formData.entries()) {
        const match = key.match(/^family_members_(\d+)_(.+)$/);

        if (!match) continue;

        const index = Number(match[1]);
        const field = match[2];

        if (!familyMap[index]) {
            familyMap[index] = { id: index };
        }

        familyMap[index][field] = value;
    }

    return Object.values(familyMap);
}

export function extractEmploymentRecords(formData: FormData) {
  const recordMap: Record<number, any> = {};

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^employment_records_(\d+)_(.+)$/);

    if (!match) continue;

    const index = Number(match[1]);
    const rest = match[2];

    if (!recordMap[index]) {
      recordMap[index] = { id: index };
    }

    const descMatch = rest.match(/^job_descriptions_(\d+)$/);

    if (descMatch) {
      const descIndex = Number(descMatch[1]);
      if (!recordMap[index].job_descriptions) {
        recordMap[index].job_descriptions = {};
      }
      recordMap[index].job_descriptions[descIndex] = value;
    } else {
      recordMap[index][rest] = value;
    }
  }

  return Object.values(recordMap).map((record) => ({
    ...record,
    job_descriptions: record.job_descriptions
      ? Object.values(record.job_descriptions)
      : [],
  }));
}
