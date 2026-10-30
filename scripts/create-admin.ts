import bcrypt from 'bcryptjs'; import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient();
async function main(){const [name,email,password]=process.argv.slice(2);if(!name||!email||!password||password.length<14){console.error('Uso: npm run admin:create -- "Nome" email senha-com-14-ou-mais-caracteres');process.exit(1);}const passwordHash=await bcrypt.hash(password,12);const user=await prisma.user.upsert({where:{email:email.toLowerCase()},update:{name,passwordHash,role:'ADMIN'},create:{name,email:email.toLowerCase(),passwordHash,role:'ADMIN'}});console.log(`Administrador criado/atualizado: ${user.email}`);}
main().finally(()=>prisma.$disconnect());
