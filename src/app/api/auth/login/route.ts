import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
const schema=z.object({email:z.string().email().max(254),password:z.string().min(1).max(200)});
export async function POST(req:Request) {
  const parsed=schema.safeParse(await req.json().catch(()=>null)); if(!parsed.success) return NextResponse.json({error:'Informe e-mail e senha válidos.'},{status:400});
  const email=parsed.data.email.toLowerCase().trim(); const user=await prisma.user.findUnique({where:{email}});
  if(!user || !(await bcrypt.compare(parsed.data.password,user.passwordHash))) return NextResponse.json({error:'E-mail ou senha incorretos.'},{status:401});
  await createSession(user); return NextResponse.json({user:{id:user.id,name:user.name,email:user.email,role:user.role}});
}
