import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string(),
  assigneeId: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
