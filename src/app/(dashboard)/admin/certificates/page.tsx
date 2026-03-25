import { Metadata } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Award, Calendar, User, FileText } from "lucide-react";
import Link from "next/link";
import { CERTIFICATE_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "Certificates | Admin Dashboard" };

interface CertType {
    id: string; certificateNo: string; title: string; type: string;
    issueDate: Date; member?: { user?: { name: string | null } } | null;
}

export default async function AdminCertificatesPage() {
    const certs: CertType[] = await prisma.certificate.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { member: { include: { user: { select: { name: true } } } } },
    }) as any;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-slate-900">Certificates</h1>
                    <p className="text-slate-500 text-sm mt-1">Issue and manage certificates for members</p>
                </div>
                <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white shadow-md shadow-amber-900/10 rounded-xl">
                    <Link href="/admin/certificates/new">
                        <Plus className="w-4 h-4 mr-2" /> Issue Certificate
                    </Link>
                </Button>
            </div>

            <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80 border-b border-slate-100">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4"><span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Certificate #</span></TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4"><span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Member</span></TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4"><span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Details</span></TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Issued</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {certs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-slate-400 py-16">
                                            <Award className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                                            <p className="text-sm font-medium">No certificates issued yet</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    certs.map((cert) => (
                                        <TableRow key={cert.id} className="hover:bg-slate-50/80 border-b border-slate-50 transition-colors">
                                            <TableCell>
                                                <code className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">{cert.certificateNo}</code>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-800">
                                                {cert.member?.user?.name || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm font-semibold text-slate-700">{cert.title}</p>
                                                <Badge variant="outline" className="text-[10px] mt-1 bg-white uppercase tracking-wider font-bold text-slate-500 border-slate-200 leading-none py-0.5">
                                                    {CERTIFICATE_LABELS[cert.type as keyof typeof CERTIFICATE_LABELS] || cert.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500 font-medium">{formatDate(cert.issueDate)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
