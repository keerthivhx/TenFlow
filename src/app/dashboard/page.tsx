import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ClipboardList, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return null;

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { assigneeId: session.user.id },
        { project: { ownerId: session.user.id } }
      ]
    }
  });

  const totalTasks = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter(t => t.status === 'DONE').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
            <ClipboardList size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>{inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>{completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>{overdue}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      <h3>Recent Activity</h3>
      {/* List of recent tasks would go here, omitting for brevity to focus on core features */}
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Navigate to Projects to see your detailed task boards.</p>
    </div>
  );
}
