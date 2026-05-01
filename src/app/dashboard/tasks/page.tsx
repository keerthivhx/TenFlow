import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function MyTasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: session.user.id
    },
    include: {
      project: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Assigned Tasks</h2>

      <div className="board" style={{ flexDirection: 'column' }}>
        {tasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any tasks assigned to you right now.</p>
        ) : (
          tasks.map(task => {
            let badgeClass = 'badge-todo';
            if (task.status === 'IN_PROGRESS') badgeClass = 'badge-progress';
            if (task.status === 'REVIEW') badgeClass = 'badge-review';
            if (task.status === 'DONE') badgeClass = 'badge-done';

            return (
              <div key={task.id} className="task-card" style={{ maxWidth: '600px', cursor: 'default' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="task-title" style={{ margin: 0 }}>{task.title}</h3>
                  <span className={`badge ${badgeClass}`}>{task.status.replace('_', ' ')}</span>
                </div>
                {task.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {task.description}
                  </p>
                )}
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                  <Link href={`/dashboard/projects/${task.projectId}`} className="auth-link">
                    Project: {task.project.name}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
