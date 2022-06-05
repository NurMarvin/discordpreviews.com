/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
let lastUpdated = 0;
let memberCount = 0;

export const getMemberCount = async (inviteCode: string): Promise<number> => {
  // Check if the last update was less than 5 minutes ago, if so return the cached member count
  if (Date.now() - lastUpdated < 1000 * 60 * 5) {
    return memberCount;
  }

  const response = await fetch(
    `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`
  );

  if (!response.ok) {
    return memberCount;
  }

  const data = await response.json();
  memberCount = data.approximate_member_count;
  lastUpdated = Date.now();

  return memberCount;
};

export const getFlooredMemberCount = async (
  inviteCode: string
): Promise<number> => {
  const memberCount = await getMemberCount(inviteCode);

  return Math.floor(memberCount / 100) * 100;
};
