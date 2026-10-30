import { PrismaClient } from '@prisma/client'; const prisma=new PrismaClient();
async function main(){const cats=[['Peças de madeira','pecas-de-madeira'],['Luminárias','luminarias'],['Decoração','decoracao'],['Móveis e acessórios','moveis-e-acessorios'],['Acessórios para iluminação','acessorios-iluminacao'],['Personalizados','personalizados']];for(const [name,slug] of cats)await prisma.category.upsert({where:{slug},update:{name},create:{name,slug}});console.log('Categorias iniciais criadas. Nenhum produto ou avaliação fictícia foi inserido.');}
main().finally(()=>prisma.$disconnect());
