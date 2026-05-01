import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TaskActions from '@/components/TaskActions';

export default async function ProjectBoardPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
      OR: [
        { ownerId: session.user.id },
        { members: { some: { id: session.user.id } } }
      ]
    },
    include: {
      tasks: {
        include: { assignee: true }
      },
      members: true
    }
  });

  if (!project) return notFound();

  const statuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>{project.name}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
        </div>
        {session.user.role === 'ADMIN' && <TaskActions projectId={project.id} />}
      </div>

      <div className="board">
        {statuses.map((status) => {
          const colTasks = project.tasks.filter(t => t.status === status);
          let badgeClass = 'badge-todo';
          if (status === 'IN_PROGRESS') badgeClass = 'badge-progress';
          if (status === 'REVIEW') badgeClass = 'badge-review';
          if (status === 'DONE') badgeClass = 'badge-done';

          return (
            <div key={status} className="column">
              <div className="column-title">
                {status.replace('_', ' ')}
                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{colTasks.length}</span>
              </div>
              
              {colTasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`badge ${badgeClass}`}>{status}</span>
                    <span>{task.assignee?.name || 'Unassigned'}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
