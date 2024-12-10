import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  CheckCircle,
  Loader,
  MapPinCheck,
  MapPinX,
  OctagonAlertIcon,
} from 'lucide-react';

import { Badge } from '/components/ui/badge';
import { ActionButton } from '/components/ui/action-button';
import { Person } from '/imports/features/people/schemas';
import { useChecking } from '/imports/features/people/hooks/useChecking';

export const useColumns = () => {
  const { checkIn, checkOut } = useChecking();

  const columns: ColumnDef<Person>[] = [
    {
      accessorKey: 'firstName',
      header: 'Name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      size: 150,
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      size: 200,
      cell: ({ row }) =>
        row.getValue('companyName') ? (
          <Badge variant="secondary">{row.getValue('companyName')}</Badge>
        ) : (
          <Badge variant="destructive">
            <OctagonAlertIcon size={20} />
          </Badge>
        ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      size: 200,
      cell: ({ row }) =>
        row.getValue('title') ? (
          <Badge variant="outline">{row.getValue('title')}</Badge>
        ) : (
          <Badge variant="destructive">
            <OctagonAlertIcon size={20} />
          </Badge>
        ),
    },
    {
      accessorKey: 'checkInDate',
      header: 'Check-in Date',
      size: 170,
      accessorFn: (row) =>
        row.checkInDate
          ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).format(row.checkInDate)
          : 'N/A',
      cell: ({ row }) =>
        row.getValue('checkInDate') ? (
          <Badge variant="secondary">{row.getValue('checkInDate')}</Badge>
        ) : (
          <Badge variant="destructive">
            <OctagonAlertIcon size={20} />
          </Badge>
        ),
    },
    {
      accessorKey: 'checkOutDate',
      header: 'Check-out Date',
      size: 170,
      accessorFn: (row) =>
        row.checkOutDate
          ? new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).format(row.checkOutDate)
          : 'N/A',
      cell: ({ row }) =>
        row.getValue('checkOutDate') ? (
          <Badge variant="secondary">{row.getValue('checkOutDate')}</Badge>
        ) : (
          <Badge variant="destructive">
            <OctagonAlertIcon size={20} />
          </Badge>
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 250,
      cell: ({ row }) => {
        const person = row.original;

        const canCheckout =
          person.checkInDate && !person.checkOutDate && person.canCheckOut;

        return (
          <div className="flex space-x-2">
            {!person.checkInDate ? (
              <ActionButton
                variant="success"
                onClick={() => checkIn(person._id)}
                text={`Check-in ${person.firstName} ${person.lastName}`}
                Icon={MapPinCheck}
              />
            ) : canCheckout ? (
              <ActionButton
                variant="destructive"
                onClick={() => checkOut(person._id)}
                text={`Check-out ${person.firstName} ${person.lastName}`}
                Icon={MapPinX}
              />
            ) : !person.checkOutDate ? (
              <ActionButton
                variant="outline"
                disabled
                text="Checking..."
                Icon={Loader}
                iconClassName="text-gray-500"
              />
            ) : (
              <ActionButton
                variant="outline"
                disabled
                text="Finished"
                Icon={CheckCircle}
                iconClassName="text-gray-500"
              />
            )}
          </div>
        );
      },
    },
  ];

  return columns;
};
