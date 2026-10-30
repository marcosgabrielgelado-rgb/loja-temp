import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
const COOKIE = 'mdq_session';
function secret() { const s = process.env.AUTH_SECRET; if (!s || s.length < 32) throw new Error('AUTH_SECRET deve ter pelo menos 32 caracteres.'); return new TextEncoder().encode(s); }
export async function createSession(user: {id:string; role:string}) {
  const token = await new SignJWT({ role:user.role }).setProtectedHeader({alg:'HS256'}).setSubject(user.id).setIssuedAt().setExpirationTime('7d').sign(secret());
  const jar = await cookies(); jar.set(COOKIE, token, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', path:'/', maxAge:60*60*24*7 });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function currentUser() {
  try { const token=(await cookies()).get(COOKIE)?.value; if(!token) return null; const {payload}=await jwtVerify(token,secret()); if(!payload.sub) return null; return await prisma.user.findUnique({where:{id:payload.sub},select:{id:true,name:true,email:true,role:true}}); } catch { return null; }
}
export async function requireAdmin() { const user=await currentUser(); if(!user || user.role!=='ADMIN') return null; return user; }
