import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description } = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
        members: {
          connect: { id: session.user.id } // Owner is also a member
        }
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
