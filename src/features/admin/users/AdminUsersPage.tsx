import { useEffect, useMemo, useState } from 'react'
import { Search, Ban, CheckCircle2, Users } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAdminUsersStore } from '@/store/useAdminUsersStore'
import { useToast } from '@/components/ui/Toast'
import { formatDate, formatPrice } from '@/lib/utils'

export default function AdminUsersPage() {
  const users = useAdminUsersStore((s) => s.users)
  const fetchUsers = useAdminUsersStore((s) => s.fetchUsers)
  const toggleBlock = useAdminUsersStore((s) => s.toggleBlock)
  const { toast } = useToast()
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(
    () => users.filter((u) => !query.trim() || u.name.toLowerCase().includes(query.trim().toLowerCase()) || u.email.toLowerCase().includes(query.trim().toLowerCase())),
    [users, query],
  )

  async function handleToggleBlock(id: string, currentStatus: 'active' | 'blocked') {
    try {
      await toggleBlock(id)
      toast({ type: 'success', title: currentStatus === 'active' ? 'User blocked' : 'User unblocked' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update user', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Users</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{users.length} registered customers</p>
        </div>
        <div className="w-full sm:w-72">
          <Input placeholder="Search by name or email…" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      <div className="surface-card mt-6 overflow-x-auto">
        {filtered.length === 0 ? (
          <EmptyState icon={<Users className="h-7 w-7" />} title="No users found" description="Try a different search term." />
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-porcelain-300 text-left text-xs font-semibold uppercase tracking-wider text-ink-600 dark:border-ink-700 dark:text-porcelain-300/60">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-porcelain-300 dark:divide-ink-700">
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-950 dark:text-porcelain-100">{u.name}</p>
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-600 dark:text-porcelain-300/70">{formatDate(u.joinedAt)}</td>
                  <td className="price px-4 py-3 text-ink-950 dark:text-porcelain-100">{u.ordersCount}</td>
                  <td className="price px-4 py-3 font-medium text-ink-950 dark:text-porcelain-100">{formatPrice(u.totalSpent)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.status === 'active' ? 'success' : 'danger'} className="capitalize">{u.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={u.status === 'active' ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      onClick={() => handleToggleBlock(u.id, u.status)}
                    >
                      {u.status === 'active' ? 'Block' : 'Unblock'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}