import { createColumnHelper } from '@tanstack/react-table'

import { Button } from '#/shared/ui/button'
import { DataTable } from '#/shared/ui/data-table'
import type { DataTableFeatures } from '#/shared/ui/data-table'

interface Task {
  id: string
  name: string
  status: 'todo' | 'in-progress' | 'done'
}

const tasks: Task[] = [
  { id: 'TASK-1', name: 'Wire up StyleX pipeline', status: 'done' },
  {
    id: 'TASK-2',
    name: 'Install shadcn-cssinjs components',
    status: 'in-progress',
  },
  { id: 'TASK-3', name: 'Build the Todo data layer', status: 'todo' },
  { id: 'TASK-4', name: 'Wire routing to the .NET API', status: 'todo' },
  { id: 'TASK-5', name: 'Ship the first widget', status: 'todo' },
]

const columnHelper = createColumnHelper<DataTableFeatures, Task>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('status', { header: 'Status' }),
])

export function HomePage() {
  return (
    <main>
      <h1>Welcome to TanStack Start</h1>
      <p>
        This starter composes <code>pages/</code> slices into{' '}
        <code>src/routes/</code> files; see <code>src/pages/home/</code> to
        get started.
      </p>
      <Button>Click me</Button>
      <DataTable columns={columns} data={tasks} />
    </main>
  )
}
