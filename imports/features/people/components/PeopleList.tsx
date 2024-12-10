import React, { useCallback, useState } from 'react';

import { useColumns } from './Columns';
import { DataTableWithPagination } from '/imports/features/people/components/DataTableWithPagination';
import { PeopleCountChart } from '/imports/features/people/components/PeopleCountChart';
import { useReactivePeople } from '/imports/features/people/hooks/useReactivePeople';

const PeopleList = ({
  selectedCommunityId,
}: {
  selectedCommunityId: string | null;
}) => {
  const [page, setPage] = useState(1);
  const size = 10;

  const { people, total, checkedInData, totalNotChecked, isLoading } =
    useReactivePeople(selectedCommunityId, size, page);

  const columns = useColumns();

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <DataTableWithPagination
        columns={columns}
        size={size}
        currentPage={page}
        totalItems={total}
        fetchData={() => ({ data: people, total })}
        onPageChange={handlePageChange}
      />
    );
  };

  return (
    <div>
      <PeopleCountChart
        total={total.toString()}
        chartData={checkedInData}
        notChecked={totalNotChecked.toString()}
        eventSelected={!!selectedCommunityId}
      />
      {renderContent()}
    </div>
  );
};

export default PeopleList;
