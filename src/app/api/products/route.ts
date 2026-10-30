import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function GET(req:Request){
 const url=new URL(req.url); const q=(url.searchParams.get('q')||'').trim().slice(0,100); const category=url.searchParams.get('category'); const sort=url.searchParams.get('sort'); const page=Math.max(1,Number(url.searchParams.get('page')||1)); const take=24;
 const where={active:true,...(category?{category:{slug:category}}:{}),...(q?{OR:[{name:{contains:q,mode:'insensitive' as const}},{description:{contains:q,mode:'insensitive' as const}},{sku:{contains:q,mode:'insensitive' as const}}]}:{})};
 const orderBy=sort==='price-asc'?{priceCents:'asc' as const}:sort==='price-desc'?{priceCents:'desc' as const}:sort==='oldest'?{createdAt:'asc' as const}:{createdAt:'desc' as const};
 const [products,total]=await Promise.all([prisma.product.findMany({where,include:{category:true},orderBy,skip:(page-1)*take,take}),prisma.product.count({where})]); return NextResponse.json({products,total,page,pages:Math.ceil(total/take)});
}
