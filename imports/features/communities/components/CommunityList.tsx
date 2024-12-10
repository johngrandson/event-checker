import React, { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '/components/ui/select';
import PeopleList from '/imports/features/people/components/PeopleList';
import { useCommunities } from '/imports/features/communities/hooks/useCommunities';

export const CommunityList: React.FC = () => {
  const { communities, isLoading, error } = useCommunities();

  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleSelect = (id: string) => {
    setSelectedCommunityId(id);
  };

  return (
    <div>
      <Select
        onValueChange={handleSelect}
        value={selectedCommunityId || undefined}
      >
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Select an event" />
        </SelectTrigger>
        <SelectContent>
          {communities.map((community) => (
            <SelectItem key={community._id} value={community._id}>
              {community.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <PeopleList selectedCommunityId={selectedCommunityId} />
    </div>
  );
};
