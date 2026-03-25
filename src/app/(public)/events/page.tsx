import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Events",
    description: "Upcoming and past events by Nirashray Foundation.",
};

interface EventType {
    id: string; title: string; slug: string; description: string;
    date: Date; time: string; venue: string; image: string | null;
    isPublished: boolean;
}

export default async function EventsPage() {
    const now = new Date();
    const [upcoming, past]: [EventType[], EventType[]] = await Promise.all([
        prisma.event.findMany({
            where: { isPublished: true, date: { gte: now } },
            orderBy: { date: "asc" },
        }),
        prisma.event.findMany({
            where: { isPublished: true, date: { lt: now } },
            orderBy: { date: "desc" },
            take: 12,
        }),
    ]) as any;

    const EventCard = ({ event, isPast }: { event: EventType; isPast?: boolean }) => (
        <div className={`group flex flex-col pt-4 ${isPast ? "opacity-75 hover:opacity-100 transition-opacity" : ""}`}>
            <div className={`aspect-[4/3] relative bg-[#fdfcfa] ${isPast ? "rounded-2xl grayscale hover:grayscale-0 transition-all" : "rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-4 border-white group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-2"} overflow-hidden mb-8 transition-all duration-500`}>
                {event.image ? (
                    <Image src={event.image} alt={event.title} fill className={`object-cover ${isPast ? "" : "group-hover:scale-105 transition-transform duration-700 ease-out"}`} sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                    <div className="w-full h-full bg-amber-50/50 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-amber-200" />
                    </div>
                )}
                {!isPast && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-sm">
                        Upcoming
                    </div>
                )}
            </div>
            <div className={`flex-1 flex flex-col pl-4 border-l ${isPast ? "border-slate-200" : "border-amber-200/50 group-hover:border-amber-400"} transition-colors duration-500`}>
                <h3 className={`font-serif font-bold text-slate-800 mb-4 leading-snug line-clamp-2 ${isPast ? "text-xl" : "text-2xl group-hover:text-amber-700 transition-colors"}`}>{event.title}</h3>
                
                <div className={`flex flex-col gap-2 font-medium tracking-widest uppercase mb-4 ${isPast ? "text-[10px] text-slate-500" : "text-xs text-amber-600"}`}>
                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{formatDate(event.date)}</span>
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{event.time}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{event.venue}</span>
                </div>
                {!isPast && (
                    <div 
                        className="text-slate-500 text-base mb-6 line-clamp-3 font-light leading-relaxed flex-1 prose-sm prose-slate prose-p:my-0 prose-headings:my-0" 
                        dangerouslySetInnerHTML={{ __html: event.description }} 
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fffdfa] relative overflow-hidden font-light pt-20">
            {/* Subtle global paper noise */}
            <div 
                className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-multiply fixed"
                style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
            />

            {/* Banner Section */}
            <div className="relative py-24 text-center border-b border-amber-200/40">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-50/50 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />
                
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <p className="font-serif italic text-amber-600 text-xl tracking-wide mb-4">
                        Happenings
                    </p>
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-slate-800 tracking-tight relative inline-block">
                        Events
                        <svg className="absolute -bottom-1 -left-1 w-[110%] h-3 text-amber-300 stroke-current opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0,5 Q50,-2 100,5" fill="none" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </h1>
                    <p className="text-slate-500 text-xl font-light max-w-2xl mx-auto leading-relaxed mt-4">
                        Join us at our upcoming events and connect with the community.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl py-16 relative z-10">
                {/* Upcoming */}
                <h2 className="font-serif text-3xl font-bold text-slate-800 mb-10 tracking-tight border-b-2 border-amber-100 inline-block">Future Focus</h2>
                {upcoming.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 rounded-[2rem] border border-white/50 backdrop-blur-sm mb-16">
                        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-light">No upcoming events at the moment. Stay tuned!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 mb-24">
                        {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
                    </div>
                )}

                {/* Past */}
                {past.length > 0 && (
                    <>
                        <h2 className="font-serif text-3xl font-bold text-slate-400 mb-10 tracking-tight border-b-2 border-slate-100 inline-block">Past Archives</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 opacity-80">
                            {past.map((event) => <EventCard key={event.id} event={event} isPast />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
