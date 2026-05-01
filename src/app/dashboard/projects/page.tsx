import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProjectActions from '@/components/ProjectActions';

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { members: { some: { id: session.user.id } } }
      ]
    },
    include: {
      _count: {
        select: { tasks: true, members: true }
      }
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>Projects</h2>
        {session.user.role === 'ADMIN' && <ProjectActions />}
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
            <div className="project-card">
              <h3 className="project-title">{project.name}</h3>
              <p className="project-desc">{project.description || 'No description provided.'}</p>
              <div className="project-footer">
                <span>{project._count.tasks} Tasks</span>
                <span>{project._count.members} Members</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any projects yet.</p>
        )}
      </div>
    </div>
  );
}
