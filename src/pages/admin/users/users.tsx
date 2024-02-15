import { useGetUsers } from '@/hooks/admin/users/get-users.tsx'
import { Card, CardHeader, CardTitle } from '@/components/ui/card.tsx'

export const Users = () => {
  const { users, isLoading } = useGetUsers()
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{users?.data?.length} Utilisateurs inscrits</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}
