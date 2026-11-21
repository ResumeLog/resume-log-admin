import { useState } from "react";
import { useMe } from "@/features/auth";
import PlusIcon from "@/lib/foundations/icons/mono/plus.svg?react";
import {
  Badge,
  Button,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableScrollArea,
  TableSkeletonCell,
} from "@/lib/components";
import { formatDate } from "@/lib/utils/format";
import { useAdmins } from "./api";
import { CreateAdminDialog } from "./CreateAdminDialog";

/** Who can sign in to this dashboard, and a way to add someone. */
export function AdminsPage() {
  const admins = useAdmins();
  const me = useMe();
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-4 p-4 min-[640px]:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium text-small leading-5 text-text-subtle">
          Admins can see every user and add other admins.
        </p>
        <Button size="large" leftIcon={<PlusIcon />} onClick={() => setCreating(true)}>
          Create admin
        </Button>
      </div>

      {created && (
        <p role="status" className="rounded-large bg-background-brand-subtle px-3 py-2 text-small leading-5 text-text-default">
          Created <strong className="font-semibold">{created}</strong>. They can sign in now.
        </p>
      )}

      {admins.isError ? (
        <p role="alert" className="rounded-xlarge border border-border-danger p-4 text-small text-text-danger">
          Couldn't load admins: {admins.error.message}
        </p>
      ) : (
        <div className="overflow-clip rounded-xlarge border border-border-default">
          <TableScrollArea>
            <Table aria-label="Admins" className="w-full">
              <thead>
                <tr>
                  <TableHeaderCell className="border-t-0">Username</TableHeaderCell>
                  <TableHeaderCell className="border-t-0">Created</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {admins.isPending &&
                  Array.from({ length: 3 }, (_, i) => (
                    <tr key={i}>
                      <TableSkeletonCell width={120} />
                      <TableSkeletonCell width={90} />
                    </tr>
                  ))}
                {admins.data?.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <span className="flex items-center gap-1-5">
                        {admin.username}
                        {admin.id === me.data?.id && <Badge variant="filled">You</Badge>}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(admin.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableScrollArea>
        </div>
      )}

      <CreateAdminDialog open={creating} onClose={() => setCreating(false)} onCreated={setCreated} />
    </div>
  );
}
